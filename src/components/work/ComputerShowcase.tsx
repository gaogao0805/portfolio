"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { projects } from "@/content/projects";
import type { Locale } from "@/i18n/config";

/**
 * macOS 桌面作品架：一台访达窗口播当前项目（封面 + 信息），
 * 旁边一列 macOS 蓝色文件夹桌面图标，点击切换（淡入淡出 + 轻微回弹）。
 */

/** macOS 风格文件夹图标（蓝色渐变 + 后页标签） */
function MacFolderIcon({ active }: { active: boolean }) {
  return (
    <svg width="46" height="38" viewBox="0 0 46 38" fill="none" aria-hidden>
      {/* 后页 */}
      <path
        d="M2 6a4 4 0 0 1 4-4h9l4 4h21a4 4 0 0 1 4 4v2H2V6Z"
        fill={active ? "#7fc4f5" : "#5aa9e6"}
      />
      {/* 前页 */}
      <path
        d="M0 12a4 4 0 0 1 4-4h38a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V12Z"
        fill={active ? "#a5d8fa" : "#7ec2f0"}
      />
      {/* 前页高光 */}
      <path
        d="M0 12a4 4 0 0 1 4-4h38a4 4 0 0 1 4 4v2H0v-2Z"
        fill="#ffffff"
        opacity="0.35"
      />
    </svg>
  );
}

export function ComputerShowcase({
  locale,
  active,
  onSelect,
  cta,
}: {
  locale: Locale;
  active: number;
  onSelect: (i: number) => void;
  cta: string;
}) {
  const proj = projects[active] ?? projects[0];
  const title = proj.previewTitle?.[locale] ?? proj.title[locale];
  const summary = proj.previewSummary?.[locale] ?? proj.summary[locale];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-5 pb-24 sm:px-8 md:flex-row md:items-center md:gap-8">
      {/* macOS 窗口 */}
      <div className="w-full max-w-2xl flex-1">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1e1e20] shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
          {/* 标题栏：三灯 + 居中标题 */}
          <div className="relative flex h-9 items-center bg-[#2a2a2d] px-3.5">
            <span className="flex gap-2">
              <i className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <i className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <i className="h-3 w-3 rounded-full bg-[#28c840]" />
            </span>
            <span className="absolute left-1/2 -translate-x-1/2 truncate font-sans text-xs font-medium text-white/70">
              {title}
            </span>
          </div>
          {/* 内容区：封面 + 底部信息条 */}
          <div className="relative aspect-[16/10] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {proj.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={proj.cover}
                    alt={title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: proj.gradient }} />
                )}
                {/* 信息条 */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent p-4">
                  <div className="min-w-0">
                    <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-white/60">
                      {proj.category[locale]} · {proj.year}
                    </p>
                    <p className="display mt-1 truncate text-xl text-white sm:text-2xl">
                      {title}
                    </p>
                    <p className="mt-1 hidden truncate text-xs text-white/70 sm:block">
                      {summary}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/work/${proj.slug}`}
                    className="shrink-0 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-black transition-transform hover:-translate-y-0.5 sm:text-sm"
                  >
                    {cta} →
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* macOS 桌面图标列（图标在上、文字在下，选中蓝底） */}
      <div className="flex w-full gap-1 overflow-x-auto md:w-32 md:flex-col md:gap-2 md:overflow-visible">
        {projects.map((p, i) => {
          const t = p.previewTitle?.[locale] ?? p.title[locale];
          const isActive = i === active;
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={isActive}
              className="group flex w-20 shrink-0 flex-col items-center gap-1.5 rounded-lg p-1.5 md:w-full"
            >
              <span
                className={`transition-transform duration-200 ${
                  isActive ? "-translate-y-0.5" : "group-hover:-translate-y-0.5"
                }`}
              >
                <MacFolderIcon active={isActive} />
              </span>
              <span
                className={`max-w-full truncate rounded px-1.5 py-0.5 text-[11px] leading-tight ${
                  isActive
                    ? "bg-[#2f7cf6] text-white"
                    : "text-white/75 group-hover:text-white"
                }`}
              >
                {t}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
