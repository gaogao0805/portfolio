import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";

/**
 * 「心绪轨迹」情绪版（Mood Board）+ 颜色规范。
 * 四个情绪关键词对应四张氛围图，虚线旅程线贯穿——源自项目情绪版画板。
 * 图片由 Figma 画板节点直接渲染导出（public/images/mood/panels/）。
 * 颜色规范取自项目设计规范稿，用代码重绘。
 */

const PANELS = [
  { key: "warm", label: { zh: "温暖", en: "Warm" } },
  { key: "heal", label: { zh: "治愈", en: "Heal" } },
  { key: "bright", label: { zh: "明亮", en: "Bright" } },
  { key: "relax", label: { zh: "放松", en: "Relax" } },
] as const;

const COLORS = [
  { hex: "#E8A35A", role: { zh: "品牌色", en: "Brand" } },
  { hex: "#AFC7E8", role: { zh: "辅助色", en: "Secondary" } },
  { hex: "#FFEAA5", role: { zh: "辅助色", en: "Secondary" } },
  { hex: "#A1C08C", role: { zh: "辅助色", en: "Secondary" } },
  { hex: "#F7CCD3", role: { zh: "辅助色", en: "Secondary" } },
];

const TONE = { from: "#FF6FA5", to: "#FF9448" } as const;

/** 贯穿四联的虚线旅程（装饰）：S 形蜿蜒 + 四个节点圆点 */
function JourneyDots() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-40 w-full -translate-y-1/2 md:block"
      viewBox="0 0 1200 160"
      fill="none"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="moodBoardJourney" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={TONE.from} stopOpacity="0.8" />
          <stop offset="1" stopColor={TONE.to} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path
        className="journey-flow"
        d="M -20 120 C 180 10, 260 150, 420 80 S 700 0, 820 70 S 1080 150, 1220 40"
        stroke="url(#moodBoardJourney)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1 12"
      />
      {/* 节点：粉橙交替（浅灰底上保持可见），错峰呼吸 */}
      {[
        { cx: 130, cy: 68, fill: TONE.from },
        { cx: 430, cy: 82, fill: "#E8A35A" },
        { cx: 700, cy: 30, fill: TONE.from },
        { cx: 1060, cy: 92, fill: "#E8A35A" },
      ].map((dot, i) => (
        <circle
          key={dot.cx}
          cx={dot.cx}
          cy={dot.cy}
          r="14"
          fill={dot.fill}
          className="journey-dot"
          style={{ animationDelay: `${i * 0.6}s` }}
        />
      ))}
    </svg>
  );
}

export function MoodBoard({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  return (
    <section data-nav-theme="light" className="theme-light bg-bg-gray">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-black/40">
            Mood Board · 情绪版
          </p>
          <h2 className="display mt-3 text-3xl leading-[1.15] text-black sm:text-5xl">
            {isZh ? "温暖、治愈、明亮、放松" : "Warm, heal, bright, relax"}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/55 sm:text-base">
            {isZh
              ? "通过产品定位提炼关键词，从而明确设计方法——视觉上干净整洁，贴合产品用户群体。四个关键词，也是整个视觉语言的四种氛围。"
              : "Keywords distilled from the product's positioning define the design approach — clean visuals tuned to the audience. Four keywords, four atmospheres of the visual language."}
          </p>
        </Reveal>

        <div className="relative mt-12">
          <JourneyDots />
          <div className="relative grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {PANELS.map((panel, i) => (
              <Reveal key={panel.key} delay={i * 0.08}>
                <figure className="group transition-transform duration-500 hover:-translate-y-2">
                  <div className="overflow-hidden rounded-2xl border border-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/mood/panels/${panel.key}.jpg`}
                      alt={panel.label[locale]}
                      className="block aspect-[612/1046] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-baseline gap-2 px-1">
                    <span className="text-sm font-medium text-black/85">
                      {panel.label.zh}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-black/45">
                      {panel.label.en}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 颜色规范 */}
        <div className="mt-12">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-black/40">
              {isZh ? "颜色规范" : "Colors"}
            </p>
          </Reveal>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {COLORS.map((c, i) => (
              <Reveal key={c.hex} delay={i * 0.05}>
                <div
                  className="h-20 rounded-xl border border-black/5 transition-transform duration-300 hover:scale-[1.04] sm:h-24"
                  style={{ backgroundColor: c.hex }}
                />
                <p className="mt-2 text-xs font-medium text-black/70">{c.role[locale]}</p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-black/45">
                  {c.hex}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
