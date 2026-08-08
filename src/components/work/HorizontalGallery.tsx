"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/content/projects";
import type { Locale } from "@/i18n/config";
import { EmText } from "@/components/EmText";

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

/**
 * 横向卡片条（普通横滑）：原生 overflow-x 滚动 + CSS scroll-snap 居中，
 * 居中的当前项目清晰放大，两侧随距离模糊、压暗、缩小。
 * 标题在文档流里，不锁定、不劫持页面滚动。
 */
export function HorizontalGallery({
  locale,
  cta,
  title,
  titleEm,
}: {
  locale: Locale;
  cta: string;
  title: string;
  titleEm?: string;
}) {
  const N = projects.length;
  const trackRef = useRef<HTMLDivElement>(null);
  // 连续焦点位置（按渲染索引 0..3N，跨副本连续），由横条自身的 scrollLeft 驱动
  const [pos, setPos] = useState(0);
  const step = 350 + 28; // 卡宽 + 间距（gap-7）
  // 无限循环：渲染 3 份，初始停在中间份，滚进两侧副本时无感跳回中间
  const COPIES = 3;
  const list = Array.from({ length: COPIES }, () => projects).flat();
  // 展示用当前项（0..N-1，跨副本取模）
  const activeIdx = ((Math.round(pos) % N) + N) % N;

  // 拖拽滚动的点击抑制：拖动过的按下不触发卡片点击
  const stripDragRef = useRef<{ x: number; sl: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 挂载后跳到中间副本的起点（scrollLeft=0 处是第 0 份）
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = N * step;
    setPos(N);
  }, [N, step]);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setPos(el.scrollLeft / step);
    // 空闲时校正回中间副本（视觉效果完全一样的位置，瞬间跳）
    if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    loopTimerRef.current = setTimeout(() => {
      const el2 = trackRef.current;
      if (!el2) return;
      const cur = el2.scrollLeft;
      if (cur < N * step) el2.scrollLeft = cur + N * step;
      else if (cur >= 2 * N * step) el2.scrollLeft = cur - N * step;
    }, 120);
  };

  // 点侧卡：滚到离当前位置最近的那个副本居中（scroll-snap 收吸附尾）
  const goTo = (i: number) => {
    const candidates = [i, i + N, i + 2 * N];
    const nearest = candidates.reduce((a, b) =>
      Math.abs(b - pos) < Math.abs(a - pos) ? b : a
    );
    trackRef.current?.scrollTo({ left: nearest * step, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* 头部编辑区：左上大标题，右侧为当前对焦项目的简介（随滑动切换） */}
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-10 pt-16 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <h2
          className={`display shrink-0 text-5xl leading-none sm:text-7xl ${
            locale === "zh" ? "font-smiley" : ""
          }`}
        >
          <EmText
            text={title}
            em={titleEm}
            emClassName={locale === "zh" ? "serif-em serif-em--cjk" : "serif-em"}
          />
        </h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="max-w-md sm:text-right"
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-muted">
              {projects[activeIdx].category[locale]} · {projects[activeIdx].year}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-black/60 sm:text-base">
              {projects[activeIdx].previewSummary?.[locale] ??
                projects[activeIdx].summary[locale]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 横滑卡片区：relative 容器挂中轴线，滚动条本体可左右拖滑 */}
      <div className="relative">
        {/* 中轴线：1px 竖线标记焦点位 */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 z-20 h-full w-px bg-black/10"
        />
        <div
          ref={trackRef}
          onScroll={onScroll}
          onPointerDown={(e) => {
            stripDragRef.current = { x: e.clientX, sl: e.currentTarget.scrollLeft, moved: false };
          }}
          onPointerMove={(e) => {
            const d = stripDragRef.current;
            if (!d) return;
            const dx = e.clientX - d.x;
            if (Math.abs(dx) > 6) d.moved = true;
            if (d.moved) e.currentTarget.scrollLeft = d.sl - dx;
          }}
          onPointerUp={() => {
            if (stripDragRef.current?.moved) suppressClickRef.current = true;
            stripDragRef.current = null;
          }}
          onPointerCancel={() => {
            stripDragRef.current = null;
          }}
          onClickCapture={(e) => {
            if (suppressClickRef.current) {
              e.preventDefault();
              e.stopPropagation();
              suppressClickRef.current = false;
            }
          }}
          className="flex snap-x snap-mandatory items-center gap-7 overflow-x-auto py-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ paddingLeft: "calc(50% - 175px)", paddingRight: "calc(50% - 175px)" }}
        >
          {list.map((proj, i) => {
            const t = proj.previewTitle?.[locale] ?? proj.title[locale];
            const d = Math.abs(i - pos); // 与焦点的卡距（连续，跨副本也正确）
            const isActive = d < 0.5;
            return (
              <div
                key={`${proj.slug}-${Math.floor(i / N)}`}
                className="w-[350px] shrink-0 snap-center select-none"
                style={{
                  transform: `scale(${isActive ? 1 : Math.max(1 - d * 0.09, 0.82)})`,
                  filter: `blur(${Math.min(d * 3.5, 8)}px) brightness(${
                    isActive ? 1 : Math.max(1 - d * 0.3, 0.4)
                  })`,
                  transition: "filter 0.15s linear",
                }}
              >
                {(() => {
                  // 参考风格：文字直接做进卡面——角落小字 + 底部大标题
                  const cardInner = (
                    <div
                      className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-line bg-bg-soft shadow-xl"
                    >
                      {proj.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={proj.cover}
                          alt={t}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          draggable={false}
                        />
                      ) : null}
                      {/* 底部压暗，保证白字可读 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/25" />
                      {/* 顶部角落小字 */}
                      <p className="absolute left-5 top-4 font-sans text-[10px] uppercase tracking-[0.22em] text-white/85">
                        {proj.category[locale]}
                      </p>
                      <p className="absolute right-5 top-4 font-sans text-[10px] uppercase tracking-[0.22em] text-white/85">
                        {proj.year}
                      </p>
                      {/* 底部：大标题 + 职责小字（始终居中，不和卡面自带排版打架） */}
                      <div className="absolute inset-x-4 bottom-5 text-center">
                        <h3 className="display text-3xl leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-4xl">
                          {t}
                        </h3>
                        <p className="mt-1.5 font-sans text-[11px] uppercase tracking-[0.22em] text-white/75">
                          {proj.role[locale]}
                        </p>
                      </div>
                    </div>
                  );
                  // 只有焦点卡能进详情页；侧卡点击 = 滚过去点亮
                  return isActive ? (
                    <Link href={`/${locale}/work/${proj.slug}`} className="group block">
                      {cardInner}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => goTo(i % N)}
                      tabIndex={-1}
                      aria-label={locale === "zh" ? `切换到 ${t}` : `Focus ${t}`}
                      className="group block w-full cursor-pointer"
                    >
                      {cardInner}
                    </button>
                  );
                })()}
              </div>
            );
          })}
        </div>

        {/* 移动端：左右滑动提示小字（卡片流下方，普通文档流） */}
        <p className="mt-3 text-center text-[11px] tracking-wide text-muted sm:hidden">
          {locale === "zh" ? "左右滑动查看更多" : "Swipe for more"}
        </p>

        {/* 刻度尺指示器（卡片流下方居中，跟随文档流不再压卡面） */}
        <div className="mt-5 flex justify-center pb-2">
          <div className="relative flex items-end gap-[6px]">
            {Array.from({ length: N * 4 - 3 }).map((_, i) => {
              const major = i % 4 === 0;
              const isActive = major && i / 4 === activeIdx;
              return (
                <span
                  key={i}
                  className={`w-[2px] rounded-full transition-colors duration-200 ${
                    major ? "h-4" : "h-2"
                  } ${isActive ? "bg-accent" : "bg-black/25"}`}
                />
              );
            })}
            <span
              aria-hidden
              className="absolute -bottom-[3px] h-[22px] w-[18px] rounded-md border border-black/50 transition-[left] duration-300 ease-out"
              style={{ left: activeIdx * 32 - 8 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
