import type { ElementType } from "react";
import { contentValue, getContentStore } from "@/lib/content";
import type { Locale } from "@/lib/types";
import { EditableText } from "./editable-text";

/**
 * Server wrapper around EditableText. Resolves the saved override on the
 * server so public pages keep their content in the initial HTML.
 */
export async function Editable({
  k,
  locale,
  fallback,
  as,
  className,
  multiline,
  href,
}: {
  k: string;
  locale: Locale;
  fallback: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  href?: string;
}) {
  const store = await getContentStore();
  return (
    <EditableText
      k={k}
      defaultText={contentValue(store, k, locale, fallback)}
      as={as}
      className={className}
      multiline={multiline}
      href={href}
    />
  );
}
