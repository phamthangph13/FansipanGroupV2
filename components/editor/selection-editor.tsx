"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ImagePlus, RotateCcw, Save, X } from "lucide-react";
import { useEditor } from "./editor-provider";

type PanelState =
  | {
      kind: "text";
      key: string;
      selector: string;
      textIndex: number;
      original: string;
      value: string;
      left: number;
      top: number;
    }
  | {
      kind: "image";
      key: string;
      selector: string;
      left: number;
      top: number;
    }
  | null;

const TEXT_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,li,span,a,strong,em,small,figcaption,blockquote,td,th,dt,dd,button,label";

function selectorFor(element: Element, root: Element) {
  const parts: string[] = [];
  let node: Element | null = element;

  while (node && node !== root && node.parentElement) {
    const sectionId = node.getAttribute("data-section-id");
    if (sectionId) {
      parts.unshift(`[data-section-id="${sectionId}"]`);
      return parts.join(" > ");
    }

    const parent: Element = node.parentElement;
    const tag = node.tagName.toLowerCase();
    let index = 1;
    let sibling = node.previousElementSibling;
    while (sibling) {
      if (sibling.tagName === node.tagName) index += 1;
      sibling = sibling.previousElementSibling;
    }
    parts.unshift(`${tag}:nth-of-type(${index})`);
    node = parent;
  }

  return `:scope > ${parts.join(" > ")}`;
}

function findElement(root: Element, selector: string) {
  if (!selector) return null;
  try {
    if (selector.startsWith("[data-section-id=") || selector.startsWith(":scope")) {
      return root.querySelector(selector);
    }
    return root.querySelector(`:scope > ${selector}`);
  } catch {
    return null;
  }
}

function directTextNodes(element: Element) {
  return Array.from(element.childNodes).filter(
    (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim().length > 0,
  ) as Text[];
}

function textTarget(target: Element) {
  let node: Element | null = target;
  while (node && node !== document.body) {
    if (directTextNodes(node).length > 0) return node;
    node = node.parentElement;
  }
  return null;
}

function applyOverride(pathname: string, key: string, value: string, root: Element) {
  if (key.startsWith("path:")) {
    const prefix = `path:${pathname}:`;
    if (!key.startsWith(prefix)) return;
    const rest = key.slice(prefix.length);
    const hash = rest.lastIndexOf("#");
    if (hash < 0) return;
    const selector = rest.slice(0, hash);
    const index = Number(rest.slice(hash + 1));
    const element = findElement(root, selector);
    if (!element) return;
    const nodes = directTextNodes(element);
    const node = nodes[index];
    if (node && node.textContent !== value) node.textContent = value;
  } else if (key.startsWith("img:")) {
    const prefix = `img:${pathname}:`;
    if (!key.startsWith(prefix)) return;
    const selector = key.slice(prefix.length);
    const image = findElement(root, selector);
    if (image instanceof HTMLImageElement && value) {
      image.src = value;
      image.srcset = "";
    }
  }
}

export function SelectionEditor() {
  const pathname = usePathname();
  const { editing, isAdmin, overrides, saveContent, resetContent, uploadImage } = useEditor();
  const [panel, setPanel] = useState<PanelState>(null);
  const [busy, setBusy] = useState(false);
  const hovered = useRef<Element | null>(null);
  const dropHovered = useRef<HTMLImageElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const pendingImageKey = useRef<string | null>(null);

  const root = useCallback(() => document.getElementById("main"), []);

  const applyAll = useCallback(() => {
    const main = root();
    if (!main) return;
    for (const [key, entry] of Object.entries(overrides)) {
      const value = entry[pathname.startsWith("/en") ? "en" : "vi"];
      if (typeof value === "string" && value.trim()) {
        applyOverride(pathname, key, value, main);
      }
    }
  }, [overrides, pathname, root]);

  useEffect(() => {
    const timer = window.setTimeout(applyAll, 120);
    const second = window.setTimeout(applyAll, 900);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(second);
    };
  }, [applyAll]);

  useEffect(() => {
    if (!editing || !isAdmin) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-editor-ui]")) return;
      const main = root();
      if (!main || !main.contains(target)) return;
      if (target.closest("[data-edit-key]")) return;
      if (target.closest("script,style,svg,path,input,textarea,select,option,iframe,video")) return;

      const image = target.closest("img");
      if (image && main.contains(image)) {
        event.preventDefault();
        event.stopPropagation();
        const selector = selectorFor(image, main);
        setPanel({
          kind: "image",
          key: `img:${pathname}:${selector}`,
          selector,
          left: Math.min(event.clientX + 12, window.innerWidth - 300),
          top: Math.min(event.clientY + 12, window.innerHeight - 170),
        });
        return;
      }

      const element = textTarget(target);
      if (!element || !main.contains(element)) return;
      const selector = selectorFor(element, main);
      if (!selector) return;
      const nodes = directTextNodes(element);
      if (!nodes.length) return;
      const textIndex = 0;
      const original = nodes[textIndex].textContent ?? "";
      event.preventDefault();
      event.stopPropagation();
      setPanel({
        kind: "text",
        key: `path:${pathname}:${selector}#${textIndex}`,
        selector,
        textIndex,
        original,
        value: original,
        left: Math.min(event.clientX + 12, window.innerWidth - 340),
        top: Math.min(event.clientY + 12, window.innerHeight - 240),
      });
    };

    const onMove = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-editor-ui]")) return;
      const main = root();
      if (!main || !main.contains(target)) return;
      const element = target.closest("img") ?? target.closest(TEXT_SELECTOR) ?? target;
      if (hovered.current === element) return;
      hovered.current?.classList.remove("fsg-generic-hover");
      hovered.current = element;
      if (!element.closest("[data-edit-key]")) element.classList.add("fsg-generic-hover");
    };

    const onClickCapture = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-editor-ui]")) return;
      const main = root();
      if (!main || !main.contains(target)) return;
      if (target.closest("[data-edit-key]")) return;
      if (target.closest("a,button")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // Drag-and-drop image files directly onto any <img> on the page to replace it.
    const onDragOver = (event: DragEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!event.dataTransfer?.types.includes("Files")) return;
      const main = root();
      const image = target.closest("img");
      if (main && image && main.contains(image)) {
        event.preventDefault();
        if (dropHovered.current !== image) {
          dropHovered.current?.classList.remove("fsg-drop-hover");
          dropHovered.current = image;
          image.classList.add("fsg-drop-hover");
        }
      }
    };

    const onDragLeave = (event: DragEvent) => {
      if (dropHovered.current && event.target === dropHovered.current) {
        dropHovered.current.classList.remove("fsg-drop-hover");
        dropHovered.current = null;
      }
    };

    const onDrop = async (event: DragEvent) => {
      const target = event.target;
      if (dropHovered.current) {
        dropHovered.current.classList.remove("fsg-drop-hover");
        dropHovered.current = null;
      }
      if (!(target instanceof Element)) return;
      const file = event.dataTransfer?.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      const main = root();
      const image = target.closest("img");
      if (!main || !image || !main.contains(image)) return;

      event.preventDefault();
      event.stopPropagation();

      const selector = selectorFor(image, main);
      const editKey = image.getAttribute("data-edit-key") || `img:${pathname}:${selector}`;
      setBusy(true);
      const url = await uploadImage(file);
      if (url) {
        const ok = await saveContent(editKey, url);
        if (ok) {
          image.src = url;
          image.srcset = "";
        }
      }
      setBusy(false);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("click", onClickCapture, true);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("dragleave", onDragLeave);
    document.addEventListener("drop", onDrop);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("click", onClickCapture, true);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("dragleave", onDragLeave);
      document.removeEventListener("drop", onDrop);
      hovered.current?.classList.remove("fsg-generic-hover");
      hovered.current = null;
      dropHovered.current?.classList.remove("fsg-drop-hover");
      dropHovered.current = null;
    };
  }, [editing, isAdmin, pathname, root, saveContent, uploadImage]);

  useEffect(() => {
    if (!editing) setPanel(null);
  }, [editing]);

  const saveText = async () => {
    if (!panel || panel.kind !== "text") return;
    const value = panel.value.trim();
    if (!value) return;
    setBusy(true);
    const ok = await saveContent(panel.key, value);
    setBusy(false);
    if (ok) {
      const main = root();
      if (main) {
        const element = findElement(main, panel.selector);
        const node = element ? directTextNodes(element)[panel.textIndex] : null;
        if (node) node.textContent = value;
      }
      setPanel(null);
    }
  };

  const resetText = async () => {
    if (!panel) return;
    setBusy(true);
    await resetContent(panel.key);
    if (panel.kind === "text") {
      const main = root();
      if (main) {
        const element = findElement(main, panel.selector);
        const node = element ? directTextNodes(element)[panel.textIndex] : null;
        if (node) node.textContent = panel.original;
      }
    }
    setBusy(false);
    setPanel(null);
    window.location.reload();
  };

  const chooseImage = (panelState: Extract<PanelState, { kind: "image" }>) => {
    pendingImageKey.current = panelState.key;
    fileRef.current?.click();
  };

  const onFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !pendingImageKey.current) return;
    setBusy(true);
    const url = await uploadImage(file);
    if (url) {
      const ok = await saveContent(pendingImageKey.current, url);
      if (ok) {
        const main = root();
        if (main && panel?.kind === "image") {
          const image = findElement(main, panel.selector);
          if (image instanceof HTMLImageElement) {
            image.src = url;
            image.srcset = "";
          }
        }
      }
    }
    setBusy(false);
    pendingImageKey.current = null;
    setPanel(null);
  };

  if (!isAdmin) return null;

  return (
    <>
      {panel ? (
        <div
          data-editor-ui
          className="fixed z-[130] w-[320px] border border-line bg-white p-4 shadow-2xl"
          style={{ left: panel.left, top: panel.top }}
          role="dialog"
          aria-label="Sửa nội dung"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-accent">
              {panel.kind === "text" ? "Selection Editor · Văn bản" : "Selection Editor · Hình ảnh"}
            </p>
            <button
              type="button"
              onClick={() => setPanel(null)}
              className="text-muted transition-colors hover:text-ink"
              aria-label="Đóng"
            >
              <X className="size-4" />
            </button>
          </div>

          {panel.kind === "text" ? (
            <>
              <textarea
                autoFocus
                value={panel.value}
                onChange={(event) =>
                  setPanel((current) =>
                    current && current.kind === "text"
                      ? { ...current, value: event.target.value }
                      : current,
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Escape") setPanel(null);
                  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) void saveText();
                }}
                className="textarea mt-3 min-h-24 text-[0.86rem]"
              />
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={resetText}
                  disabled={busy}
                  className="inline-flex items-center gap-1 text-[0.68rem] text-muted transition-colors hover:text-ink disabled:opacity-50"
                >
                  <RotateCcw className="size-3" /> Khôi phục gốc
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPanel(null)}
                    className="btn btn-outline btn-sm"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={saveText}
                    disabled={busy || !panel.value.trim()}
                    className="btn btn-primary btn-sm"
                  >
                    <Save className="size-3.5" />
                    {busy ? "Đang lưu…" : "Lưu"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-soft">
                Chọn ảnh mới từ máy hoặc kéo thả trực tiếp tệp ảnh vào vị trí ảnh này để thay thế.
              </p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={resetText}
                  disabled={busy}
                  className="inline-flex items-center gap-1 text-[0.68rem] text-muted transition-colors hover:text-ink disabled:opacity-50"
                >
                  <RotateCcw className="size-3" /> Ảnh gốc
                </button>
                <button
                  type="button"
                  onClick={() => chooseImage(panel)}
                  disabled={busy}
                  className="btn btn-primary btn-sm"
                >
                  <ImagePlus className="size-3.5" />
                  {busy ? "Đang tải…" : "Chọn ảnh mới"}
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}

      <input
        ref={fileRef}
        data-editor-ui
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
        onChange={onFile}
        className="sr-only"
      />
    </>
  );
}
