"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import { useEditor } from "./editor-provider";

export function EditableImage({
  k,
  src,
  alt,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
}: {
  k: string;
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}) {
  const { editing, value, saveContent, uploadImage } = useEditor();
  const [current, setCurrent] = useState(() => value(k, src));
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    const url = await uploadImage(file);
    if (url) {
      const ok = await saveContent(k, url);
      if (ok) setCurrent(url);
    }
    setBusy(false);
  };

  const image = fill ? (
    <Image src={current} alt={alt} fill sizes={sizes} priority={priority} className={className} data-edit-key={k} />
  ) : (
    <Image
      src={current}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      sizes={sizes}
      priority={priority}
      className={className}
      data-edit-key={k}
    />
  );

  if (!editing) {
    return fill ? image : <span className="relative inline-block">{image}</span>;
  }

  return (
    <>
      {image}
      <button
        type="button"
        data-editor-ui
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          inputRef.current?.click();
        }}
        disabled={busy}
        className="absolute right-2 top-2 z-[80] inline-flex items-center gap-1.5 border border-white/70 bg-navy/90 px-2.5 py-1.5 text-[0.68rem] font-medium text-white shadow-lg backdrop-blur transition-colors hover:bg-navy disabled:opacity-60"
      >
        <ImagePlus className="size-3.5" />
        {busy ? "Đang tải…" : "Đổi ảnh"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
        onChange={onChange}
        className="sr-only"
        data-editor-ui
      />
    </>
  );
}
