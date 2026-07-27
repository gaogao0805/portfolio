"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import type { Locale } from "@/i18n/config";

/**
 * 「就绪」设计规范：提取自 frontend-app-demo「在线简历 / 公司详情页」的设计系统。
 * 浅灰底 + 白卡（卡片自身就用规范里的 16px 圆角与阴影）。
 */

const SYSTEM_FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif";

const PRIMARY = "#008B68";
const PRIMARY_ACTIVE = "#02A87E";
const PRIMARY_SOFT = "#6FCDAE";
const PRIMARY_BG_LIGHT = "#EBFAF5";
const TEXT_SECONDARY = "#7B838D";
const TEXT_TERTIARY = "#BBC1C9";

/* ---------------- 数据 ---------------- */

/** 大色板卡（参考品牌板排版：右上角圆点 + 卡底 hex 行） */
const BIG_SWATCHES = [
  {
    name: "浅绿家族",
    bg: "linear-gradient(135deg, #EBFAF5 0%, #8FEACC 48%, #6FCDAE 100%)",
    hexes: ["#EBFAF5", "#8FEACC", "#6FCDAE"],
    darkText: true,
  },
  {
    name: "主题色",
    bg: "#008B68",
    hexes: ["#008B68", "#02A87E"],
    darkText: false,
  },
  {
    name: "功能深色",
    bg: "#3A3C3C",
    hexes: ["#3A3C3C", "#D1FFF0"],
    darkText: false,
  },
];

/** 小色板行：文字灰阶 / 背景 / 功能 */
const SMALL_SWATCHES: [string, string, boolean][] = [
  // [名称, 色值, 是否浅色(决定圆点与文字颜色)]
  ["主文本", "#000000", false],
  ["次级文本", "#7B838D", false],
  ["占位符", "#BBC1C9", true],
  ["禁用文本", "#DDE2E8", true],
  ["页面背景", "#FBFBFB", true],
  ["卡片背景", "#FFFFFF", true],
  ["输入框", "#F4F4F4", true],
  ["标签背景", "#F1F2F4", true],
  ["遮罩层", "rgba(0,0,0,0.5)", false],
  ["按钮文字", "#D1FFF0", true],
];

const FONT_SIZES: [string, number, number][] = [
  // [用途, 字号, 字重]
  ["大标题", 20, 600],
  ["卡片标题", 18, 600],
  ["正文 / 字段值", 16, 400],
  ["标签文本", 14, 400],
  ["日期 / 链接", 13, 400],
  ["小标签", 12, 400],
  ["超小按钮", 10, 500],
];

const FONT_WEIGHTS: [string, number][] = [
  ["ExtraLight", 200],
  ["Light", 300],
  ["Regular", 400],
  ["Medium", 500],
  ["SemiBold", 600],
];

const SPACINGS = [4, 8, 12, 16, 20, 24, 28];
/** 间距各档的典型用途（规范原文） */
const SPACING_USES = ["极小间距", "标签/列表项", "字段/组件内", "页面边距", "大间距", "section 间隙", "节点间距"];
const RADII = [2, 4, 6, 8, 12, 16, 999];
/** 圆角各档的典型用途（规范原文） */
const RADIUS_USES: Record<number, string> = {
  2: "指示符",
  4: "标签",
  6: "图标容器",
  8: "logo/输入",
  12: "输入框/侧板",
  16: "卡片/弹窗",
  999: "药丸按钮",
};

/* 字号滑块：吸附 7 档规范字号，行高取规范档位 */
const SLIDER_SIZES = [10, 12, 13, 14, 16, 18, 20];
const LINE_HEIGHTS: Record<number, number> = { 10: 14, 12: 18, 13: 21, 14: 21, 16: 24, 18: 24, 20: 28 };

/** 通用吸附滑块（PrivacySlider 同款交互：可拖可点，就近吸附） */
function SnapSlider({ count, index, onChange }: { count: number; index: number; onChange: (i: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    onChange(Math.round(ratio * (count - 1)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) setFromClientX(e.clientX);
  };

  const pct = (index / (count - 1)) * 100;

  return (
    <div
      ref={trackRef}
      className="relative flex h-6 cursor-pointer touch-none select-none items-center"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      {/* 轨道 */}
      <div className="relative h-1.5 w-full rounded-full" style={{ backgroundColor: "#F1F2F4" }}>
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-[width] duration-150"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${PRIMARY_SOFT}, #02A87E)` }}
        />
        {/* 档位圆点 */}
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors"
            style={{
              left: `${(i / (count - 1)) * 100}%`,
              backgroundColor: i <= index ? "#FFFFFF" : "#D1D5DB",
              boxShadow: i <= index ? "0 0 0 1px rgba(2,168,126,0.35)" : undefined,
            }}
          />
        ))}
        {/* 手柄 */}
        <span
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-[left] duration-150"
          style={{ left: `${pct}%`, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
        />
      </div>
    </div>
  );
}

/* ---------------- 小组件 ---------------- */

/** 参考品牌板：大色板卡（右上角圆点 + 卡底 hex 行） */
function BigSwatch({ name, bg, hexes, darkText }: { name: string; bg: string; hexes: string[]; darkText: boolean }) {
  const fg = darkText ? "rgba(0, 40, 30, 0.72)" : "rgba(255, 255, 255, 0.85)";
  return (
    <div
      className="relative h-36 flex-1 overflow-hidden rounded-3xl"
      style={{ background: bg, minWidth: 180 }}
    >
      <span
        className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: darkText ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.9)" }}
      />
      <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-baseline gap-x-3">
        <span className="text-[11px] font-medium" style={{ color: fg }}>
          {name}
        </span>
        {hexes.map((h) => (
          <span key={h} className="font-mono text-[10px]" style={{ color: fg }}>
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 小色板：长方形横条（撑满整行）+ 右上角圆点 + 名称/色值 */
function SmallSwatch({ name, value, light }: { name: string; value: string; light: boolean }) {
  return (
    <div className="min-w-[72px] flex-1">
      <div
        className="relative h-12 rounded-xl border border-black/[0.06]"
        style={{ backgroundColor: value }}
      >
        <span
          className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
          style={{ backgroundColor: light ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.85)" }}
        />
      </div>
      <p className="mt-1.5 truncate text-[11px] leading-tight" style={{ color: "#000" }}>
        {name}
      </p>
      <p className="truncate font-mono text-[9px] leading-tight" style={{ color: TEXT_TERTIARY }}>
        {value}
      </p>
    </div>
  );
}

function Group({
  title,
  children,
  delay = 0,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <p className="mb-4 text-[13px] font-semibold tracking-[0.5px]" style={{ color: TEXT_SECONDARY }}>
        {title}
      </p>
      {children}
    </motion.div>
  );
}

const HAIRLINE = "1px solid rgba(0,0,0,0.06)";

/* ---------------- 区块 ---------------- */

export function AgentDesignSystem({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  const [sizeIdx, setSizeIdx] = useState(4); // 默认 16px 正文
  const [weightOverride, setWeightOverride] = useState<number | null>(null);
  const [spaceIdx, setSpaceIdx] = useState(3); // 默认 16 页面边距
  const [radiusIdx, setRadiusIdx] = useState(5); // 默认 16 卡片
  const currentSize = SLIDER_SIZES[sizeIdx];
  const currentRow = FONT_SIZES.find(([, s]) => s === currentSize);
  const previewWeight = weightOverride ?? currentRow?.[2] ?? 400;
  const currentRadius = RADII[radiusIdx];

  return (
    <section data-nav-theme="light" className="theme-light" style={{ backgroundColor: "#F1F2F3" }}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-24" style={{ fontFamily: SYSTEM_FONT }}>
          <div className="max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="display mt-4 text-3xl leading-[0.92] sm:text-5xl"
          >
            {isZh ? "设计规范" : "Design system"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-sm leading-relaxed text-muted sm:text-base"
          >
            {isZh
              ? "这套规范提取自在线简历与公司详情页：一套青绿主题色、四级文字灰阶、七档字号与七档圆角，撑起了整个产品的视觉一致性——后面每一个界面，都是它们的组合。"
              : "Tokens extracted from the resume and company pages: one teal primary, four text grays, seven type sizes and seven radii behind the product's visual consistency — every screen below is a composition of them."}
          </motion.p>
        </div>

        <div className="mt-12 flex flex-col gap-10">
          {/* 色彩体系：品牌板色板排版 */}
          <Group title={isZh ? "色彩体系" : "Colors"} delay={0.05}>
            <div className="flex flex-col gap-3 sm:flex-row">
              {BIG_SWATCHES.map((s) => (
                <BigSwatch key={s.name} {...s} />
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-4">
              {SMALL_SWATCHES.map(([name, value, light]) => (
                <SmallSwatch key={name} name={name} value={value} light={light} />
              ))}
            </div>
          </Group>

          <div style={{ borderTop: HAIRLINE }} />

          {/* 字体规范：整行，左预览滑块 / 右阶梯字重 */}
          <Group title={isZh ? "字体规范" : "Typography"} delay={0.12}>
            <div className="grid gap-8 md:grid-cols-2">
              {/* 左：标本舞台 + 滑块 */}
              <div className="flex flex-col justify-center">
                <div
                  className="relative mb-3 flex h-40 items-center justify-center overflow-hidden rounded-2xl"
                  style={{ backgroundColor: "#FAFAFA" }}
                >
                  {/* 标本横线 */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(180deg, transparent 0, transparent 15px, rgba(0,0,0,0.035) 15px, rgba(0,0,0,0.035) 16px)",
                    }}
                  />
                  {/* 巨大底纹字号 */}
                  <span
                    className="pointer-events-none absolute -bottom-4 right-2 select-none font-bold"
                    style={{ fontSize: 76, lineHeight: 1, color: "rgba(0,139,104,0.08)" }}
                  >
                    {currentSize}
                  </span>
                  <span
                    className="relative"
                    style={{
                      fontSize: currentSize,
                      fontWeight: previewWeight,
                      color: "#000",
                      lineHeight: 1.2,
                      transition: "font-size 180ms ease-out",
                    }}
                  >
                    就绪 Ready
                  </span>
                </div>
                <div className="mb-2 flex items-center justify-center gap-2">
                  <span className="rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{ backgroundColor: PRIMARY_BG_LIGHT, color: PRIMARY }}>
                    {currentRow?.[0]}
                  </span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-[11px]" style={{ backgroundColor: "#F1F2F4", color: TEXT_SECONDARY }}>
                    {currentSize}px / {LINE_HEIGHTS[currentSize]}
                  </span>
                </div>
                <SnapSlider count={SLIDER_SIZES.length} index={sizeIdx} onChange={setSizeIdx} />
                <div className="mt-0.5 flex justify-between font-mono text-[9px]" style={{ color: TEXT_TERTIARY }}>
                  <span>10</span>
                  <span>20</span>
                </div>
              </div>

              {/* 右：字号阶梯 + 字重 */}
              <div>
                <div className="flex flex-col">
                  {FONT_SIZES.map(([usage, size, weight], i) => {
                    const active = size === currentSize;
                    return (
                      <button
                        type="button"
                        key={usage}
                        onClick={() => setSizeIdx(SLIDER_SIZES.indexOf(size))}
                        className="-mx-2 flex items-baseline justify-between rounded-md px-2 py-1.5 pl-3 text-left transition-colors"
                        style={{
                          borderBottom: i < FONT_SIZES.length - 1 ? "1px solid rgba(0,0,0,0.05)" : undefined,
                          backgroundColor: active ? PRIMARY_BG_LIGHT : undefined,
                        }}
                      >
                        <span className="relative" style={{ fontSize: size, fontWeight: weight, color: "#000", lineHeight: 1.3 }}>
                          {active && (
                            <span
                              className="absolute -left-2.5 top-1/2 h-[1.1em] w-[3px] -translate-y-1/2 rounded-full"
                              style={{ backgroundColor: "#02A87E" }}
                            />
                          )}
                          就绪 Ready
                        </span>
                        <span
                          className="font-mono text-[10px]"
                          style={{ color: active ? PRIMARY : TEXT_TERTIARY, fontWeight: active ? 600 : 400 }}
                        >
                          {usage} · {size}px
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-end justify-between gap-2">
                  {FONT_WEIGHTS.map(([name, weight]) => {
                    const selected = previewWeight === weight;
                    return (
                      <button
                        type="button"
                        key={name}
                        onClick={() => setWeightOverride(selected && weightOverride !== null ? null : weight)}
                        className="flex flex-col items-center rounded-lg px-2 py-1.5 transition-colors"
                        style={{ backgroundColor: selected ? PRIMARY_BG_LIGHT : "transparent" }}
                      >
                        <span className="text-[20px] text-black" style={{ fontWeight: weight }}>
                          Aa
                        </span>
                        <span className="mt-1 font-mono text-[9px]" style={{ color: selected ? PRIMARY : TEXT_TERTIARY }}>
                          {weight}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-4 text-[11px] leading-relaxed" style={{ color: TEXT_TERTIARY }}>
                  {isZh ? "行高 28 / 24 / 21 / 18 · 强调字距 0.5px · 点字重可预览" : "Line height 28 / 24 / 21 / 18 · tracking 0.5px · tap a weight to preview"}
                </p>
              </div>
            </div>
          </Group>

          <div style={{ borderTop: HAIRLINE }} />

          {/* 间距 + 圆角：拖滑块看实时效果 */}
          <div className="grid gap-8 md:grid-cols-2">
            <Group title={isZh ? "间距系统" : "Spacing"} delay={0.18} className="h-full">
              <div className="flex h-full flex-col">
                <div
                  className="flex h-32 items-center justify-center overflow-hidden rounded-2xl"
                  style={{ backgroundColor: "#FAFAFA" }}
                >
                  {/* 标签的 gap 实时跟随档位 */}
                  <div
                    className="flex rounded-xl border bg-white p-3 shadow-sm"
                    style={{ gap: SPACINGS[spaceIdx], transition: "gap 220ms ease-out", borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    {["React Native", "组件库", "性能优化"].map((t) => (
                      <span key={t} className="whitespace-nowrap rounded px-2.5 py-1 text-[11px] text-black" style={{ backgroundColor: "#F1F2F4" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="my-2 flex items-center justify-center gap-2">
                  <span className="rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{ backgroundColor: PRIMARY_BG_LIGHT, color: PRIMARY }}>
                    {SPACING_USES[spaceIdx]}
                  </span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-[11px]" style={{ backgroundColor: "#F1F2F4", color: TEXT_SECONDARY }}>
                    {SPACINGS[spaceIdx]}px
                  </span>
                </div>
                <div className="mt-auto">
                  <SnapSlider count={SPACINGS.length} index={spaceIdx} onChange={setSpaceIdx} />
                  <div className="mt-0.5 flex justify-between font-mono text-[9px]" style={{ color: TEXT_TERTIARY }}>
                    <span>4</span>
                    <span>28</span>
                  </div>
                </div>
              </div>
            </Group>

            <Group title={isZh ? "圆角规范" : "Radius"} delay={0.24} className="h-full">
              <div className="flex h-full flex-col">
                <div
                  className="flex h-32 items-center justify-center overflow-hidden rounded-2xl"
                  style={{ backgroundColor: "#FAFAFA" }}
                >
                  {/* 组件圆角实时变形 */}
                  <div
                    className="flex items-center gap-2.5 border bg-white px-4 py-3 shadow-sm"
                    style={{
                      borderRadius: currentRadius,
                      transition: "border-radius 220ms ease-out",
                      borderColor: "rgba(0,0,0,0.06)",
                    }}
                  >
                    <span
                      className="h-8 w-8 shrink-0"
                      style={{
                        background: `linear-gradient(135deg, #8FEACC, ${PRIMARY})`,
                        borderRadius: Math.min(currentRadius, 8),
                        transition: "border-radius 220ms ease-out",
                      }}
                    />
                    <span className="flex flex-col gap-1.5">
                      <span className="h-2 w-20 rounded-full" style={{ backgroundColor: "#E5E7EB" }} />
                      <span className="h-2 w-12 rounded-full" style={{ backgroundColor: "#F1F2F4" }} />
                    </span>
                  </div>
                </div>
                <div className="my-2 flex items-center justify-center gap-2">
                  <span className="rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{ backgroundColor: PRIMARY_BG_LIGHT, color: PRIMARY }}>
                    {RADIUS_USES[currentRadius]}
                  </span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-[11px]" style={{ backgroundColor: "#F1F2F4", color: TEXT_SECONDARY }}>
                    {currentRadius}
                  </span>
                </div>
                <div className="mt-auto">
                  <SnapSlider count={RADII.length} index={radiusIdx} onChange={setRadiusIdx} />
                  <div className="mt-0.5 flex justify-between font-mono text-[9px]" style={{ color: TEXT_TERTIARY }}>
                    <span>2</span>
                    <span>999</span>
                  </div>
                </div>
              </div>
            </Group>
          </div>
        </div>
      </div>
    </section>
  );
}
