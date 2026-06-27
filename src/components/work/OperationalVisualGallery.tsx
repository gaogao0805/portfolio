"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

type Props = {
  locale: Locale;
  title: string;
  description: string;
  images: string[];
  compact?: boolean;
};

export function OperationalVisualGallery({
  locale,
  title,
  description,
  images,
  compact = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const mainY = useTransform(scrollYProgress, [0, 1], [0, -18]);

  const cases = [
    {
      title: locale === "zh" ? "就绪推广海报" : "Ready promotional poster",
      description:
        locale === "zh"
          ? "围绕「就绪」AI 求职招聘产品的推广海报设计，用轻盈的科技感、人物卡片和线下物料场景建立品牌识别。"
          : "Promotional poster design for Ready, an AI recruitment product, using a light tech tone, character cards, and offline display context to build brand recognition.",
      images: ["/images/event-visual-cover.png"],
      tone: "dark",
    },
    {
      title,
      description,
      images,
      tone: "white",
    },
  ];

  useEffect(() => {
    const updateActiveItem = () => {
      const marker = Math.max(120, Math.min(window.innerHeight - 120, window.innerHeight * 0.35));
      let nextIndex = 0;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        if (rect.top <= marker && rect.bottom > marker) {
          nextIndex = index;
        }
      });

      setActiveIndex(nextIndex);
    };

    let frame = 0;
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveItem);
    };

    updateActiveItem();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [cases.length]);

  const jumpTo = (index: number) => {
    itemRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const activeCaseIsDark = cases[activeIndex]?.tone === "dark";

  return (
    <section data-nav-theme="dark" className="bg-bg">
      {compact ? null : (
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              {locale === "zh" ? "视觉案例" : "Visual cases"}
            </span>
            <h2 className="display mt-2 text-2xl sm:text-4xl">
              {locale === "zh" ? "运营视觉与物料展示" : "Operational visuals and assets"}
            </h2>
          </motion.div>

          <nav
            className="mt-8 flex gap-2 overflow-x-auto pb-2 lg:hidden"
            aria-label={locale === "zh" ? "运营视觉案例导航" : "Operational visual navigation"}
          >
            {cases.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => jumpTo(index)}
                className={`shrink-0 border px-3 py-2 text-left text-xs transition-colors ${
                  activeIndex === index
                    ? "border-accent bg-accent text-black"
                    : "border-line text-muted"
                }`}
              >
                {String(index + 1).padStart(2, "0")} {item.title}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div ref={ref} className="relative">
        <div className="pointer-events-none absolute inset-0 z-20 hidden pt-[60px] lg:block">
          <div className="sticky top-[156px] mx-auto max-w-6xl px-4 sm:px-8">
            <nav
              className={`pointer-events-auto w-[200px] border-l pl-5 transition-colors duration-300 ${
                activeCaseIsDark ? "border-white/15" : "border-black/15"
              }`}
              aria-label={locale === "zh" ? "运营视觉案例导航" : "Operational visual navigation"}
            >
              <div className="space-y-5">
                {cases.map((item, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => jumpTo(index)}
                      className="group relative flex w-full items-center gap-3 text-left"
                    >
                      <span
                        className="absolute -left-[25px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all"
                        style={{
                          background: isActive
                            ? "var(--color-accent)"
                            : activeCaseIsDark
                              ? "rgba(255,255,255,0.22)"
                              : "rgba(0,0,0,0.14)",
                          boxShadow: isActive
                            ? "0 0 0 4px color-mix(in srgb, var(--color-accent) 20%, transparent)"
                            : "none",
                        }}
                      />
                      <span
                        className={`font-mono text-xs transition-colors ${
                          isActive
                            ? "text-accent"
                            : activeCaseIsDark
                              ? "text-white/45"
                              : "text-black/45"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-sm transition-colors ${
                          isActive
                            ? activeCaseIsDark
                              ? "text-white"
                              : "text-[#171717]"
                            : activeCaseIsDark
                              ? "text-white/45 group-hover:text-white"
                              : "text-black/45 group-hover:text-[#171717]"
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {cases.map((visualCase, caseIndex) => {
          const row1 = visualCase.images.slice(1, 4);
          const row2 = visualCase.images.slice(4, 7);
          const row3 = visualCase.images.slice(7, 9);
          const isDark = visualCase.tone === "dark";

          return (
            <motion.article
              key={visualCase.title}
              ref={(node) => {
                itemRefs.current[caseIndex] = node;
              }}
              data-nav-theme={isDark ? "dark" : "light"}
              className={`min-h-[calc(100vh-73px)] scroll-mt-[73px] ${
                isDark ? "bg-[#101017] text-fg" : "theme-light bg-white text-[#171717]"
              }`}
            >
              <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[200px_1fr]">
                <div className="hidden lg:block" aria-hidden />

                <div className="min-w-0">
                  {compact ? null : (
                    <div className="max-w-3xl">
                      <span className="font-mono text-xs uppercase tracking-wider text-accent">
                        {String(caseIndex + 1).padStart(2, "0")}
                      </span>
                      <h3 className="display mt-3 text-3xl sm:text-5xl">
                        {visualCase.title}
                      </h3>
                      <p
                        className={`mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${
                          isDark ? "text-muted" : "text-[#5c5c5c]"
                        }`}
                      >
                        {visualCase.description}
                      </p>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: compact ? 10 : 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ y: mainY }}
                    className={
                      compact
                        ? `overflow-hidden border bg-white ${isDark ? "border-line shadow-2xl" : "border-black/10 shadow-sm"}`
                        : `mt-8 overflow-hidden border bg-white ${isDark ? "border-line shadow-2xl" : "border-black/10 shadow-sm"}`
                    }
                  >
                    <Image
                      src={visualCase.images[0]}
                      alt={visualCase.title}
                      width={1536}
                      height={2048}
                      sizes="(max-width: 767px) 100vw, 896px"
                      className="h-auto w-full object-cover"
                      unoptimized
                    />
                  </motion.div>

                  {row1.length || row2.length || row3.length ? (
                    <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5">
                      {row1.length ? (
                        <div className="grid gap-4 lg:grid-cols-3">
                          {row1.map((src, index) => (
                            <ThumbCard
                              key={src}
                              src={src}
                              alt={visualCase.title}
                              delay={index * 0.08}
                            />
                          ))}
                        </div>
                      ) : null}

                      {row2.length ? (
                        <div className="grid gap-4 lg:grid-cols-3">
                          {row2.map((src, index) => (
                            <ThumbCard
                              key={src}
                              src={src}
                              alt={visualCase.title}
                              delay={(index + 3) * 0.08}
                            />
                          ))}
                        </div>
                      ) : null}

                      {row3.length ? (
                        <div className="grid gap-4 lg:grid-cols-2">
                          {row3.map((src, index) => (
                            <ThumbCard
                              key={src}
                              src={src}
                              alt={visualCase.title}
                              delay={(index + 6) * 0.08}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function ThumbCard({
  src,
  alt,
  delay,
}: {
  src: string;
  alt: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="overflow-hidden border border-black/10 bg-white shadow-sm"
    >
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1200}
        sizes="(max-width: 767px) 100vw, 33vw"
        className="h-auto w-full object-cover"
        unoptimized
      />
    </motion.div>
  );
}
