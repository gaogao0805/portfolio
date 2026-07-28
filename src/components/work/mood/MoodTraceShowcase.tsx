import type { Locale } from "@/i18n/config";
import { AgentJourney } from "@/components/work/AgentJourney";
import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";
import { MoodCompetitors } from "@/components/work/mood/MoodCompetitors";

/**
 * 「心绪轨迹 Mood Trace」详情页展示框架。
 * 结构与「就绪」一致：旅程线串起五个核心模块，每个模块先以占位卡槽标记，
 * 素材到位后把 MoodSlot 替换成对应的交互复刻 / 截图组件即可。
 */

/** 项目主题色：粉橙渐变（旅程线、强调数字共用） */
const MOOD_TONE = { from: "#FF6FA5", to: "#FF9448" } as const;

type SectionDef = {
  eyebrow: string;
  title: { zh: string; en: string };
  lead: { zh: string; en: string };
  /** 占位卡槽说明：这里将来放什么 */
  slot: { zh: string; en: string };
};

const SECTIONS: SectionDef[] = [
  {
    eyebrow: "MOOD TRACE · 01",
    title: { zh: "每天 10 秒，记下此刻情绪", en: "A 10-second daily check-in" },
    lead: {
      zh: "首页就是一个轻量情绪打卡：选当下的感受、一句话带过原因，没有负担地开始记录。",
      en: "The home screen is a lightweight mood check-in: pick how you feel, add a one-line note — effortless to start.",
    },
    slot: {
      zh: "首页打卡交互复刻（待素材：首页设计稿 / 录屏）",
      en: "Home check-in recreation (pending: home design / recording)",
    },
  },
  {
    eyebrow: "MOOD TRACE · 02",
    title: { zh: "AI 伙伴：先倾听，再回应", en: "An AI companion that listens first" },
    lead: {
      zh: "记完情绪可以接着聊。AI 伙伴不评判、不说教，先接住情绪，再给一点点可执行的建议。",
      en: "After logging, you can keep talking. The AI companion doesn't judge or lecture — it holds the feeling first, then offers one small actionable step.",
    },
    slot: {
      zh: "AI 对话交互复刻（待素材：对话流程 / 人设文案）",
      en: "AI chat recreation (pending: conversation flow / persona copy)",
    },
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
  },
  {
    eyebrow: "MOOD TRACE · 04",
    title: { zh: "安心感也是设计出来的", en: "Safety by design" },
    lead: {
      zh: "情绪数据只存在本机、可随时导出删除；涉及危机信号时，产品用克制的方式给出求助入口。",
      en: "Mood data stays on-device, exportable and deletable anytime; when crisis signals appear, the product surfaces help with restraint.",
    },
    slot: {
      zh: "隐私与安心机制展示（待素材：隐私页 / 机制说明）",
      en: "Privacy & safety showcase (pending: privacy screen / mechanism notes)",
    },
  },
  {
    eyebrow: "MOOD TRACE · 05",
    title: { zh: "设计系统与页面全景", en: "Design system & all screens" },
    lead: {
      zh: "从色板、字阶、组件到全部页面：一套安静、低饱和的视觉语言，配合产品的情绪基调。",
      en: "From palette, type scale and components to every screen: a quiet, low-saturation visual language matching the product's tone.",
    },
    slot: {
      zh: "设计系统 + 全页面截图陈列（待素材：设计系统 / 页面导出图）",
      en: "Design system + all-screens showcase (pending: design system / screen exports)",
    },
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

function MoodSection({
  def,
  locale,
}: {
  def: SectionDef;
  locale: Locale;
}) {
  return (
    <section data-nav-theme="light" className="theme-light bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-20">
        <Reveal>
          <div className="max-w-3xl">
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
          <MoodSlot label={def.slot[locale]} />
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
      <AgentJourney tone={MOOD_TONE}>
        {SECTIONS.map((def) => (
          <MoodSection key={def.eyebrow} def={def} locale={locale} />
        ))}
      </AgentJourney>
    </>
  );
}
