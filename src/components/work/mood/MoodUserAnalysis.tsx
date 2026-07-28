"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import type { Locale } from "@/i18n/config";
import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";

/**
 * 「心绪轨迹」用户分析：按调研稿用 SVG 重绘（不贴原图）。
 * 左 = 测试得分环形图；右 = 问卷最高得分项饼图。
 * 环形图比例由原图像素测量还原：84.83 / 3.31 / 8.55 / 3.31。
 * 动效：分段扫入式入场；悬停/点按分段加粗聚焦并显示占比；饼图楔形旋转切入。
 */

/** 环形图配色（原图取色） */
const DONUT_COLORS = {
  orange: "#E8A35A", // 40–55
  tan: "#A08060", // 25–39
  beige: "#E0C0A0", // 10–24
  olive: "#C0C090", // 0–9
};
const PIE_GRAY = "#A87860";
const CALLOUT = "#C2703E";

type DonutSeg = {
  key: string;
  color: string;
  /** 起始角度°（0°=顶部，顺时针） */
  start: number;
  /** 跨度° */
  span: number;
  range: string;
  pct: string;
};

const DONUT_SEGS: DonutSeg[] = [
  { key: "orange", color: DONUT_COLORS.orange, start: 145.6, span: 305.4, range: "40–55", pct: "84.83%" },
  { key: "tan", color: DONUT_COLORS.tan, start: 91, span: 11.9, range: "25–39", pct: "3.31%" },
  { key: "beige", color: DONUT_COLORS.beige, start: 102.9, span: 30.8, range: "10–24", pct: "8.55%" },
  { key: "olive", color: DONUT_COLORS.olive, start: 133.7, span: 11.9, range: "0–9", pct: "3.31%" },
];

const DONUT_R = 78;
const DONUT_C = 2 * Math.PI * DONUT_R;

/** 入场编排：橙色主段先扫满一圈，小分段随后接续 */
const SEG_ANIM: Record<string, { delay: number; duration: number }> = {
  orange: { delay: 0.1, duration: 1.15 },
  tan: { delay: 1.05, duration: 0.3 },
  beige: { delay: 1.2, duration: 0.35 },
  olive: { delay: 1.35, duration: 0.3 },
};

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** 单个环形分段：进入视口后沿弧线扫入；悬停/点按加粗、其余变暗 */
function DonutSegment({
  seg,
  activeKey,
  onActivate,
}: {
  seg: DonutSeg;
  activeKey: string | null;
  onActivate: (key: string | null) => void;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const progress = useMotionValue(0);
  const dasharray = useTransform(progress, (p) => `${p} ${DONUT_C - p}`);

  useEffect(() => {
    if (!inView) return;
    const a = SEG_ANIM[seg.key];
    const controls = animate(progress, (DONUT_C * seg.span) / 360, {
      duration: a.duration,
      delay: a.delay,
      ease: EASE_OUT,
    });
    return () => controls.stop();
  }, [inView, progress, seg]);

  const isActive = activeKey === seg.key;
  return (
    <motion.circle
      ref={ref}
      cx="120"
      cy="120"
      r={DONUT_R}
      fill="none"
      stroke={seg.color}
      strokeDasharray={dasharray}
      strokeDashoffset={(-DONUT_C * seg.start) / 360}
      animate={{
        strokeWidth: isActive ? 38 : 30,
        opacity: activeKey === null || isActive ? 1 : 0.35,
      }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => onActivate(seg.key)}
      onMouseLeave={() => onActivate(null)}
      onClick={() => onActivate(isActive ? null : seg.key)}
      style={{ cursor: "pointer" }}
    >
      <title>{`${seg.range} · ${seg.pct}`}</title>
    </motion.circle>
  );
}

/** 测试得分环形图：84.83 / 3.31 / 8.55 / 3.31（从顶部顺时针排布，小分段在右侧） */
function ScoreDonut({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const activeSeg = DONUT_SEGS.find((s) => s.key === activeKey);
  return (
    <div>
      <svg
        viewBox="0 0 300 240"
        className="w-full max-w-[420px]"
        role="img"
        aria-label="84.83% / 3.31% / 8.55% / 3.31%"
      >
        <g transform="rotate(-90 120 120)">
          {DONUT_SEGS.map((seg) => (
            <DonutSegment
              key={seg.key}
              seg={seg}
              activeKey={activeKey}
              onActivate={setActiveKey}
            />
          ))}
        </g>
        {/* 标注（分段扫入完成后淡入） */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <text x="210" y="44" fill={CALLOUT} fontSize="14" fontWeight="600">
            84.83%
          </text>
          <path d="M186 54 L204 48" stroke={CALLOUT} strokeWidth="0.75" />
        </motion.g>
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 1.65, duration: 0.5 }}
        >
          <text x="224" y="136" fill={CALLOUT} fontSize="14" fontWeight="600">
            3.31%
          </text>
          <path d="M214 131 L220 133" stroke={CALLOUT} strokeWidth="0.75" />
        </motion.g>
      </svg>
      {/* 占比读数：悬停/点按分段时更新（固定高度避免抖动） */}
      <p className="mt-1 h-5 text-xs text-black/55 sm:text-sm">
        {activeSeg
          ? isZh
            ? `${activeSeg.range}分 · ${activeSeg.pct}`
            : `${activeSeg.range} pts · ${activeSeg.pct}`
          : isZh
            ? "悬停 / 点按分段查看占比"
            : "Hover or tap a segment for its share"}
      </p>
    </div>
  );
}

/** 问卷饼图：橙色圆弹入，灰色楔形（11.86%）旋转切入 */
function SurveyPie() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full max-w-[180px] shrink-0"
      role="img"
      aria-label="88.14%"
    >
      <motion.circle
        cx="100"
        cy="100"
        r="88"
        fill={DONUT_COLORS.orange}
        initial={{ scale: 0.4, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: EASE_OUT }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <motion.path
        d="M100 100 L184.6 75.7 A88 88 0 0 1 178.6 139.7 Z"
        fill={PIE_GRAY}
        initial={{ rotate: -40, opacity: 0 }}
        whileInView={{ rotate: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
        style={{ transformBox: "view-box", transformOrigin: "100px 100px" }}
      />
    </svg>
  );
}

/** 得分区间说明 */
const SCORE_NOTES: { color: string; zh: string; en: string }[] = [
  {
    color: DONUT_COLORS.orange,
    zh: "40–55分可能患有双相情感障碍",
    en: "40–55: likely living with bipolar disorder",
  },
  {
    color: DONUT_COLORS.tan,
    zh: "25–39分可能患有某种程度的抑郁症或轻度双相情感障碍",
    en: "25–39: some degree of depression or mild bipolar disorder",
  },
  {
    color: DONUT_COLORS.beige,
    zh: "10–24分可能有一定程度的单向抑郁",
    en: "10–24: possible unipolar depression",
  },
];

export function MoodUserAnalysis({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  return (
    <section data-nav-theme="light" className="theme-light bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-black/40">
            USER RESEARCH
          </p>
          <h2 className="display mt-3 text-3xl leading-[1.15] text-black sm:text-5xl">
            {isZh ? "用户分析" : "User analysis"}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-black/60 sm:text-base">
            {isZh ? (
              <>
                从简单的测试结果可以看出，
                <span className="bg-gradient-to-r from-[#FF6FA5] to-[#FF9448] bg-clip-text font-semibold text-transparent">
                  88.41%
                </span>
                的受访者现在情绪不稳定，情绪容易波动。只有一小部分受访者情绪稳定。
              </>
            ) : (
              <>
                From a simple screening test,{" "}
                <span className="bg-gradient-to-r from-[#FF6FA5] to-[#FF9448] bg-clip-text font-semibold text-transparent">
                  88.41%
                </span>{" "}
                of respondents are currently emotionally unstable and prone to
                mood swings — only a small portion are emotionally stable.
              </>
            )}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* 左：测试得分分布 */}
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/40">
                {isZh ? "测试得分分布" : "Test score distribution"}
              </p>
              <div className="mt-4">
                <ScoreDonut locale={locale} />
              </div>
              {/* 图例 */}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
                {[
                  { range: "40–55", color: DONUT_COLORS.orange },
                  { range: "25–39", color: DONUT_COLORS.tan },
                  { range: "10–24", color: DONUT_COLORS.beige },
                  { range: "0–9", color: DONUT_COLORS.olive },
                ].map((item) => (
                  <span
                    key={item.range}
                    className="flex items-center gap-1.5 text-xs text-black/60"
                  >
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 rounded-[3px]"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.range}
                    {isZh ? "分" : ""}
                  </span>
                ))}
              </div>
              <ul className="mt-4 space-y-1.5">
                {SCORE_NOTES.map((note) => (
                  <li
                    key={note.color}
                    className="flex items-start gap-2 text-xs leading-relaxed text-black/55 sm:text-sm"
                  >
                    <span
                      aria-hidden
                      className="mt-1 h-2.5 w-2.5 shrink-0 rounded-[3px]"
                      style={{ backgroundColor: note.color }}
                    />
                    {note[locale]}
                  </li>
                ))}
              </ul>
            </div>

            {/* 右：问卷最高得分项 */}
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/40">
                {isZh ? "问卷最高得分项" : "Top-scoring survey item"}
              </p>
              <div className="mt-6 flex items-center gap-6">
                <SurveyPie />
                <div>
                  <p className="display bg-gradient-to-r from-[#FF6FA5] to-[#FF9448] bg-clip-text text-4xl text-transparent sm:text-5xl">
                    <CountUp to={88.14} decimals={2} suffix="%" />
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-black/50 sm:text-sm">
                    {isZh
                      ? "受访者认为自己更符合这一情况"
                      : "of respondents identified with this"}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-black/55 sm:text-sm">
                {isZh ? (
                  <>
                    问卷关于受访者“是否有时候过于自卑，有时过于自信”，平均分最高。评分为
                    <span className="bg-gradient-to-r from-[#FF6FA5] to-[#FF9448] bg-clip-text font-semibold text-transparent">
                      3.78
                    </span>
                    。
                  </>
                ) : (
                  <>
                    The highest average score —{" "}
                    <span className="bg-gradient-to-r from-[#FF6FA5] to-[#FF9448] bg-clip-text font-semibold text-transparent">
                      3.78
                    </span>{" "}
                    — went to the item asking respondents whether they
                    &ldquo;sometimes feel overly self-abased, and sometimes
                    overly confident&rdquo;.
                  </>
                )}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
