"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects } from "@/content/projects";
import type { Locale } from "@/i18n/config";
import { EmText } from "@/components/EmText";

/**
 * 拍立得陈列台：上方一排小拍立得，点击后当前项目的拍立得放大展示，
 * 右侧配项目介绍（类别 / 标题 / 简介 / 标签 / CTA）。
 * 与 About 区的拍立得同一视觉语言（白框、微斜、签名落款）。
 */
export function PolaroidGallery({
  locale,
  cta,
  title,
  titleEm,
  subtitle,
  subtitleShort,
}: {
  locale: Locale;
  cta: string;
  title: string;
  titleEm?: string;
  subtitle: string;
  subtitleShort: string;
}) {
  const [active, setActive] = useState(0);
  const proj = projects[active] ?? projects[0];
  const projTitle = proj.previewTitle?.[locale] ?? proj.title[locale];
  const summary = proj.previewSummary?.[locale] ?? proj.summary[locale];

  return (
    <div className="relative">
      {/* 标题区（文档流） */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-10 pt-16 text-center sm:px-8">
        <h2 className={`display text-4xl sm:text-5xl ${locale === "zh" ? "font-smiley" : ""}`}>
          <EmText
            text={title}
            em={titleEm}
            emClassName={locale === "zh" ? "serif-em serif-em--cjk" : "serif-em"}
          />
        </h2>
        <p className="mt-4 max-w-xl text-sm text-black/60 sm:text-base">
          <span className="hidden sm:inline">{subtitle}</span>
          <span className="sm:hidden">{subtitleShort}</span>
        </p>
      </div>

      {/* 主陈列：大拍立得 + 右侧项目介绍 */}
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-5 sm:px-8 md:flex-row md:items-center md:gap-16">
        {/* 大拍立得（切换时从下方弹入、微斜落定） */}
        <div className="shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24, rotate: -7 }}
              animate={{ opacity: 1, y: 0, rotate: -2.5 }}
              exit={{ opacity: 0, y: -16, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="w-64 bg-white p-3 pb-12 shadow-[0_20px_50px_rgba(0,0,0,0.16)] sm:w-80"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
                {proj.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={proj.cover}
                    alt={projTitle}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                ) : null}
              </div>
              {/* 签名落款（与 About 拍立得一致） */}
              <div className="mt-3 flex h-6 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="" className="h-4 w-auto opacity-70" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 项目介绍 */}
        <div className="min-w-0 text-center md:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-muted">
                {proj.category[locale]} · {proj.year}
              </p>
              <h3 className="display mt-3 text-3xl text-fg sm:text-5xl">{projTitle}</h3>
              <p className="mt-4 text-sm leading-relaxed text-black/60 sm:text-base">
                {summary}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                {proj.tags[locale].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line px-3 py-1 text-xs text-black/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/${locale}/work/${proj.slug}`}
                className="mt-7 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
              >
                {cta} →
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 小拍立得一排（点击切换；当前项上抬 + 青色描边） */}
      <div className="mx-auto mt-12 flex max-w-4xl items-end justify-center gap-4 overflow-x-auto px-5 pb-6 sm:gap-6">
        {projects.map((p, i) => {
          const t = p.previewTitle?.[locale] ?? p.title[locale];
          const isActive = i === active;
          const tilt = i % 2 === 0 ? "-3deg" : "2.5deg"; // 交替微斜，桌面散落感
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => setActive(i)}
              aria-label={t}
              aria-pressed={isActive}
              className={`group shrink-0 bg-white p-1.5 pb-5 transition-all duration-300 ${
                isActive
                  ? "-translate-y-2 shadow-[0_14px_30px_rgba(0,0,0,0.18)] outline-2 outline-accent"
                  : "shadow-[0_6px_16px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 hover:shadow-[0_12px_26px_rgba(0,0,0,0.16)]"
              }`}
              style={{ transform: `rotate(${tilt})${isActive ? " translateY(-0.5rem)" : ""}` }}
            >
              <span className="block h-20 w-16 overflow-hidden bg-black/5 sm:h-24 sm:w-20">
                {p.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.cover}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
