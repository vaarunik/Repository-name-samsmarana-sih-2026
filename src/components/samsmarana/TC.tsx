"use client";

import { useTC } from "@/lib/i18n";

/**
 * Displays a translation key's text in the selected language, with an English
 * caption underneath (only when the selected language is not English).
 * If English is selected, shows only English (no redundant caption).
 */
export function TC({
  k,
  className,
  captionClassName,
}: {
  k: string;
  className?: string;
  captionClassName?: string;
}) {
  const tc = useTC();
  const { text, caption } = tc(k);
  return (
    <span className={className}>
      {text}
      {caption && (
        <span className={`block text-xs font-normal text-muted-foreground ${captionClassName ?? ""}`}>
          {caption}
        </span>
      )}
    </span>
  );
}
