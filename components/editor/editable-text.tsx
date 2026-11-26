"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type KeyboardEvent,
  type FocusEvent,
  type MouseEvent,
} from "react";
import { cn } from "@/lib/utils";
import { useEditor } from "./editor-provider";

export function EditableText({
  k,
  defaultText,
  as = "span",
  className,
  href,
  multiline = false,
}: {
  k: string;
  defaultText: string;
  as?: ElementType;
  className?: string;
  href?: string;
  multiline?: boolean;
}) {
  const { editing, value, saveContent } = useEditor();
  const resolved = value(k, defaultText);
  const [text, setText] = useState(resolved);
  const focused = useRef(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!focused.current) setText(resolved);
  }, [resolved]);

  const tag: ElementType = editing && (as === "a" || as === "button") ? "span" : as;

  const onFocus = () => {
    focused.current = true;
  };

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    focused.current = false;
    const next = (event.currentTarget.innerText ?? "").replace(/\u00a0/g, " ").trim();
    if (!next || next === text) {
      setText(next || text);
      event.currentTarget.innerText = next || text;
      return;
    }
    setText(next);
    void saveContent(k, next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.currentTarget.blur();
      return;
    }
    if (event.key === "Enter" && !multiline && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (editing) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return createElement(
    tag,
    {
      ref: (node: HTMLElement | null) => {
        elementRef.current = node;
      },
      className: cn(
        editing && "fsg-editable cursor-text rounded-[2px]",
        editing && multiline && "whitespace-pre-line",
        className,
      ),
      href: editing ? undefined : href,
      contentEditable: editing || undefined,
      suppressContentEditableWarning: true,
      spellCheck: false,
      "data-edit-key": k,
      onClick,
      onFocus,
      onBlur,
      onKeyDown,
      title: editing ? "Click để sửa nội dung" : undefined,
    },
    text,
  );
}
