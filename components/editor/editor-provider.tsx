"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ContentValue, Locale } from "@/lib/types";

type SaveState = "idle" | "saving" | "saved" | "error";

interface EditorContextValue {
  locale: Locale;
  isAdmin: boolean;
  editing: boolean;
  setEditing: (value: boolean) => void;
  overrides: Record<string, ContentValue>;
  value: (key: string, fallback: string) => string;
  saveContent: (key: string, value: string) => Promise<boolean>;
  resetContent: (key: string) => Promise<boolean>;
  uploadImage: (file: File) => Promise<string | null>;
  saveState: SaveState;
  message: string | null;
  clearMessage: () => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used inside EditorProvider");
  }
  return context;
}

export function EditorProvider({
  locale,
  isAdmin,
  overrides: initialOverrides,
  children,
}: {
  locale: Locale;
  isAdmin: boolean;
  overrides: Record<string, ContentValue>;
  children: ReactNode;
}) {
  const [editing, setEditingState] = useState(false);
  const [overrides, setOverrides] = useState(initialOverrides);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setOverrides(initialOverrides);
  }, [initialOverrides]);

  useEffect(() => {
    if (!isAdmin) return;
    const stored = window.localStorage.getItem("fsg-editor");
    if (stored === "on") setEditingState(true);
  }, [isAdmin]);

  useEffect(() => {
    document.body.classList.toggle("fsg-editing", editing && isAdmin);
    return () => document.body.classList.remove("fsg-editing");
  }, [editing, isAdmin]);

  useEffect(() => {
    if (saveState !== "saved" && saveState !== "error") return;
    const timer = window.setTimeout(() => setSaveState("idle"), 2600);
    return () => window.clearTimeout(timer);
  }, [saveState]);

  const setEditing = useCallback((value: boolean) => {
    setEditingState(value);
    window.localStorage.setItem("fsg-editor", value ? "on" : "off");
  }, []);

  const value = useCallback(
    (key: string, fallback: string) => {
      const entry = overrides[key];
      const next = entry?.[locale];
      return typeof next === "string" && next.trim().length > 0 ? next : fallback;
    },
    [overrides, locale],
  );

  const saveContent = useCallback(
    async (key: string, nextValue: string) => {
      setSaveState("saving");
      try {
        const response = await fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, locale, value: nextValue }),
        });
        if (!response.ok) throw new Error("save failed");
        setOverrides((current) => ({
          ...current,
          [key]: { ...current[key], [locale]: nextValue },
        }));
        setSaveState("saved");
        setMessage("Đã lưu nội dung vào MongoDB");
        return true;
      } catch {
        setSaveState("error");
        setMessage("Chưa lưu được. Kiểm tra kết nối và thử lại.");
        return false;
      }
    },
    [locale],
  );

  const resetContent = useCallback(async (key: string) => {
    setSaveState("saving");
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, reset: true }),
      });
      if (!response.ok) throw new Error("reset failed");
      setOverrides((current) => {
        const copy = { ...current };
        delete copy[key];
        return copy;
      });
      setSaveState("saved");
      setMessage("Đã khôi phục nội dung gốc");
      return true;
    } catch {
      setSaveState("error");
      setMessage("Không khôi phục được nội dung.");
      return false;
    }
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    setSaveState("saving");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "editor");
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("upload failed");
      const data = (await response.json()) as { url?: string };
      if (!data.url) throw new Error("missing url");
      setSaveState("saved");
      setMessage("Đã tải ảnh lên");
      return data.url;
    } catch {
      setSaveState("error");
      setMessage("Tải ảnh thất bại. Chỉ hỗ trợ JPG, PNG, WEBP, AVIF, SVG tối đa 10 MB.");
      return null;
    }
  }, []);

  const contextValue = useMemo<EditorContextValue>(
    () => ({
      locale,
      isAdmin,
      editing,
      setEditing,
      overrides,
      value,
      saveContent,
      resetContent,
      uploadImage,
      saveState,
      message,
      clearMessage: () => setMessage(null),
    }),
    [
      locale,
      isAdmin,
      editing,
      setEditing,
      overrides,
      value,
      saveContent,
      resetContent,
      uploadImage,
      saveState,
      message,
    ],
  );

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
      {isAdmin ? <EditorStatus state={saveState} message={message} /> : null}
    </EditorContext.Provider>
  );
}

function EditorStatus({ state, message }: { state: SaveState; message: string | null }) {
  if (state === "idle" || !message) return null;
  return (
    <div
      data-editor-ui
      className={`fixed bottom-5 left-1/2 z-[120] -translate-x-1/2 border px-4 py-2 text-[0.75rem] shadow-lg ${
        state === "error"
          ? "border-red-300 bg-red-50 text-red-800"
          : "border-green/40 bg-white text-ink"
      }`}
      role="status"
    >
      {message}
    </div>
  );
}
