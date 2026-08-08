import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";

/**
 * 「心绪轨迹」竞品分析：按调研结论用代码重绘（不贴原图）。
 * 一张直接画在页面上的对照表：发丝行线 + 符号标记，无卡片容器。
 * 数据来自用户调研稿，后续调整直接改 COMPETITORS / ROWS。
 */

type Mark = "yes" | "partial" | "no";

type Competitor = {
  name: string;
  icon: string;
};

const COMPETITORS: Competitor[] = [
  { name: "StressWatch", icon: "/images/competitors/stresswatch.jpg" },
  { name: "AMood", icon: "/images/competitors/amood.jpg" },
  { name: "解压小橙子", icon: "/images/competitors/orange.jpg" },
  { name: "Grow", icon: "/images/competitors/grow.jpg" },
  { name: "MOODA", icon: "/images/competitors/mooda.jpg" },
  { name: "心光", icon: "/images/competitors/xinguang.jpg" },
  { name: "林间聊愈室", icon: "/images/competitors/forest.jpg" },
  { name: "心境奇旅", icon: "/images/competitors/journey.jpg" },
];

const Y: Mark = "yes";
const P: Mark = "partial";
const N: Mark = "no";

/** 对照表行：cells 顺序同 COMPETITORS；note 时功能名后标 *，释义在表下脚注 */
const ROWS: { label: { zh: string; en: string }; cells: Mark[]; note?: boolean }[] = [
  { label: { zh: "情绪记录", en: "Mood tracking" }, cells: [P, Y, P, P, Y, Y, Y, Y] },
  {
    label: { zh: "AI 对话/陪伴", en: "AI chat / companion" },
    cells: [N, N, N, N, N, Y, Y, P],
    note: true,
  },
  { label: { zh: "生理数据（HRV/心率）", en: "Biometrics (HRV/HR)" }, cells: [Y, Y, Y, N, N, N, N, N] },
  { label: { zh: "可视化数据", en: "Data visualization" }, cells: [N, N, N, P, Y, Y, N, N] },
  { label: { zh: "压力自动触发提醒", en: "Auto stress alerts" }, cells: [Y, Y, Y, N, N, N, N, N] },
  { label: { zh: "心理练习/课程", en: "Exercises / courses" }, cells: [N, P, N, P, N, P, Y, Y] },
  { label: { zh: "解压小游戏", en: "Relaxing mini games" }, cells: [N, N, Y, N, N, N, N, N] },
  {
    label: { zh: "习惯/目标体系", en: "Habits / goals" },
    cells: [N, Y, N, Y, N, N, Y, Y],
    note: true,
  },
  { label: { zh: "月度趋势分析", en: "Monthly trends" }, cells: [Y, Y, P, P, Y, Y, Y, Y] },
  { label: { zh: "社交分享", en: "Social sharing" }, cells: [N, N, N, N, Y, N, N, N] },
];

const MARK_STYLE: Record<"partial" | "no", { glyph: string; className: string }> = {
  partial: { glyph: "△", className: "text-[#E8A35A]" },
  no: { glyph: "✕", className: "text-black/25" },
};

const MARK_LABEL: Record<Mark, { zh: string; en: string }> = {
  yes: { zh: "强支持", en: "Strong" },
  partial: { zh: "部分/弱支持", en: "Partial" },
  no: { zh: "无", en: "None" },
};

/** 吸底列底色 = 页面底色 */
const STICKY_BG = "bg-white";

/** 全表共用的勾号渐变定义（只渲染一次） */
function YesGradientDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="moodYesGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF6FA5" />
          <stop offset="1" stopColor="#FF9448" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** 强支持勾：SVG 粗描边渐变，比字体符号更醒目 */
function YesCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path
        d="M2.5 8.8l3.6 3.6L13.5 4.4"
        fill="none"
        stroke="url(#moodYesGrad)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 单元格符号：yes 用 SVG 粗勾，partial/no 用字体符号 */
function MarkGlyph({ mark, className }: { mark: Mark; className?: string }) {
  if (mark === "yes") return <YesCheck className={className} />;
  return (
    <span className={`text-base leading-none ${MARK_STYLE[mark].className} ${className ?? ""}`}>
      {MARK_STYLE[mark].glyph}
    </span>
  );
}

/** 结论句里的强调短语（粉橙渐变） */
function Em({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-[#FF6FA5] to-[#FF9448] bg-clip-text font-semibold text-transparent">
      {children}
    </span>
  );
}

function Legend({ locale }: { locale: Locale }) {
  return (
    <div className="flex items-center gap-4 font-sans text-[11px] tracking-wider text-black/45">
      {(["yes", "partial", "no"] as const).map((mark) => (
        <span key={mark} className="flex items-center gap-1">
          <MarkGlyph mark={mark} className="h-3.5 w-3.5" />
          {MARK_LABEL[mark][locale]}
        </span>
      ))}
    </div>
  );
}

/** 功能对照表（发丝线 + 纯符号，无卡片） */
function FeatureTable({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  return (
    <div>
      <YesGradientDefs />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-black/40">
          {isZh ? "功能对照" : "Feature comparison"}
        </p>
        <Legend locale={locale} />
      </div>
      <table className="mt-2 w-full border-collapse">
        <thead>
          <tr className="border-b border-black/10">
            <th scope="col" className={`sticky left-0 ${STICKY_BG} py-2.5 pr-4 text-left`}>
              <span className="sr-only">{isZh ? "功能维度" : "Features"}</span>
            </th>
            {COMPETITORS.map((c) => (
              <th key={c.name} scope="col" className="px-1.5 py-2.5 align-bottom">
                <div className="flex flex-col items-center gap-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.icon}
                    alt=""
                    className="h-[22px] w-[22px] rounded-[6px] shadow-sm"
                  />
                  <span className="whitespace-nowrap text-[10px] font-medium text-black/60">
                    {c.name}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label.zh} className="border-b border-black/[0.07]">
              <th
                scope="row"
                className={`sticky left-0 ${STICKY_BG} py-2 pr-4 text-left text-xs font-normal whitespace-nowrap text-black/70 sm:text-sm`}
              >
                {row.label[locale]}
                {row.note ? <span className="text-black/35">*</span> : null}
              </th>
              {row.cells.map((mark, i) => (
                <td key={COMPETITORS[i].name} className="px-1.5 py-2 text-center">
                  <span
                    title={`${COMPETITORS[i].name} · ${row.label[locale]} · ${MARK_LABEL[mark][locale]}`}
                  >
                    <MarkGlyph mark={mark} className="inline-block h-4 w-4 align-[-2px]" />
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MoodCompetitors({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  return (
    <section data-nav-theme="light" className="theme-light bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
        <Reveal>
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-black/40">
            USER RESEARCH
          </p>
          <h2 className="display mt-3 text-3xl leading-[1.15] text-black sm:text-5xl">
            {isZh ? "竞品分析" : "Competitive analysis"}
          </h2>

          {/* 对照表：直接画在页面上，移动端横滑 */}
          <div className="mt-8 overflow-x-auto">
            <div className="min-w-[880px]">
              <FeatureTable locale={locale} />
            </div>
          </div>

          {/* 脚注 */}
          <p className="mt-3 text-[11px] leading-relaxed text-black/40">
            {isZh
              ? "* AI 对话/陪伴：心境奇旅为「有引导」；习惯/目标体系：林间聊愈室为「成长路径」。"
              : "* AI chat: guided on 心境奇旅; habits/goals: a growth path on 林间聊愈室."}
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
