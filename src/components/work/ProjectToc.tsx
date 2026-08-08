"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import type { Locale } from "@/i18n/config";
import type { ProjectTocItem } from "@/content/projects";

/**
 * 项目详情页的悬浮章节导航（参考 adasilv2 项目页）：
 * 顶部居中深色胶囊，返回键在胶囊头部，锚点跳页内板块，滚动跟随高亮。
 * 仅桌面端渲染（移动端让位给 header）；仅当项目在 projects.ts 配了 toc 时挂载。
 * 注意：必须经 portal 挂到 body——页面 main 有 z-10 层叠上下文，
 * 胶囊直接渲染在 main 里会被 z-40 的 header 盖住（点击失效）。
 */
export function ProjectToc({
  locale,
  items,
  backHref,
  backLabel,
}: {
  locale: Locale;
  items: ProjectTocItem[];
  backHref: string;
  backLabel: string;
}) {
  const [active, setActive] = useState(0);
  // portal 需要浏览器环境（SSG 无 document）
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const els = items
      .map((it) => document.getElementById(it.id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = items.findIndex((it) => it.id === e.target.id);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  if (!mounted) return null;

  return createPortal(
    <motion.nav
      aria-label={locale === "zh" ? "章节导航" : "Section navigation"}
      className="fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 sm:block"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center gap-0.5 rounded-full bg-[#161515]/90 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-md">
        {/* 返回键：并入胶囊头部，与章节导航一体 */}
        <Link
          href={backHref}
          aria-label={backLabel}
          className="mr-0.5 flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>
        <span aria-hidden className="mx-1 h-4 w-px bg-white/15" />
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() =>
              document
                .getElementById(it.id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className={`rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-300 ${
              i === active
                ? "bg-white/15 font-medium text-white"
                : "text-white/55 hover:text-white"
            }`}
          >
            {it.label[locale]}
          </button>
        ))}
      </div>
    </motion.nav>,
    document.body
  );
}
