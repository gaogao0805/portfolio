"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Locale } from "@/i18n/config";
import type { Project } from "@/content/projects";

export function ProjectCard({
  locale,
  project,
  index,
  cta,
}: {
  locale: Locale;
  project: Project;
  index: number;
  cta: string;
}) {
  const title = project.previewTitle?.[locale] ?? project.title[locale];

  return (
    <Link href={`/${locale}/work/${project.slug}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* 封面（渐变占位，之后可替换为图片） */}
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line"
          style={project.cover ? undefined : { background: project.gradient }}
        >
          {project.cover ? (
            <Image
              src={project.cover}
              alt={title}
              fill
              sizes="(max-width: 767px) 100vw, 33vw"
              className="object-cover"
              unoptimized
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          <span className="absolute left-5 top-4 font-mono text-xs font-bold tracking-widest text-black/70">
            {project.glyph}
          </span>
          <span className="absolute right-5 top-4 font-mono text-xs text-black/60">
            {project.year}
          </span>
          {/* hover 时上滑出现的 CTA 条 */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/85 px-5 py-3 text-sm font-medium text-accent backdrop-blur transition-transform duration-300 group-hover:translate-y-0">
            {cta} →
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="display text-2xl transition-colors group-hover:text-accent">
              {title}
            </h3>
          </div>
          <p className="mt-1 text-sm text-muted">{project.category[locale]}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags[locale].map((t) => (
              <span
                key={t}
                className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
