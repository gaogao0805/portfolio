"use client";

import { motion } from "motion/react";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";

/**
 * 「心绪轨迹」产品方向：Kano 核心诉求（坐标图）+ 四个产品目标 + 设计策略。
 * 内容按项目调研稿用代码重绘（不贴原图）。
 * 注：原稿中红色下行曲线标为「期望型」，按标准 Kano 应为「反向型」，此处已更正。
 */

const TONE = { from: "#FF6FA5", to: "#FF9448" } as const;

type KanoCategory = {
  key: string;
  color: string;
  title: { zh: string; en: string };
  points: { zh: string[]; en: string[] };
};

const CATEGORIES: KanoCategory[] = [
  {
    key: "attractive",
    color: "#FF6FA5",
    title: { zh: "魅力型", en: "Delighters" },
    points: {
      zh: ["沉浸式疗愈互动（小任务、引导式呼吸、冥想）", "心境旅程式体验（像游戏一样成长）", "AI 伴侣（情绪伙伴自动提醒与洞察）"],
      en: ["Immersive healing interactions (tasks, guided breathing, meditation)", "Journey-like experience (grow like a game)", "AI companion (proactive reminders & insight)"],
    },
  },
  {
    key: "mustbe",
    color: "rgba(0,0,0,0.72)",
    title: { zh: "必备型", en: "Must-haves" },
    points: {
      zh: ["情绪记录（日志 + 心情打卡）", "历史情绪曲线与数据回顾", "隐私保护（锁定、加密、本地存储）", "简洁稳定的界面体验", "每日总结 / 心情趋势洞察"],
      en: ["Mood logging (journal + check-in)", "History curves & data review", "Privacy (lock, encryption, on-device)", "Clean, stable interface", "Daily recap / mood trend insight"],
    },
  },
  {
    key: "performance",
    color: "#E8A35A",
    title: { zh: "期望型", en: "Expected" },
    points: {
      zh: ["情绪分析 & 建议（AI 解读、标签建议）", "多样记录方式（文字、照片、语音）"],
      en: ["Mood analysis & suggestions (AI readings, tags)", "Multiple ways to log (text, photos, voice)"],
    },
  },
  {
    key: "reverse",
    color: "#C96A6A",
    title: { zh: "反向型", en: "Reverse" },
    points: {
      zh: ["过度提醒 / 强制推送", "强社交绑定", "武断的 AI 权威分析", "复杂的填写步骤", "侵入式订阅与广告"],
      en: ["Excessive reminders / forced pushes", "Forced social binding", "Dogmatic AI authoritative analysis", "Complex input steps", "Intrusive subscriptions & ads"],
    },
  },
];

const GOALS = [
  {
    zh: "打造轻松且无压力的情绪记录体验",
    en: "An effortless, pressure-free way to log moods",
    descZh: "以最低门槛记录情绪——文字、Emoji、语音、照片等多模态输入，降低表达负担，让记录成为日常行为，而不是任务。",
    descEn: "Log with the lowest possible friction — text, emoji, voice or photos — so recording becomes a daily habit, not a chore.",
  },
  {
    zh: "构建沉浸式、可持续的疗愈体验",
    en: "Immersive, sustainable healing",
    descZh: "通过声音、场景、小任务、互动式疗愈和虚拟情绪伙伴，让用户获得放松、陪伴与心理缓冲，实现情绪的自我调节与恢复。",
    descEn: "Sound, scenes, small tasks, interactive healing and a virtual companion give users relaxation, company and mental room to self-regulate and recover.",
  },
  {
    zh: "提供可靠且不打扰的情绪洞察",
    en: "Reliable, unobtrusive mood insight",
    descZh: "透过 AI 与数据分析，给用户提供不冒犯、不武断的情绪理解与趋势反馈，帮助自我觉察，而不带来被“评判”或“催促”的反感。",
    descEn: "AI and data analysis offer gentle, non-judgmental readings and trend feedback — self-awareness without feeling judged or pushed.",
  },
  {
    zh: "形成长期陪伴与正向成长机制",
    en: "Long-term companionship & growth",
    descZh: "温和的引导、阶段性的成就以及情绪旅程式的成长路径，帮助用户建立自我理解、规律与韧性，让情绪管理成为长期习惯。",
    descEn: "Gentle guidance, staged achievements and a journey-like growth path build self-understanding, rhythm and resilience — making mood management a lasting habit.",
  },
];

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** 强调短语（粉橙渐变字） */
function Em({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bg-gradient-to-r bg-clip-text font-semibold text-transparent"
      style={{ backgroundImage: `linear-gradient(to right, ${TONE.from}, ${TONE.to})` }}
    >
      {children}
    </span>
  );
}

/** Kano 坐标图：轴 + 四条需求曲线（滚动扫入），类别标签随后淡入 */
function KanoChart({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  const axisColor = "#D5D5D5";
  // 曲线：[类别 key, 路径, 入场延迟]
  const curves: [string, string, number][] = [
    ["attractive", "M100 279 C170 292 255 294 315 264 S485 172 595 100", 0.2],
    ["mustbe", "M460 600 C465 480 490 420 550 355 S690 255 730 235", 0.5],
    ["performance", "M240 545 L645 135", 0.8],
    ["reverse", "M250 105 L745 595", 1.1],
  ];
  const markerOf: Record<string, string> = {
    attractive: "url(#kanoArrPink)",
    mustbe: "url(#kanoArrDark)",
    performance: "url(#kanoArrOrange)",
    reverse: "url(#kanoArrRed)",
  };
  const labelAt: Record<string, [number, number]> = {
    attractive: [548, 76],
    mustbe: [640, 215],
    performance: [232, 600],
    reverse: [640, 606],
  };
  const catOf = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));
  return (
    <svg
      viewBox="0 0 800 640"
      className="mx-auto w-full max-w-[560px]"
      role="img"
      aria-label={isZh ? "Kano 需求模型" : "Kano model"}
    >
      <defs>
        <marker id="kanoAxis" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill={axisColor} />
        </marker>
        <marker id="kanoArrPink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="#FF6FA5" />
        </marker>
        <marker id="kanoArrDark" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="#1a1a1a" />
        </marker>
        <marker id="kanoArrOrange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="#E8A35A" />
        </marker>
        <marker id="kanoArrRed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="#C96A6A" />
        </marker>
      </defs>

      {/* 中心虚线圆 */}
      <circle cx="400" cy="320" r="140" fill="none" stroke="rgba(0,0,0,0.12)" strokeDasharray="4 6" />

      {/* 坐标轴 */}
      <line x1="60" y1="320" x2="712" y2="320" stroke={axisColor} strokeWidth="5" markerEnd="url(#kanoAxis)" />
      <line x1="400" y1="590" x2="400" y2="68" stroke={axisColor} strokeWidth="5" markerEnd="url(#kanoAxis)" />

      {/* 轴标签 */}
      <text x="60" y="356" fill="rgba(0,0,0,0.4)" fontSize="15" fontWeight="600">
        {isZh ? "具备程度低" : "Low implementation"}
      </text>
      <text x="712" y="356" fill="rgba(0,0,0,0.4)" fontSize="15" fontWeight="600" textAnchor="end">
        {isZh ? "具备程度高" : "High implementation"}
      </text>
      <text x="424" y="60" fill="rgba(0,0,0,0.4)" fontSize="15" fontWeight="600">
        {isZh ? "满意度高" : "High satisfaction"}
      </text>
      <text x="424" y="600" fill="rgba(0,0,0,0.4)" fontSize="15" fontWeight="600">
        {isZh ? "满意度低" : "Low satisfaction"}
      </text>

      {/* 四条需求曲线：滚动扫入 */}
      {curves.map(([key, d, delay]) => (
        <motion.path
          key={key}
          d={d}
          fill="none"
          stroke={catOf[key].color}
          strokeWidth="3"
          strokeLinecap="round"
          markerEnd={markerOf[key]}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay, ease: EASE_OUT }}
        />
      ))}

      {/* 曲线类别标签 */}
      {curves.map(([key]) => (
        <motion.text
          key={key}
          x={labelAt[key][0]}
          y={labelAt[key][1]}
          fill={catOf[key].color}
          fontSize="16"
          fontWeight="700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          {catOf[key].title[locale]}
        </motion.text>
      ))}
    </svg>
  );
}

/** 单个类别的功能清单 */
function KanoList({
  cat,
  locale,
  className = "",
}: {
  cat: KanoCategory;
  locale: Locale;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-sm font-bold" style={{ color: cat.color }}>
        {cat.title[locale]}
      </p>
      <ul className="mt-2 space-y-1.5">
        {cat.points[locale].map((pt) => (
          <li key={pt} className="flex items-start gap-2 text-xs leading-relaxed text-black/60 sm:text-[13px]">
            <span
              aria-hidden
              className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MoodDirection({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  const [attractive, mustbe, performance, reverse] = CATEGORIES;
  return (
    <section data-nav-theme="light" className="theme-light bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-black/40">
            Product Direction
          </p>
          <h2 className="display mt-3 text-3xl leading-[1.15] text-black sm:text-5xl">
            {isZh ? "产品方向" : "Product direction"}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-black/60 sm:text-base">
            {isZh
              ? "通过前期调研总结用户画像，以马斯洛需求层次理论为基础、结合 Kano 模型提炼用户需求，确定产品的思路和方向。"
              : "Building on user personas from earlier research, needs are distilled through Maslow's hierarchy and the Kano model to set the product's direction."}
          </p>
        </Reveal>

        {/* Kano 核心诉求：坐标图 + 四周清单（宽屏三列网格围绕，窄屏图下两列） */}
        <div className="mt-6 lg:mt-10 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,560px)_minmax(0,1fr)] xl:gap-x-12 xl:gap-y-10">
          <div className="xl:col-start-2 xl:row-start-1 xl:row-span-3 xl:self-center">
            <KanoChart locale={locale} />
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:contents">
            <KanoList cat={attractive} locale={locale} className="xl:col-start-3 xl:row-start-1" />
            <KanoList cat={mustbe} locale={locale} className="xl:col-start-3 xl:row-start-2" />
            <KanoList cat={performance} locale={locale} className="xl:col-start-1 xl:row-start-3 xl:self-end" />
            <KanoList cat={reverse} locale={locale} className="xl:col-start-3 xl:row-start-3" />
          </div>
        </div>

        {/* 产品目标：四张卡 */}
        <div className="mt-12">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-black/40">
              {isZh ? "产品目标" : "Product goals"}
            </p>
          </Reveal>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {GOALS.map((g, i) => (
              <Reveal key={g.zh} delay={i * 0.06}>
                <div className="h-full rounded-2xl bg-black/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
                  <p className="text-base font-semibold leading-snug text-black sm:text-lg">
                    {isZh ? g.zh : g.en}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-black/60">
                    {isZh ? g.descZh : g.descEn}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 设计策略：一句话宣言 */}
        <Reveal>
          <blockquote className="mt-14 rounded-2xl border border-black/10 bg-gradient-to-r from-[#FF6FA5]/[0.06] to-[#FF9448]/[0.06] px-6 py-8 text-center sm:px-10">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-black/40">
              Design Strategy · 设计策略
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-black/80 sm:text-xl">
              {isZh ? (
                <>
                  “以<Em>轻压力输入</Em>为起点，以<Em>温柔洞察</Em>为方式，以
                  <Em>沉浸疗愈</Em>为路径，以<Em>长期陪伴</Em>为目标，
                  打造一个让情绪自然流动的 Healing App。”
                </>
              ) : (
                <>
                  “Start with <Em>pressure-free input</Em>, guide with{" "}
                  <Em>gentle insight</Em>, heal through{" "}
                  <Em>immersive care</Em>, and grow with{" "}
                  <Em>lasting companionship</Em> — a healing app where emotions flow naturally.”
                </>
              )}
            </p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
