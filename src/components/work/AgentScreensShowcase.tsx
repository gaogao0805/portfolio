"use client";

import type { Locale } from "@/i18n/config";

/**
 * 收尾「界面一览」：App 真实界面斜置双排滚动（对角线布局），
 * 灰底与上方白底区分。图片为真机截图，统一尺寸与间距。
 */

const SCREENS = [
  { src: "/images/app-screens/s01-chat.png", alt: "AI 对话" },
  { src: "/images/app-screens/s02-letter.png", alt: "经纪人的第一封信" },
  { src: "/images/app-screens/s03-profile.png", alt: "我的" },
  { src: "/images/app-screens/s04-report.png", alt: "人才画像 · 运营岗怎么招" },
  { src: "/images/app-screens/s05-voice.png", alt: "AI 语音面试" },
  { src: "/images/app-screens/s06-talk.png", alt: "AI 语音通话" },
  { src: "/images/app-screens/s07-mbti.png", alt: "MBTI 职场性格测试" },
  { src: "/images/app-screens/s08-resume.png", alt: "简历编辑" },
  { src: "/images/app-screens/s09-agent.png", alt: "经纪人详情" },
  { src: "/images/app-screens/s10-library.png", alt: "我的资料库" },
  { src: "/images/app-screens/s11-public.png", alt: "对外展示简历" },
  { src: "/images/app-screens/s12-progress.jpg", alt: "投递进度" },
];

const MARQUEE_STYLE = `
@keyframes appScreensLeft {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes appScreensRight {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}
.app-screens-marquee:hover .app-screens-track {
  animation-play-state: paused;
}
`;

/** 单张界面图：无黑框，统一尺寸（同比例截图，固定高度即统一宽度） */
function ScreenCard({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-[360px] w-auto shrink-0 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.12)]"
    />
  );
}

/** 单排滚动轨道 */
function MarqueeRow({
  items,
  duration,
  reverse,
  alt,
}: {
  items: typeof SCREENS;
  duration: number;
  reverse?: boolean;
  alt: (screen: (typeof SCREENS)[number]) => string;
}) {
  return (
    <div
      className="app-screens-track flex w-max items-start gap-6"
      style={{ animation: `${reverse ? "appScreensRight" : "appScreensLeft"} ${duration}s linear infinite` }}
    >
      {[0, 1].map((half) => (
        <div key={half} className="flex items-start gap-6 pr-6" aria-hidden={half === 1}>
          {items.map((screen) => (
            <ScreenCard key={`${half}-${screen.src}`} src={screen.src} alt={alt(screen)} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function AgentScreensShowcase({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  const alt = (s: (typeof SCREENS)[number]) => (isZh ? s.alt : "App screen");

  return (
    <section data-nav-theme="light" className="theme-light bg-bg-gray">
      <div>
        {/* 对角线双排：整体斜置，两排反向滚动、留足排间距（悬停暂停） */}
        <div className="app-screens-marquee -mx-24 overflow-hidden py-6">
          <style>{MARQUEE_STYLE}</style>
          <div style={{ transform: "rotate(-7deg)", width: "112%", marginLeft: "-6%" }}>
            <MarqueeRow items={SCREENS} duration={48} alt={alt} />
            <div className="ml-[-140px] mt-6">
              <MarqueeRow items={SCREENS} duration={62} reverse alt={alt} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
