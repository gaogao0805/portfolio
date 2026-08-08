"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import type { Variants } from "motion/react";
import type { Locale } from "@/i18n/config";
import type { Project, ProjectGameItem } from "@/content/projects";

type Metric = NonNullable<Project["metrics"]>[number];
type SocialProof = NonNullable<Project["socialProof"]>;
type Video = NonNullable<Project["video"]>;

const EASE = [0.22, 1, 0.36, 1] as const;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const staggerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

function parseCountValue(value: string) {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return {
    target: Number(match[1]),
    suffix: match[2] ?? "",
    decimals: match[1].includes(".") ? 1 : 0,
  };
}

function AnimatedMetricValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const parsed = useMemo(() => parseCountValue(value), [value]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView || !parsed) return;

    let frame = 0;
    let start: number | undefined;
    const duration = 850;

    const tick = (time: number) => {
      start ??= time;
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(parsed.target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, parsed]);

  if (!parsed) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {current.toFixed(parsed.decimals)}
      {parsed.suffix}
    </span>
  );
}

function MetricGrid({
  locale,
  metrics,
}: {
  locale: Locale;
  metrics: Metric[];
}) {
  return (
    <motion.div
      variants={staggerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mt-8 grid gap-3 sm:grid-cols-3"
    >
      {metrics.map((metric) => (
        <motion.div
          key={`${metric.value[locale]}-${metric.label[locale]}`}
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.015 }}
          transition={{ duration: 0.2 }}
          className="border border-line bg-bg px-4 py-5"
        >
          <p className="display text-3xl text-accent sm:text-4xl">
            <AnimatedMetricValue value={metric.value[locale]} />
          </p>
          <p className="mt-2 font-sans text-xs uppercase tracking-wider text-fg">
            {metric.label[locale]}
          </p>
          {metric.description ? (
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {metric.description[locale]}
            </p>
          ) : null}
        </motion.div>
      ))}
    </motion.div>
  );
}

function GameVideoPlayer({
  locale,
  video,
}: {
  locale: Locale;
  video: Video;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotate: 1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      whileHover={{
        y: -8,
        boxShadow: "0 26px 70px rgba(25,255,231,0.18)",
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.65, ease: EASE }}
      className="group relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[28px] border border-line bg-black p-2 shadow-2xl"
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      >
        <div className="absolute inset-0 rounded-[28px] ring-1 ring-accent/50" />
        <div className="absolute inset-x-3 top-3 h-px bg-accent/60" />
      </div>
      <video
        controls
        playsInline
        preload="metadata"
        poster={video.poster}
        aria-label={video.title[locale]}
        className="aspect-[603/1108] max-h-[78vh] w-full rounded-[20px] bg-black object-contain"
      >
        <source src={video.src} type="video/mp4" />
        {locale === "zh"
          ? "你的浏览器不支持视频播放。"
          : "Your browser does not support video playback."}
      </video>
    </motion.div>
  );
}

function SocialProofGallery({
  locale,
  socialProof,
}: {
  locale: Locale;
  socialProof: SocialProof;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerVariants}
      className="mt-10"
    >
      <motion.span
        variants={itemVariants}
        className="block font-sans text-xs uppercase tracking-wider text-muted"
      >
        {socialProof.eyebrow[locale]}
      </motion.span>
      <motion.h3 variants={itemVariants} className="display mt-2 text-xl sm:text-3xl">
        {socialProof.heading[locale]}
      </motion.h3>
      <motion.p
        variants={itemVariants}
        className="mt-3 text-sm leading-relaxed text-muted sm:text-base"
      >
        {socialProof.body[locale]}
      </motion.p>

      <div className="mt-6 columns-1 gap-4 sm:columns-2">
        {socialProof.images.map((image, index) => (
          <motion.div
            key={image.src}
            variants={{
              hidden: { opacity: 0, y: 38, rotate: index % 2 === 0 ? -1.5 : 1.5 },
              show: {
                opacity: 1,
                y: 0,
                rotate: 0,
                transition: { duration: 0.62, ease: EASE },
              },
            }}
            whileHover={{ y: -8, rotate: index % 2 === 0 ? -0.8 : 0.8 }}
            className="mb-4 break-inside-avoid overflow-hidden border border-line bg-bg"
          >
            <Image
              src={image.src}
              alt={image.alt[locale]}
              width={image.width}
              height={image.height}
              sizes="(max-width: 639px) 100vw, 360px"
              className="h-auto w-full"
              unoptimized
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function GameCollectionShowcase({
  locale,
  items,
}: {
  locale: Locale;
  items: ProjectGameItem[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

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
  }, [items.length]);

  const jumpTo = (index: number) => {
    itemRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const activeItemIsLight = items[activeIndex]?.theme === "light";

  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="max-w-2xl"
        >
          <span className="font-sans text-xs uppercase tracking-wider text-muted">
            {locale === "zh" ? "游戏案例" : "Game cases"}
          </span>
          <h2 className="display mt-2 text-2xl sm:text-4xl">
            {locale === "zh" ? "已上线与进行中的游戏" : "Shipped and in-progress games"}
          </h2>
        </motion.div>

        <nav
          className="mt-8 flex gap-2 overflow-x-auto pb-2 lg:hidden"
          aria-label={locale === "zh" ? "游戏案例导航" : "Game case navigation"}
        >
          {items.map((item, index) => (
            <button
              key={item.title[locale]}
              type="button"
              onClick={() => jumpTo(index)}
              className={`shrink-0 border px-3 py-2 text-left text-xs transition-colors ${
                activeIndex === index
                  ? "border-accent bg-accent text-black"
                  : "border-line text-muted"
              }`}
            >
              {String(index + 1).padStart(2, "0")} {item.title[locale]}
            </button>
          ))}
        </nav>

      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 z-20 hidden pt-[60px] lg:block">
          <div className="sticky top-[156px] mx-auto max-w-6xl px-4 sm:px-8">
            <nav
              className={`pointer-events-auto w-[200px] border-l pl-5 transition-colors duration-300 ${
                activeItemIsLight ? "border-black/15" : "border-white/15"
              }`}
              aria-label={locale === "zh" ? "游戏案例导航" : "Game case navigation"}
            >
              <div className="space-y-5">
                {items.map((navItem, navIndex) => {
                  const isActive = activeIndex === navIndex;
                  return (
                    <button
                      key={navItem.title[locale]}
                      type="button"
                      onClick={() => jumpTo(navIndex)}
                      className="group relative flex w-full items-center gap-3 text-left"
                    >
                      <span
                        className="absolute -left-[25px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all"
                        style={{
                          background: isActive
                            ? "var(--color-accent)"
                            : activeItemIsLight
                              ? "rgba(0,0,0,0.14)"
                              : "rgba(255,255,255,0.22)",
                          boxShadow: isActive
                            ? "0 0 0 4px color-mix(in srgb, var(--color-accent) 20%, transparent)"
                            : "none",
                        }}
                      />
                      <span
                        className={`font-sans text-xs transition-colors ${
                          isActive
                            ? "text-accent"
                            : activeItemIsLight
                              ? "text-black/45"
                              : "text-white/45"
                        }`}
                      >
                        {String(navIndex + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-sm transition-colors ${
                          isActive
                            ? activeItemIsLight
                              ? "text-[#171717]"
                              : "text-white"
                            : activeItemIsLight
                              ? "text-black/45 group-hover:text-[#171717]"
                              : "text-white/45 group-hover:text-white"
                        }`}
                      >
                        {navItem.title[locale]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {items.map((item, index) => {
          const isLight = item.theme === "light";
          return (
            <motion.article
              key={item.title[locale]}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              data-game-index={index}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-90px" }}
              variants={staggerVariants}
              data-nav-theme={isLight ? "light" : "dark"}
              className={`group/case min-h-[calc(100vh-73px)] scroll-mt-[73px] ${
                isLight ? "theme-light bg-white text-[#171717]" : "theme-dark bg-[#101017]"
              }`}
            >
              <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[200px_1fr]">
                <div className="hidden lg:block" aria-hidden />

                <div>
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-start">
                    <motion.div variants={staggerVariants}>
                      <motion.span
                        variants={itemVariants}
                        className="font-sans text-xs uppercase tracking-wider text-accent"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </motion.span>
                      <motion.h3
                        variants={itemVariants}
                        className="display mt-3 text-3xl sm:text-5xl"
                      >
                        {item.title[locale]}
                      </motion.h3>
                      {item.subtitle ? (
                        <motion.p
                          variants={itemVariants}
                          className={`mt-3 text-base sm:text-lg ${
                            isLight ? "text-[#2f2f2f]" : "text-fg"
                          }`}
                        >
                          {item.subtitle[locale]}
                        </motion.p>
                      ) : null}

                      <motion.div variants={staggerVariants} className="mt-5 space-y-4">
                        {item.description[locale].map((paragraph) => (
                          <motion.p
                            key={paragraph}
                            variants={itemVariants}
                            className={`text-base leading-relaxed ${
                              isLight ? "text-[#5c5c5c]" : "text-muted"
                            }`}
                          >
                            {paragraph}
                          </motion.p>
                        ))}
                      </motion.div>

                      <motion.dl
                        variants={itemVariants}
                        className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2"
                      >
                        <div>
                          <dt className="font-sans text-xs uppercase tracking-wider text-muted">
                            {locale === "zh" ? "我的职责" : "My role"}
                          </dt>
                          <dd className={`mt-2 text-sm ${isLight ? "text-[#171717]" : "text-fg"}`}>
                            {item.role[locale]}
                          </dd>
                        </div>
                        {item.duration ? (
                          <div>
                            <dt className="font-sans text-xs uppercase tracking-wider text-muted">
                              {locale === "zh" ? "周期" : "Duration"}
                            </dt>
                            <dd className={`mt-2 text-sm ${isLight ? "text-[#171717]" : "text-fg"}`}>
                              {item.duration[locale]}
                            </dd>
                          </div>
                        ) : null}
                      </motion.dl>

                      {item.link ? (
                        <motion.a
                          variants={itemVariants}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ y: -2 }}
                          className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black transition-transform"
                        >
                          {locale === "zh" ? "体验游戏" : "Play the game"} ↗
                        </motion.a>
                      ) : null}
                    </motion.div>

                    {item.video ? (
                      <GameVideoPlayer locale={locale} video={item.video} />
                    ) : null}
                  </div>

                  {item.metrics?.length ? (
                    <MetricGrid locale={locale} metrics={item.metrics} />
                  ) : null}

                  {item.socialProof ? (
                    <SocialProofGallery locale={locale} socialProof={item.socialProof} />
                  ) : null}
                </div>
              </div>
            </motion.article>
          );
        })}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.55, ease: EASE }}
          data-nav-theme="light"
          className="border-t border-line bg-white text-center"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
            <p className="font-sans text-xs uppercase tracking-wider text-muted">
              {locale === "zh" ? "更多游戏" : "More games"}
            </p>
            <p className="display mt-3 text-3xl text-[#171717] sm:text-4xl">
              {locale === "zh" ? "未完待续" : "To be continued"}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
