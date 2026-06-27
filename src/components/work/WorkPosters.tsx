"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/content/projects";
import type { Locale } from "@/i18n/config";
import ShapeGrid from "@/components/ShapeGrid";
import { Reveal } from "@/components/Reveal";
import { PressureLabel } from "@/components/PressureLabel";

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

/**
 * 作品翻页：干净的 CSS 3D 翻转卡片。
 * 左侧竖向刻度导航（点标题直接定位），中间翻页卡片，右侧当前项目信息。
 * 滚动驱动翻页进度 p，松手吸附到整张卡。
 */
export function WorkPosters({
  locale,
  title,
  subtitle,
  cta,
  hint,
}: {
  locale: Locale;
  title: string;
  subtitle: string;
  cta: string;
  hint: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef({ absTop: 0, total: 1 });
  const [p, setP] = useState(0);
  const router = useRouter();
  const N = projects.length;
  const span = Math.max(N - 1, 1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const md = window.matchMedia("(min-width: 768px)");
    const applyHeight = () => {
      el.style.height = md.matches ? `${N * 80}vh` : "auto";
    };
    applyHeight();
    md.addEventListener("change", applyHeight);

    let snapTimer: ReturnType<typeof setTimeout> | undefined;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const absTop = rect.top + window.scrollY;
      const total = Math.max(el.offsetHeight - window.innerHeight, 1);
      metricsRef.current = { absTop, total };
      return { absTop, total };
    };
    const onScroll = () => {
      const m = measure();
      if (!m) return;
      const scrolled = clamp(window.scrollY - m.absTop, 0, m.total);
      const prog = (scrolled / m.total) * span;
      setP(prog);
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        const nearest = Math.round(prog);
        if (Math.abs(prog - nearest) > 0.02) {
          window.scrollTo({ top: m.absTop + (nearest / span) * m.total, behavior: "smooth" });
        }
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    applyHeight();
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      md.removeEventListener("change", applyHeight);
      if (snapTimer) clearTimeout(snapTimer);
    };
  }, [span, N]);

  const active = clamp(Math.round(p), 0, N - 1);
  const current = projects[active] ?? projects[0];
  const currentTitle = current.previewTitle?.[locale] ?? current.title[locale];
  const currentSummary = current.previewSummary?.[locale] ?? current.summary[locale];
  const open = (slug: string) => router.push(`/${locale}/work/${slug}`);
  const jumpTo = (i: number) => {
    const { absTop, total } = metricsRef.current;
    window.scrollTo({ top: absTop + (i / span) * total, behavior: "smooth" });
  };

  return (
    <div ref={sectionRef} className="relative">
      <div className="relative flex flex-col justify-center py-12 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:py-0">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <ShapeGrid
            direction="diagonal"
            speed={0.4}
            squareSize={42}
            shape="square"
            borderColor="#23232e"
            hoverFillColor="#22a596"
            hoverTrailAmount={0}
          />
        </div>

        <Reveal>
          <div className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-8 text-center sm:px-8">
            <PressureLabel text="Selected Work" size={20} />
            <h2 className="display mt-3 text-4xl sm:text-5xl">{title}</h2>
            <p className="mt-4 max-w-xl text-muted">{subtitle}</p>
          </div>
        </Reveal>

        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-5 sm:px-8 md:flex-row md:gap-12">
          {/* 左侧：刻度导航 */}
          <nav className="hidden shrink-0 flex-col gap-5 border-l border-line pl-5 md:flex md:w-48">
            {projects.map((proj, i) => {
              const title = proj.previewTitle?.[locale] ?? proj.title[locale];
              return (
                <button
                  key={proj.slug}
                  type="button"
                  onClick={() => jumpTo(i)}
                  className="group relative flex items-center gap-3 text-left"
                >
                  <span
                    className="absolute -left-[25px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all"
                    style={{
                      background:
                        active === i ? "var(--color-accent)" : "var(--color-line)",
                      boxShadow:
                        active === i ? "0 0 0 4px color-mix(in srgb, var(--color-accent) 20%, transparent)" : "none",
                    }}
                  />
                  <span
                    className={`font-mono text-xs ${
                      active === i ? "text-accent" : "text-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`truncate text-sm transition-colors group-hover:text-fg ${
                      active === i ? "text-fg" : "text-muted"
                    }`}
                  >
                    {title}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* 中间：翻页卡片 */}
          <div className="relative mx-auto h-[54vh] min-h-[340px] w-full max-w-xs [perspective:1600px] md:flex-1">
            {projects.map((proj, i) => {
              const title = proj.previewTitle?.[locale] ?? proj.title[locale];
              const delta = clamp(p - i, -1, 1);
              const rot = delta * -90;
              const hidden = Math.abs(p - i) >= 1;
              const loadCover = Math.abs(p - i) < 1.35;
              const priority = Math.abs(p - i) < 0.5;
              return (
                <button
                  key={proj.slug}
                  type="button"
                  onClick={() => open(proj.slug)}
                  aria-label={title}
                  className="absolute inset-0 overflow-hidden rounded-3xl border border-line text-left shadow-2xl"
                  style={{
                    background: proj.cover ? proj.gradient : proj.gradient,
                    transform: `rotateX(${rot}deg)`,
                    transformOrigin: "center",
                    backfaceVisibility: "hidden",
                    opacity: hidden ? 0 : 1,
                    zIndex: 20 - Math.round(Math.abs(p - i) * 10),
                    transition: "transform 0.15s ease, opacity 0.25s ease",
                    cursor: "pointer",
                  }}
                >
                  {proj.cover && loadCover ? (
                    <Image
                      src={proj.cover}
                      alt={title}
                      fill
                      sizes="(max-width: 767px) 100vw, 420px"
                      priority={priority}
                      loading={priority ? "eager" : "lazy"}
                      decoding="async"
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-transparent" />
                  <span className="absolute left-5 top-4 font-mono text-sm font-bold tracking-widest text-black/65">
                    {proj.glyph}
                  </span>
                  <span className="absolute right-5 top-4 font-mono text-sm text-black/55">
                    {proj.year}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-7 pt-16">
                    <p className="text-sm text-white/80">{proj.category[locale]}</p>
                    <p className="display mt-1 text-3xl text-white">
                      {title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 右侧：当前项目信息 */}
          <div className="text-center md:flex-1 md:text-left">
            <p className="font-mono text-xs uppercase tracking-wider text-accent">
              {current.category[locale]} · {current.year}
            </p>
            <h3 className="display mt-3 text-4xl sm:text-5xl">
              {currentTitle}
            </h3>
            <p className="mx-auto mt-4 max-w-md text-muted md:mx-0">
              {currentSummary}
            </p>
            <button
              type="button"
              onClick={() => open(current.slug)}
              className="mt-7 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              {cta} →
            </button>
            <p className="mt-6 font-mono text-xs text-muted">{hint}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
