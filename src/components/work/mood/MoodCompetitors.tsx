import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";

/**
 * 「心绪轨迹」竞品分析：按调研结论用代码重绘（不贴原图）。
 * 一张 2×2 定位散点图讲完整个故事：每个竞品 = 图标 + 名字 + 10 格功能热力条，
 * 热力条顺序对应图下方的功能对照表；右上缺口象限是本品位置。
 * 数据来自用户调研稿，后续调整直接改 FEATURES / COMPETITORS。
 */

type Mark = "yes" | "partial" | "no";

/** 热力条从左到右对应的 10 个功能维度 */
const FEATURES: { zh: string; en: string }[] = [
  { zh: "情绪记录", en: "Mood tracking" },
  { zh: "AI 对话/陪伴", en: "AI chat" },
  { zh: "生理数据（HRV/心率）", en: "Biometrics (HRV/HR)" },
  { zh: "可视化数据", en: "Visualization" },
  { zh: "压力自动触发提醒", en: "Stress alerts" },
  { zh: "心理练习/课程", en: "Exercises" },
  { zh: "解压小游戏", en: "Mini games" },
  { zh: "习惯/目标体系", en: "Habits/goals" },
  { zh: "月度趋势分析", en: "Monthly trends" },
  { zh: "社交分享", en: "Sharing" },
];

const MARK_LABEL: Record<Mark, { zh: string; en: string }> = {
  yes: { zh: "强支持", en: "Strong" },
  partial: { zh: "部分/弱支持", en: "Partial" },
  no: { zh: "无", en: "None" },
};

type Competitor = {
  name: string;
  icon: string;
  /** x 0=生理数据驱动 → 100=情绪表达/陪伴；y 0=轻量工具 → 100=深度疗愈 */
  x: number;
  y: number;
  /** 10 格热力条，顺序同 FEATURES */
  marks: Mark[];
  /** 脚注补充（名字后标 *） */
  note?: { zh: string; en: string };
};

const Y: Mark = "yes";
const P: Mark = "partial";
const N: Mark = "no";

const COMPETITORS: Competitor[] = [
  {
    name: "StressWatch",
    icon: "/images/competitors/stresswatch.jpg",
    x: 10,
    y: 35,
    marks: [P, N, Y, N, Y, N, N, N, Y, N],
  },
  {
    name: "AMood",
    icon: "/images/competitors/amood.jpg",
    x: 22,
    y: 50,
    marks: [Y, N, Y, N, Y, P, N, Y, Y, N],
  },
  {
    name: "解压小橙子",
    icon: "/images/competitors/orange.jpg",
    x: 28,
    y: 16,
    marks: [P, N, Y, N, Y, N, Y, N, P, N],
  },
  {
    name: "Grow",
    icon: "/images/competitors/grow.jpg",
    x: 48,
    y: 26,
    marks: [P, N, N, P, N, P, N, Y, P, N],
  },
  {
    name: "MOODA",
    icon: "/images/competitors/mooda.jpg",
    x: 66,
    y: 38,
    marks: [Y, N, N, Y, N, N, N, N, Y, Y],
  },
  {
    name: "心光",
    icon: "/images/competitors/xinguang.jpg",
    x: 83,
    y: 50,
    marks: [Y, Y, N, Y, N, P, N, N, Y, N],
  },
  {
    name: "林间聊愈室",
    icon: "/images/competitors/forest.jpg",
    x: 89,
    y: 60,
    marks: [Y, Y, N, N, N, Y, N, Y, Y, N],
    note: { zh: "习惯/目标体系为「成长路径」", en: "habits system is a growth path" },
  },
  {
    name: "心境奇旅",
    icon: "/images/competitors/journey.jpg",
    x: 80,
    y: 72,
    marks: [Y, P, N, N, N, Y, N, Y, Y, N],
    note: { zh: "AI 对话为「有引导」", en: "AI chat is guided" },
  },
];

/** 本品落点：生理（手环）+ 表达（AI）兼具，且面向深度病症管理 → 右上缺口 */
const STAR = { x: 60, y: 90 };

const STRIP_STYLE: Record<Mark, string> = {
  yes: "bg-gradient-to-br from-[#FF6FA5] to-[#FF9448]",
  partial: "border border-[#E8A35A]/70 bg-transparent",
  no: "bg-black/[0.08]",
};

/** 结论句里的强调短语（粉橙渐变） */
function Em({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-[#FF6FA5] to-[#FF9448] bg-clip-text font-semibold text-transparent">
      {children}
    </span>
  );
}

/** 单个竞品：图标 + 名字 + 热力条（x≥62 时整体向左展开，防止越界） */
function CompetitorMark({ c, locale }: { c: Competitor; locale: Locale }) {
  return (
    <div
      className="absolute -translate-y-1/2"
      style={{ left: `${c.x}%`, top: `${100 - c.y}%` }}
    >
      <div
        className={`flex items-center gap-1.5 ${
          c.x >= 62 ? "-translate-x-full flex-row-reverse" : ""
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.icon}
          alt={c.name}
          className="h-[22px] w-[22px] shrink-0 rounded-[6px] shadow-sm"
        />
        <div className="flex flex-col gap-1">
          <span className="whitespace-nowrap text-[11px] leading-none text-black/70">
            {c.name}
            {c.note ? <span className="text-black/35">*</span> : null}
          </span>
          <div className="flex gap-[3px]">
            {c.marks.map((mark, i) => (
              <span
                key={i}
                title={`${FEATURES[i][locale]} · ${MARK_LABEL[mark][locale]}`}
                className={`h-[9px] w-[9px] rounded-[2.5px] ${STRIP_STYLE[mark]}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 2×2 产品定位散点图 */
function PositioningMap({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  return (
    <div className="overflow-x-auto">
      <div className="relative aspect-[16/10] min-w-[620px] rounded-3xl border border-black/10 bg-[#FAEFDD]/30">
        {/* 象限分隔线 */}
        <div aria-hidden className="absolute inset-y-0 left-1/2 border-l border-dashed border-black/10" />
        <div aria-hidden className="absolute inset-x-0 top-1/2 border-t border-dashed border-black/10" />
        {/* 右上缺口象限：粉橙淡晕染 */}
        <div
          aria-hidden
          className="absolute right-0 top-0 h-1/2 w-1/2 rounded-tr-3xl bg-gradient-to-br from-[#FF6FA5]/[0.06] to-[#FF9448]/[0.10]"
        />

        {/* 轴标签 */}
        <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-wider text-black/40">
          ↑ {isZh ? "深度疗愈" : "Deep healing"}
        </span>
        <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-wider text-black/40">
          ↓ {isZh ? "轻量工具" : "Lightweight tools"}
        </span>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-black/40">
          {isZh ? "← 生理数据驱动" : "← Biometric-driven"}
          <span className="mx-2 text-black/20">|</span>
          {isZh ? "情绪表达 / AI 陪伴 →" : "Expression / AI companion →"}
        </span>

        {/* 竞品散点（图标 + 热力条） */}
        {COMPETITORS.map((c) => (
          <CompetitorMark key={c.name} c={c} locale={locale} />
        ))}

        {/* 本品星标：右上缺口 */}
        <div
          className="absolute"
          style={{ left: `${STAR.x}%`, top: `${100 - STAR.y}%` }}
        >
          <div className="flex -translate-y-1/2 items-center gap-2 pl-1">
            <span className="relative flex h-4 w-4 -translate-x-1/2 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#FF8A5C]/30" />
              <span className="block h-4 w-4 rounded-full bg-gradient-to-br from-[#FF6FA5] to-[#FF9448] shadow-md ring-2 ring-white" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="whitespace-nowrap text-[11px] font-semibold text-black/80">
                {isZh ? "心绪轨迹" : "Mood Trace"}
              </span>
              <span className="whitespace-nowrap rounded-full border border-[#FF9448]/50 bg-white/85 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#E8725A]">
                {isZh ? "市场缺口" : "The gap"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MoodCompetitors({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  return (
    <section data-nav-theme="light" className="theme-light bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-black/40">
            USER RESEARCH
          </p>
          <h2 className="display mt-3 text-3xl leading-[1.15] text-black sm:text-5xl">
            {isZh ? "竞品分析" : "Competitive analysis"}
          </h2>

          {/* 定位散点图（含热力条） */}
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-black/40">
            {isZh
              ? "定位图 · 名字下方为功能热力条"
              : "Positioning map · heat strip under each name"}
          </p>
          <div className="mt-3">
            <PositioningMap locale={locale} />
          </div>

          {/* 热力条对照 + 图例 */}
          <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div className="min-w-[300px] flex-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/40">
                {isZh ? "热力条对照（从左到右）" : "Heat strip key (left to right)"}
              </p>
              <ol className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-5">
                {FEATURES.map((f, i) => (
                  <li
                    key={f.zh}
                    className="flex items-baseline gap-1.5 text-[11px] leading-snug text-black/55"
                  >
                    <span className="font-mono text-[9px] text-black/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {f[locale]}
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px] tracking-wider text-black/45">
              {(["yes", "partial", "no"] as const).map((mark) => (
                <span key={mark} className="flex items-center gap-1.5">
                  <span
                    aria-hidden
                    className={`h-3 w-3 rounded-[3px] ${STRIP_STYLE[mark]}`}
                  />
                  {MARK_LABEL[mark][locale]}
                </span>
              ))}
            </div>
          </div>

          {/* 脚注 */}
          <p className="mt-3 text-[11px] leading-relaxed text-black/40">
            {isZh
              ? "* 心境奇旅：AI 对话为「有引导」；林间聊愈室：习惯/目标体系为「成长路径」。"
              : "* 心境奇旅: AI chat is guided; 林间聊愈室: the habits system is a growth path."}
          </p>

          <div className="mt-8 max-w-4xl space-y-4">
            <p className="text-sm leading-relaxed text-black/60 sm:text-base">
              {isZh
                ? "当前主流的情绪记录与疗愈类产品大多集中在两类路径：一类以 StressWatch、AMood 为代表，强调生理数据驱动的压力监测；另一类如 MOODA、心光和林间聊愈室，更关注情绪表达、可视化呈现和 AI 陪伴式疗愈。解压小橙子和 Grow 等则提供轻量化的解压或行为成长工具，但缺乏深层情绪理解。"
                : "Mainstream mood-tracking and healing products cluster around two paths: one, represented by StressWatch and AMood, emphasizes biometric-driven stress monitoring; the other, such as MOODA, 心光 and 林间聊愈室, focuses on emotional expression, visualization, and AI companionship. Products like 解压小橙子 and Grow offer lightweight stress-relief or habit-building tools, but lack deeper emotional understanding."}
            </p>
            <p className="rounded-2xl border border-black/10 bg-gradient-to-r from-[#FF6FA5]/[0.06] to-[#FF9448]/[0.06] p-5 text-sm leading-relaxed text-black/75 sm:text-base">
              {isZh ? (
                <>
                  从整体来看，市场尚缺乏兼具
                  <Em>“情绪表达的仪式感”</Em>、<Em>“智能趋势洞察”</Em>与
                  <Em>“可操作的疗愈训练”</Em>
                  的综合产品。
                </>
              ) : (
                <>
                  Overall, the market still lacks a product that combines{" "}
                  <Em>a ritual of emotional expression</Em>,{" "}
                  <Em>intelligent trend insight</Em>, and{" "}
                  <Em>actionable healing exercises</Em>.
                </>
              )}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
