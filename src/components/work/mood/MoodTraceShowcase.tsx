import type { Locale } from "@/i18n/config";
import { AgentJourney } from "@/components/work/AgentJourney";
import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";
import { MoodCompetitors } from "@/components/work/mood/MoodCompetitors";
import { MoodUserAnalysis } from "@/components/work/mood/MoodUserAnalysis";
import { MoodDirection } from "@/components/work/mood/MoodDirection";
import { MoodBoard } from "@/components/work/mood/MoodBoard";

/**
 * 「心绪轨迹 Mood Trace」详情页展示框架。
 * 结构与「就绪」一致：旅程线串起五个核心模块，每个模块先以占位卡槽标记，
 * 素材到位后把 MoodSlot 替换成对应的交互复刻 / 截图组件即可。
 */

/** 项目主题色：粉橙渐变（旅程线、强调数字共用） */
const MOOD_TONE = { from: "#FF6FA5", to: "#FF9448" } as const;

/** 引线标注：细线 + 小菱形，从界面元素引到两侧说明文字（移动端空间不足，隐藏） */
const MOOD_NOTES: {
  side: "left" | "right";
  /** 引线的纵向位置（占手机框高度的百分比，线随文字块垂直居中） */
  top: string;
  /** 引线伸进屏幕内的长度（px），指向各自目标元素 */
  reach: number;
  zh: string;
  en: string;
}[] = [
  {
    side: "right",
    top: "10%",
    reach: 70,
    zh: "可以通过自行记录来补充情绪细节",
    en: "Manual logging to enrich mood details",
  },
  {
    side: "right",
    top: "29%",
    reach: 110,
    zh: "可视化的情绪IP",
    en: "A visual mood mascot",
  },
  {
    side: "left",
    top: "45%",
    reach: 60,
    zh: "可以看到可视化的情绪数据；卡片附加活动推荐模块，直达疗愈推荐内容",
    en: "Visual mood data at a glance — the card also carries activity recommendations straight into healing content",
  },
  {
    side: "left",
    top: "71%",
    reach: 60,
    zh: "在趋势模块可以看到情绪的变动，更好的管理自己的情绪，还可以直接查看更长跨度下（日/周/月）的时间变动，方便后续就医",
    en: "The trend module visualizes mood changes for better self-management, with day / week / month spans — handy context for doctor visits",
  },
];

/** 第二页（疗愈）引线标注 */
const HEAL_NOTES: typeof MOOD_NOTES = [
  {
    side: "left",
    top: "11.5%",
    reach: 60,
    zh: "用户也可以通过自行搜索，来寻找适合自己的活动项目",
    en: "Users can also search directly for activities that suit them",
  },
  {
    side: "left",
    top: "23%",
    reach: 60,
    zh: "针对当前状态，进行AI活动推荐，帮助用户快速选择适合的放松方式",
    en: "AI recommends activities for the current state, helping users quickly pick a way to unwind",
  },
  {
    side: "left",
    top: "55%",
    reach: 60,
    zh: "给予活动大类筛选，可以直接选择自己想要的疗愈方式",
    en: "Category filters let users jump straight to the healing format they want",
  },
];

/** 第三页（成长）引线标注 */
const TRACK_NOTES: typeof MOOD_NOTES = [
  {
    side: "right",
    top: "24%",
    reach: 60,
    zh: "奖励机制，鼓励用户通过参与疗愈活动来获得阶段性奖励",
    en: "A reward mechanism that grants milestone rewards for taking part in healing activities",
  },
  {
    side: "right",
    top: "58%",
    reach: 60,
    zh: "日程安排，对于双向情感患者，管理日常生活和按时吃药非常重要，因此可以辅助用户管理自己，更好的生活",
    en: "Scheduling: for people with bipolar disorder, managing daily life and taking medication on time is vital — this helps them manage themselves and live better",
  },
  {
    side: "right",
    top: "80%",
    reach: 60,
    zh: "月度报告通过心情颜色的可视化，快速看到自己的情绪变动，同时给予指导建议",
    en: "The monthly report visualizes moods as colors, so emotional shifts are clear at a glance, with guidance alongside",
  },
];

type SectionDef = {
  eyebrow: string;
  title: { zh: string; en: string };
  lead: { zh: string; en: string };
  /** 占位卡槽说明：这里将来放什么 */
  slot: { zh: string; en: string };
  /** 实机截图（到位后替换占位卡槽） */
  image?: string;
  /** 截图两侧的引线标注（可选） */
  notes?: typeof MOOD_NOTES;
  /** 是否显示四周的情绪小表情（默认显示） */
  faces?: boolean;
  /** 左右分栏布局：左文案右截图（默认上下堆叠） */
  split?: boolean;
  /** 分栏反向：左截图右文案（需配合 split 使用） */
  reverse?: boolean;
};

const SECTIONS: SectionDef[] = [
  {
    eyebrow: "MOOD TRACE · 01",
    title: { zh: "配合手环，自动读懂情绪变化", en: "Auto mood tracking with the wristband" },
    lead: {
      zh: "连接智能手环后，HRV、静息心率等生理信号实时回传，App 自动评估你的综合情绪状态，并在需要时提醒放松——全程无需手动记录。",
      en: "Once paired with the smart wristband, signals like HRV and resting heart rate stream in continuously. The app gauges your overall emotional state and nudges you to unwind when needed — no manual logging at all.",
    },
    slot: {
      zh: "首页自动监测交互复刻（待素材：更多设计稿 / 录屏）",
      en: "Home auto-monitoring recreation (pending: more designs / recording)",
    },
    image: "/images/mood/home.svg",
    notes: MOOD_NOTES,
  },
  {
    eyebrow: "MOOD TRACE · 02",
    title: { zh: "想放松时，马上找到合适的方式", en: "Find the right way to unwind, right away" },
    lead: {
      zh: "针对当前的情绪状态，AI 自动推荐合适的疗愈活动；也可以自行搜索，或按白噪音、冥想等大类直接挑选。",
      en: "For your current state, the AI recommends fitting healing activities — or search directly, or browse categories like white noise and meditation.",
    },
    slot: {
      zh: "疗愈页交互复刻（待素材：疗愈页设计稿 / 录屏）",
      en: "Healing page recreation (pending: designs / recording)",
    },
    image: "/images/mood/chat.png",
    notes: HEAL_NOTES,
    faces: false,
    split: true,
  },
  {
    eyebrow: "MOOD TRACE · 03",
    title: { zh: "情绪轨迹：看见自己的周期", en: "Your emotional trajectory" },
    lead: {
      zh: "日、周、月三档视图把情绪连成线：什么时候容易低落、什么事情在消耗你，一眼就明白。",
      en: "Daily, weekly, and monthly views connect the dots: when you tend to dip, what's draining you — clear at a glance.",
    },
    slot: {
      zh: "轨迹图表 / 周报展示（待素材：图表设计稿）",
      en: "Trajectory charts / weekly report (pending: chart designs)",
    },
    image: "/images/mood/growth.png",
    notes: TRACK_NOTES,
    faces: false,
    split: true,
    reverse: true,
  },
];

/** 占位卡槽：素材到位前的虚线手机框，替换时整个删掉即可 */
function MoodSlot({ label }: { label: string }) {
  return (
    <div className="mx-auto mt-10 flex aspect-[9/16] w-full max-w-[300px] flex-col items-center justify-center gap-3 rounded-[32px] border-2 border-dashed border-black/15 bg-black/[0.03] p-6 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-black/30">
        TODO
      </span>
      <p className="text-sm leading-relaxed text-black/45">{label}</p>
    </div>
  );
}

/** 实机截图：白色圆角框 + 微弱暖色发光，四周躲着几个情绪小表情；
    notes 为可选的引线标注（各页面内容不同，按页传入） */
function MoodShot({
  src,
  alt,
  locale,
  notes = [],
  faces = true,
}: {
  src: string;
  alt: string;
  locale: Locale;
  notes?: typeof MOOD_NOTES;
  faces?: boolean;
}) {
  return (
    <div className="relative mx-auto mt-10 w-full max-w-[340px]">
      {faces ? (
        <>
          {/* 情绪小表情：躲在手机框后面，仅装饰；各自错开节奏的呼吸缩放 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mood/Caritas-1.svg" alt="" aria-hidden className="mood-breathe absolute -left-24 -top-14 w-36" style={{ animationDuration: "3.6s" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mood/Caritas-2.svg" alt="" aria-hidden className="mood-breathe absolute -right-16 top-[30%] w-28" style={{ animationDuration: "4.4s", animationDelay: "-1.2s" }} />
          {/* 紫色层级在手机框之上（位置上移，给下方趋势标注让位） */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mood/Caritas-3.svg" alt="" aria-hidden className="mood-breathe absolute -left-24 top-[50%] z-20 w-40" style={{ animationDuration: "5s", animationDelay: "-2.3s" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mood/Caritas.svg" alt="" aria-hidden className="mood-breathe absolute -right-28 top-[48%] w-48" style={{ animationDuration: "4.1s", animationDelay: "-0.7s" }} />
        </>
      ) : null}

      {/* 引线标注（桌面端）：文字、菱形、细线同一行水平引出 */}
      {notes.map((n) =>
        n.side === "left" ? (
          <div
            key={n.top + n.side}
            className="absolute right-full z-20 hidden -translate-y-1/2 items-center md:flex"
            style={{ top: n.top }}
          >
            <p className="w-52 shrink-0 text-right text-sm leading-snug text-black/60">
              {n[locale]}
            </p>
            <span className="mx-1.5 h-1 w-1 shrink-0 rotate-45 bg-[#C99B6A]" aria-hidden />
            <span
              className="h-px shrink-0 bg-[#C99B6A]/50"
              style={{ width: 24 + n.reach, marginRight: -n.reach }}
              aria-hidden
            />
          </div>
        ) : (
          <div
            key={n.top + n.side}
            className="absolute left-full z-20 hidden -translate-y-1/2 items-center md:flex"
            style={{ top: n.top }}
          >
            <span
              className="h-px shrink-0 bg-[#C99B6A]/50"
              style={{ width: 24 + n.reach, marginLeft: -n.reach }}
              aria-hidden
            />
            <span className="mx-1.5 h-1 w-1 shrink-0 rotate-45 bg-[#C99B6A]" aria-hidden />
            <p className="w-52 shrink-0 text-left text-sm leading-snug text-black/60">
              {n[locale]}
            </p>
          </div>
        )
      )}

      {/* 白色圆角框 + 发光投影；内图嵌套圆角与框同心 */}
      <div
        className="relative z-10 rounded-[36px] bg-white p-3"
        style={{ filter: "drop-shadow(0 12px 36px rgba(255, 148, 72, 0.28))" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block w-full rounded-[24px]" />
      </div>
    </div>
  );
}

/** 产品介绍：项目背景与目标（双相情感障碍 + App / 智能手环） */
function MoodIntro({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  return (
    <section data-nav-theme="light" className="theme-light bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-8 sm:pt-24">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-[1fr_220px] md:items-end">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-black/40">
                PRODUCT INTRO
              </p>
              <h2 className="display mt-3 text-3xl leading-[1.15] text-black sm:text-5xl">
                {isZh ? "什么是双相情感障碍？" : "What is bipolar disorder?"}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-black/60 sm:text-base">
                {isZh
                  ? "双相情感障碍是一种心理障碍，严重影响情绪稳定性，需要干预和支持。目前有超过 840 万人患有该症状——前一秒还很兴奋，下一秒就陷入了抑郁。"
                  : "Bipolar disorder is a mental health condition that seriously affects emotional stability and calls for intervention and support. Over 8.4 million people live with it — on a high one moment, sinking into depression the next."}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-black/60 sm:text-base">
                {isZh
                  ? "因此，该项目希望利用 App 和智能手环，辅助双相情感障碍患者管理自己的情绪。"
                  : "This project pairs a mobile app with a smart wristband to help people with bipolar disorder manage their emotions."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(isZh ? ["App", "智能手环"] : ["App", "Smart wristband"]).map(
                  (chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-black/15 px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-black/55"
                    >
                      {chip}
                    </span>
                  ),
                )}
              </div>
            </div>
            <div>
              <p
                className="display bg-gradient-to-r bg-clip-text text-5xl text-transparent sm:text-6xl"
                style={{
                  backgroundImage: `linear-gradient(to right, ${MOOD_TONE.from}, ${MOOD_TONE.to})`,
                }}
              >
                <CountUp
                  to={isZh ? 840 : 8.4}
                  decimals={isZh ? 0 : 1}
                  suffix={isZh ? "万+" : "M+"}
                />
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black/50">
                {isZh
                  ? "正在经历剧烈情绪波动的人群"
                  : "people living with extreme mood swings"}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** 品牌海报：地铁站广告牌 mockup（整图展示，页面结尾） */
function MoodPoster({ locale }: { locale: Locale }) {
  return (
    <section data-nav-theme="light" className="theme-light bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-20">
        <Reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mood/poster.jpg"
            alt={locale === "zh" ? "心绪轨迹地铁站广告海报" : "MoodTrace subway ad poster"}
            className="block w-full rounded-3xl"
          />
        </Reveal>
      </div>
    </section>
  );
}

function MoodSection({
  def,
  locale,
}: {
  def: SectionDef;
  locale: Locale;
}) {
  const text = (
    // 分栏时收窄文案栏，给截图左侧的引线标注留出走道，避免文字重叠；
    // 反向分栏时文案右对齐，引线标注落在截图右侧的空档
    <div
      className={
        def.split
          ? def.reverse
            ? "max-w-md md:justify-self-end"
            : "max-w-md"
          : "max-w-3xl"
      }
    >
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-black/40">
        {def.eyebrow}
      </p>
      <h2
        data-journey-anchor
        className="display mt-3 text-3xl leading-[1.15] text-black sm:text-5xl"
      >
        {def.title[locale]}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-black/60 sm:text-base">
        {def.lead[locale]}
      </p>
    </div>
  );
  const shot = def.image ? (
    <MoodShot
      src={def.image}
      alt={def.title[locale]}
      locale={locale}
      notes={def.notes}
      faces={def.faces}
    />
  ) : (
    <MoodSlot label={def.slot[locale]} />
  );
  return (
    <section data-nav-theme="light" className="theme-light bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-20">
        <Reveal>
          {def.split ? (
            // 左右分栏：左文案右截图，截图左侧的引线标注正好落在中间空档；
            // reverse 时左截图右文案（移动端仍先文案后截图）
            <div
              className={`grid items-center gap-10 ${
                def.reverse ? "md:grid-cols-[auto_1fr]" : "md:grid-cols-[1fr_auto]"
              }`}
            >
              {text}
              {def.reverse ? <div className="md:order-first">{shot}</div> : shot}
            </div>
          ) : (
            <>
              {text}
              {shot}
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function MoodTraceShowcase({ locale }: { locale: Locale }) {
  return (
    <>
      <MoodIntro locale={locale} />
      <MoodCompetitors locale={locale} />
      <MoodUserAnalysis locale={locale} />
      <MoodDirection locale={locale} />
      <MoodBoard locale={locale} />
      <AgentJourney tone={MOOD_TONE}>
        {SECTIONS.map((def) => (
          <MoodSection key={def.eyebrow} def={def} locale={locale} />
        ))}
      </AgentJourney>
      <MoodPoster locale={locale} />
    </>
  );
}
