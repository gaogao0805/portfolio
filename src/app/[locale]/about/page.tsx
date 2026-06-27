import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { Reveal } from "@/components/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: `${dict.about.title} · Zoey` };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const a = dict.about;

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <Link
          href={`/${locale}#about`}
          className="text-sm text-muted transition-colors hover:text-accent"
        >
          ← {a.kicker}
        </Link>
      </Reveal>

      {/* 头部：头像 + 姓名 + 职位 + 期望城市 + 一句话 */}
      <Reveal>
        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end">
          {site.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={site.avatar}
              alt="Zoey"
              className="h-32 w-32 shrink-0 rounded-3xl border border-line object-cover sm:h-40 sm:w-40"
            />
          ) : null}
          <div>
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-black">
              {a.role}
            </span>
            <h1 className="display mt-4 text-5xl leading-[1.05] sm:text-7xl">
              {a.title}
            </h1>
            <p className="mt-4 text-sm">
              <span className="font-mono uppercase tracking-wider text-muted">
                {a.preferredTitle}
              </span>
              <span className="ml-2 text-fg">{a.preferred.join(" · ")}</span>
            </p>
          </div>
        </div>
        <p className="mt-8 max-w-2xl text-2xl text-muted">{a.lead}</p>
      </Reveal>

      {/* 优势亮点 bento */}
      <Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {a.highlights.map((h, i) => (
            <div
              key={i}
              className="rounded-2xl border border-line bg-bg-soft p-6"
            >
              <span className="font-mono text-xs text-accent">
                0{i + 1}
              </span>
              <h3 className="display mt-3 text-xl">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{h.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 正文 */}
      <Reveal delay={0.05}>
        <div className="mt-14 max-w-2xl space-y-5">
          {a.bio.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed text-fg/90">
              {p}
            </p>
          ))}
        </div>
      </Reveal>

      {/* 工作 + 教育（双栏） */}
      <Reveal>
        <section className="mt-16 border-t border-line pt-12">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
            {a.workTitle}
          </h2>
          <ol className="mt-6 space-y-7">
            {a.work.map((w, i) => (
              <li key={i} className="grid gap-2 sm:grid-cols-[170px_1fr]">
                <span className="font-mono text-sm text-accent">{w.period}</span>
                <div className="max-w-2xl">
                  <p className="text-lg font-medium text-fg">
                    {w.role} · {w.company}
                  </p>
                  <p className="mt-1.5 leading-relaxed text-muted">
                    {w.summary}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {w.points.map((pt, j) => (
                      <li
                        key={j}
                        className="flex gap-2.5 text-sm leading-relaxed text-muted"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-12 border-t border-line pt-12">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
            {a.eduTitle}
          </h2>
          <ol className="mt-6 space-y-7">
            {a.education.map((e, i) => (
              <li key={i} className="grid gap-2 sm:grid-cols-[170px_1fr]">
                <span className="font-mono text-sm text-accent">{e.period}</span>
                <div>
                  <p className="text-lg font-medium text-fg">{e.school}</p>
                  <p className="mt-1 text-muted">{e.degree}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      {/* 技能 + 工具 */}
      <Reveal>
        <div className="mt-16 border-t border-line pt-12">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
            {a.skillsTitle}
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {a.skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-line px-4 py-1.5 text-sm text-fg"
              >
                {s}
              </span>
            ))}
          </div>

          <h2 className="mt-10 font-mono text-xs uppercase tracking-wider text-muted">
            {a.toolsTitle}
          </h2>
          <div className="mt-5 space-y-4">
            {a.toolGroups.map((g) => (
              <div key={g.label} className="flex flex-wrap items-center gap-3">
                <span className="w-20 shrink-0 font-mono text-xs text-accent">
                  {g.label}
                </span>
                {g.items.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line px-4 py-1.5 text-sm text-fg"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* 简历下载（占位，之后替换 public/resume-*.pdf） */}
      <Reveal>
        <a
          href={site.resume[locale]}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-16 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
        >
          {a.resume} ↓
        </a>
      </Reveal>
    </div>
  );
}
