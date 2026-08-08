"use client";

import { useEffect, useState } from "react";

type RailItem = {
  id: string;
  number: string;
  title: string;
};

type Props = {
  items: RailItem[];
};

export function PosterCollectionRail({ items }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (!items.length) return;

    const els = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target.id) return;
        setActiveId(visible.target.id);
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.2, 0.35, 0.5, 0.65],
      }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="sticky top-24 self-start">
      <div className="hidden lg:flex flex-col gap-5 border-l border-line pl-5">
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="group relative flex items-center gap-3 text-left"
            >
              <span
                className="absolute -left-[25px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all"
                style={{
                  background: active ? "var(--color-accent)" : "var(--color-line)",
                  boxShadow: active
                    ? "0 0 0 4px color-mix(in srgb, var(--color-accent) 20%, transparent)"
                    : "none",
                }}
              />
              <span
                className={`font-sans text-xs ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                {item.number}
              </span>
              <span
                className={`truncate text-sm transition-colors group-hover:text-fg ${
                  active ? "text-fg" : "text-muted"
                }`}
              >
                {item.title}
              </span>
            </a>
          );
        })}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-line text-muted"
              }`}
            >
              {item.number} {item.title}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
