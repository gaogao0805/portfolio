"use client";

import { useState } from "react";

export function CopyButton({
  value,
  copy,
  copied,
}: {
  value: string;
  copy: string;
  copied: string;
}) {
  const [done, setDone] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      // 剪贴板不可用时静默失败
    }
  }

  return (
    <button
      onClick={onCopy}
      className="rounded-full border border-line px-3 py-1 font-sans text-xs text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {done ? copied : copy}
    </button>
  );
}
