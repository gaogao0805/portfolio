"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import BlurText from "@/components/BlurText";
import { PressureLabel } from "@/components/PressureLabel";
import { useLanyard } from "@/components/lanyard/LanyardProvider";

export function Hero({
  locale,
  home,
}: {
  locale: Locale;
  home: Dictionary["home"];
}) {
  const byChar = locale === "zh";
  const { show, warm } = useLanyard();

  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-24 sm:pt-20">
      {/* 背景光斑（居中顶部，品牌色） */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[440px] w-[min(440px,100vw)] -translate-x-1/2 rounded-full opacity-20 blur-[130px]"
        style={{ background: "var(--color-accent)" }}
      />

      {/* 小标题（英文 + 挤压效果，居中） */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PressureLabel text="AI Product Designer / UI · UX" size={22} />
      </motion.div>

      {/* 主标题：先自我介绍，再一句话，逐字模糊淡入（居中、宽裕） */}
      <div
        aria-hidden
        className="relative z-10 my-8 flex flex-col items-center gap-3 sm:my-10 sm:gap-4"
      >
        <BlurText
          text={home.heroGreeting}
          animateBy={byChar ? "chars" : "words"}
          delay={byChar ? 90 : 150}
          className={`justify-center font-display text-3xl font-bold ${
            byChar ? "tracking-normal" : "tracking-tight"
          } sm:text-5xl`}
        />
        <BlurText
          text={home.heroTagline}
          animateBy={byChar ? "chars" : "words"}
          delay={byChar ? 70 : 150}
          className={`max-w-3xl justify-center font-display text-4xl font-bold leading-tight ${
            byChar ? "tracking-normal" : "tracking-tight"
          } sm:text-6xl`}
        />
      </div>

      {/* 真正的标题留给 SEO / 无障碍 */}
      <h1 className="sr-only">
        {home.heroGreeting}，{home.heroTagline}
      </h1>

      <motion.p
        className="relative z-10 max-w-xl text-lg text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {home.intro}
      </motion.p>

      <motion.div
        className="relative z-10 mt-9 flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Link
          href={`/${locale}#work`}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
        >
          {home.ctaWork}
        </Link>
        <button
          type="button"
          onClick={show}
          onPointerEnter={warm}
          onFocus={warm}
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
        >
          {home.ctaContact}
        </button>
      </motion.div>
    </section>
  );
}
