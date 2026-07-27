"use client";

import { createContext, useContext, useRef } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * 滚动进度时间线 —— 关于页「工作 / 项目 / 教育」共用的一条脊柱。
 * - 竖线随滚动以 紫→青 渐变填充，末端带一颗发光彗头；
 * - 区块标题用菱形节点（TimelineSection），经历用圆形节点（TimelineItem）；
 * - 节点经过视口中部时点亮，描边「幽灵年份」浮现并带轻微视差，
 *   当前阅读区间的内容提亮、其余压暗（焦点跟随滚动）。
 *
 * 支持深 / 浅两种底色（tone）：光束渐变、日期高亮等走主题 token
 * （theme-light 会自动反转）；节点颜色用十六进制字面量而非 CSS 变量，
 * 因为 motion 无法对 var() 做插值，字面量才能让点亮过程平滑过渡。
 */

type TimelineTone = "dark" | "light";

const TONES = {
  dark: {
    nodeOff: {
      scale: 1,
      backgroundColor: "#14141b",
      borderColor: "#26262f",
      boxShadow: "0 0 0 0 rgba(25,255,231,0)",
    },
    nodeOn: {
      scale: 1.35,
      backgroundColor: "#19ffe7",
      borderColor: "#19ffe7",
      boxShadow: "0 0 14px 3px rgba(25,255,231,0.55)",
    },
    cometGlow: "shadow-[0_0_16px_4px_rgba(25,255,231,0.65)]",
    backdrop: "from-bg-soft",
  },
  light: {
    nodeOff: {
      scale: 1,
      backgroundColor: "#f5f5f5",
      borderColor: "#d4d4da",
      boxShadow: "0 0 0 0 rgba(13,181,162,0)",
    },
    nodeOn: {
      scale: 1.35,
      backgroundColor: "#0db5a2",
      borderColor: "#0db5a2",
      boxShadow: "0 0 14px 3px rgba(13,181,162,0.4)",
    },
    cometGlow: "shadow-[0_0_16px_4px_rgba(13,181,162,0.45)]",
    backdrop: "from-bg-gray",
  },
} as const;

const ToneContext = createContext<TimelineTone>("dark");

const SPRING = { stiffness: 90, damping: 24, mass: 0.3 };

export function Timeline({
  children,
  className,
  tone = "dark",
}: {
  children: ReactNode;
  className?: string;
  tone?: TimelineTone;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.6", "end 0.5"],
  });
  const progress = useSpring(scrollYProgress, SPRING);
  const cometTop = useTransform(progress, (v) => `${v * 100}%`);
  const cometOpacity = useTransform(progress, [0, 0.04], [0, 1]);
  const t = TONES[tone];

  return (
    <ToneContext.Provider value={tone}>
      <div ref={ref} className={`relative ${className ?? ""}`}>
        {/* 脊柱层：轨道 + 进度光束 + 彗头 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-3 left-0 w-[11px]"
        >
          <div className="absolute left-[5px] h-full w-px bg-line" />
          <motion.div
            style={{ scaleY: progress }}
            className="absolute left-[4px] h-full w-[3px] origin-top rounded-full bg-[linear-gradient(to_bottom,var(--color-accent-2),var(--color-accent))]"
          />
          <motion.div
            style={{ top: cometTop, opacity: cometOpacity }}
            className="absolute left-[5.5px]"
          >
            <div
              className={`h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ${t.cometGlow}`}
            />
          </motion.div>
        </div>
        {children}
      </div>
    </ToneContext.Provider>
  );
}

export function TimelineSection({
  index,
  title,
  children,
  className,
}: {
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  // 标题是 sticky 的，不能用自身做在视判定——以整个 section
  // 是否占据视口中线作为「当前章节」信号。
  const ref = useRef<HTMLElement>(null);
  const active = useInView(ref, { margin: "-50% 0px -50% 0px" });
  const t = TONES[useContext(ToneContext)];

  return (
    <section ref={ref} className={className}>
      {/* 粘性章节标题：吸附在导航栏下，直到本章节滚完 */}
      <div className="sticky top-[69px] z-30 sm:top-[61px]">
        {/* 背景：上部实心、下缘渐隐，滚过的内容自然没入 */}
        <div
          aria-hidden
          className={`absolute inset-x-0 top-0 h-[calc(100%+24px)] bg-gradient-to-b ${t.backdrop} from-[75%] to-transparent`}
        />
        <div className="relative flex items-center gap-3 pb-5 pl-8 pt-2">
          <motion.span
            aria-hidden
            initial={false}
            animate={active ? "on" : "off"}
            variants={{ off: t.nodeOff, on: t.nodeOn }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="absolute left-[1px] top-[13px] h-[9px] w-[9px] rotate-45 border-2"
          />
          <span className="font-mono text-xs text-accent">{index}</span>
          <h2
            className={`font-mono text-sm font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${
              active ? "text-fg" : "text-muted"
            }`}
          >
            {title}
          </h2>
        </div>
      </div>
      <ol className="mt-6 space-y-7">{children}</ol>
    </section>
  );
}

export function TimelineItem({
  period,
  children,
}: {
  period: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const active = useInView(ref, { margin: "-48% 0px -50% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yearY = useTransform(scrollYProgress, [0, 1], [14, -14]);
  const year = period.match(/\d{4}/)?.[0] ?? "";
  const t = TONES[useContext(ToneContext)];

  return (
    <li ref={ref} className="relative grid gap-2 pl-8 sm:grid-cols-[170px_1fr]">
      {/* 幽灵年份：描边大字，点亮时浮现，随滚动轻微视差 */}
      <motion.span
        aria-hidden
        initial={false}
        animate={active ? "on" : "off"}
        variants={{ off: { opacity: 0.05 }, on: { opacity: 0.18 } }}
        transition={{ duration: 0.6 }}
        style={{
          y: yearY,
          WebkitTextStroke: "1px var(--color-accent)",
          color: "transparent",
        }}
        className="display pointer-events-none absolute -top-4 left-8 hidden select-none text-6xl sm:block"
      >
        {year}
      </motion.span>
      {/* 圆形节点 */}
      <motion.span
        aria-hidden
        initial={false}
        animate={active ? "on" : "off"}
        variants={{ off: t.nodeOff, on: t.nodeOn }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="absolute left-0 top-[6px] h-[11px] w-[11px] rounded-full border-2"
      />
      <span
        className={`relative font-mono text-sm transition-colors duration-500 ${
          active ? "text-accent" : "text-muted"
        }`}
      >
        {period}
      </span>
      <div
        className={`relative max-w-2xl transition-opacity duration-500 ${
          active ? "opacity-100" : "opacity-60"
        }`}
      >
        {children}
      </div>
    </li>
  );
}
