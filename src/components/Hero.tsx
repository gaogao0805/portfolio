"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import BlurText from "@/components/BlurText";
import { useLanyard } from "@/components/lanyard/LanyardProvider";

/** 选框光标 + 名字标签（Figma 设计稿素材 2008:184，青标 + Smiley 名牌） */
function CursorTag() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      aria-hidden
      src="/stickers/cursor-tag.svg"
      alt=""
      draggable={false}
      className="absolute -bottom-[64px] -right-4 w-16 select-none sm:-bottom-[86px] sm:-right-8 sm:w-[104px]"
    />
  );
}

export function Hero({
  locale,
  home,
  introAlt,
}: {
  locale: Locale;
  home: Dictionary["home"];
  // 另一语言的 intro 译文（中英对照副行，仅桌面端显示）
  introAlt?: string;
}) {
  const byChar = locale === "zh";
  const { show, warm } = useLanyard();
  // 双 slogan 随机轮换：SSR 与首帧渲染 A（避免水合不一致），
  // 挂载后掷硬币换 B——此刻逐字动画还在模糊透明段，换句无感
  const [alt, setAlt] = useState(0);
  useEffect(() => {
    if (Math.random() < 0.5) setAlt(1);
  }, []);
  const tagline = alt ? home.heroTagline2 : home.heroTagline;
  const taglineEm = alt ? home.heroTaglineEm2 : home.heroTaglineEm;

  // 强调词选框：测量 slogan 里 hero-em 字符的包围盒（A/B 文案、换行、字号都自适应）
  const titleRef = useRef<HTMLDivElement>(null);
  const [emBox, setEmBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  useEffect(() => {
    const measure = () => {
      const root = titleRef.current;
      if (!root) return;
      const spans = root.querySelectorAll(".hero-em");
      if (!spans.length) return;
      const rr = root.getBoundingClientRect();
      let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
      spans.forEach((s) => {
        const q = s.getBoundingClientRect();
        l = Math.min(l, q.left);
        t = Math.min(t, q.top);
        r = Math.max(r, q.right);
        b = Math.max(b, q.bottom);
      });
      setEmBox({ x: l - rr.left, y: t - rr.top, w: r - l, h: b - t });
    };
    // 两次测量：字体就绪后量一次（swap 前字宽不准），
    // 逐字入场落定后（1.1s，选框淡入前）再校正一次——
    // 否则按动画中途的字符位置量出的框会带位移误差
    let raf = 0;
    document.fonts?.ready.then(() => {
      raf = requestAnimationFrame(measure);
    });
    const settle = setTimeout(measure, 1100);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      window.removeEventListener("resize", measure);
    };
  }, [alt]);

  return (
    <section className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
      {/* kicker 胶囊：白底 + 1px 灰边（设计稿 Frame 427319477） */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-full border border-[#BBC3C9] bg-white px-5 py-1.5 text-sm text-fg sm:text-base">
          AI product designer
        </div>
      </motion.div>

      {/* 主标题：单行 slogan，逐字模糊淡入；强调词不变色，
          套品牌青选框（四角手柄）+ 光标名牌（Figma 选中态，设计稿同款） */}
      <div className="relative z-10 my-9 sm:my-12">
        <div aria-hidden ref={titleRef} className="relative inline-block">
          <BlurText
            text={tagline}
            animateBy={byChar ? "chars" : "words"}
            delay={byChar ? 70 : 150}
            emText={taglineEm}
            mobileBreakAfter={byChar ? 4 : -1}
            emClassName={
              byChar
                ? "hero-em text-transparent"
                : "hero-em max-lg:text-current lg:text-transparent"
            }
            className={`justify-center ${byChar ? "font-smiley" : "font-display font-bold"} leading-[1.2] ${
              byChar
                ? "tracking-normal text-[2.6rem] sm:text-5xl lg:text-7xl xl:text-[5.9rem]"
                : "tracking-tight text-3xl sm:text-5xl"
            }`}
          />
          {/* 手势贴纸：标题左下角（设计稿 Hand Stickers 素材） */}
          <motion.img
            aria-hidden
            src="/stickers/hand.svg"
            alt=""
            draggable={false}
            className="absolute -left-24 top-[58%] z-10 hidden w-28 -translate-y-1/2 -rotate-6 lg:block"
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ delay: 1.35, type: "spring", stiffness: 280, damping: 15 }}
          />
          {/* 强调词拖放组：词真身 + 选框 + 光标名牌是一个整体，
              循环动画——光标拖词归位 → 停驻 → 拖走 → 重来。
              正文里的同名字符是透明占位（保住排版槽位） */}
          {emBox ? (
            <motion.div
              aria-hidden
              className={`pointer-events-none absolute z-20 ${byChar ? "" : "hidden lg:block"}`}
              style={{
                left: emBox.x - 10,
                top: emBox.y - 7,
                width: emBox.w + 20,
                height: emBox.h + 14,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 1.15 }}
            >
              {/* 拖拽循环层：纯平移、不消失；词在框内 flex 居中 */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ x: 36, y: 26 }}
                animate={{
                  x: [36, 0, 0, 36, 36],
                  y: [26, 0, 0, 26, 26],
                }}
                transition={{
                  duration: 6,
                  times: [0, 0.2, 0.55, 0.75, 1],
                  repeat: Infinity,
                  delay: 1.3,
                  ease: "easeInOut",
                }}
              >
              {/* 词真身：字号/字体与正文逐字动画一致，落位时与透明占位重合 */}
              <span
                className={`whitespace-nowrap leading-[1.2] ${
                  byChar
                    ? "font-smiley tracking-normal text-[2.6rem] sm:text-5xl lg:text-7xl xl:text-[5.9rem]"
                    : "font-display font-bold tracking-tight text-3xl sm:text-5xl"
                }`}
              >
                {taglineEm}
              </span>
              <span className="absolute inset-0 rounded-[3px] border-2 border-accent bg-accent/[0.07]" />
              {[
                "-left-[5px] -top-[5px]",
                "-right-[5px] -top-[5px]",
                "-left-[5px] -bottom-[5px]",
                "-right-[5px] -bottom-[5px]",
              ].map((pos) => (
                <span
                  key={pos}
                  className={`absolute ${pos} h-2.5 w-2.5 rounded-[2px] border-2 border-accent bg-white`}
                />
              ))}
              <CursorTag />
              </motion.div>
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* 真正的标题留给 SEO / 无障碍 */}
      <h1 className="sr-only">
        {home.heroGreeting}，{tagline}
      </h1>

      <motion.p
        className="relative z-10 max-w-xl text-base text-black/75 sm:text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {/* 移动端用精简文案，桌面端完整版（display:none 不会进无障碍树） */}
        <span className="hidden sm:inline">{home.intro}</span>
        <span className="sm:hidden">{home.introShort}</span>
      </motion.p>
      {introAlt ? (
        <motion.p
          lang={locale === "zh" ? "en" : "zh-CN"}
          className="relative z-10 mt-2.5 hidden max-w-xl text-lg leading-relaxed text-black/40 sm:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          {introAlt}
        </motion.p>
      ) : null}

      {/* 按钮组：实心青 + 白底灰边（设计稿 Frame 427319478/479/480） */}
      <motion.div
        className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Link
          href={`/${locale}#work`}
          onClick={(e) => {
            // 直达作品区「已进场」的位置：舞台吸顶、标题收好、第一张卡对焦，
            // 而不是板块顶部（那里标题还在大字过渡态，看着像没跳转）
            e.preventDefault();
            const el = document.getElementById("work");
            if (!el) return;
            window.scrollTo({
              top: el.getBoundingClientRect().top + window.scrollY,
              behavior: "smooth",
            });
          }}
          className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          {home.ctaWork}
        </Link>
        <button
          type="button"
          onClick={show}
          onPointerEnter={warm}
          onFocus={warm}
          className="hidden rounded-full border border-[#BBC3C9] bg-white px-7 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent sm:block"
        >
          {home.ctaContact}
        </button>
        {/* 看简历：跳到关于页的简历时间线锚点 */}
        <Link
          href={`/${locale}/about#resume`}
          className="rounded-full border border-[#BBC3C9] bg-white px-7 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
        >
          {home.ctaResume}
        </Link>
      </motion.div>
    </section>
  );
}
