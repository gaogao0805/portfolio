import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Reveal } from "@/components/Reveal";
import { SkillPhysics } from "@/components/skills/SkillPhysics";
import {
  Timeline,
  TimelineItem,
  TimelineSection,
} from "@/components/timeline/Timeline";

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
    <>
      {/* 板块一（白色）：头部 + 优势亮点 */}
      <section data-nav-theme="light" className="theme-light bg-bg-light">
        <div className="mx-auto max-w-5xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
          <Reveal>
            <Link
              href={`/${locale}#about`}
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              ← {a.kicker}
            </Link>
          </Reveal>

          {/* 头部：姓名 + 职位 + 一句话（头像 / 期望城市暂时隐藏） */}
          <Reveal>
            <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end">
              {/* 头像（site.avatar）暂时隐藏，需要时恢复 */}
              <div>
                <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-black">
                  {a.role}
                </span>
                <h1 className="display mt-4 text-5xl leading-[1.05] sm:text-7xl">
                  {a.title}
                </h1>
                {/* 期望城市（about.preferred）暂时隐藏，需要时恢复 */}
              </div>
            </div>
            <p className="mt-8 max-w-2xl text-2xl text-muted">{a.lead}</p>
          </Reveal>

          {/* 优势亮点 bento（about.highlights）暂时隐藏，需要时恢复 */}
        </div>
      </section>

      {/* 简介色带（about.bio）暂时隐藏，需要时恢复 */}
      {/* 板块二（浅灰）：工作 + 项目 + 教育 滚动时间线 */}
      <section id="resume" data-nav-theme="light" className="theme-light scroll-mt-24 bg-bg-gray">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <Timeline tone="light">
              <TimelineSection index="01" title={a.workTitle}>
                {a.work.map((w, i) => (
                  <TimelineItem key={i} period={w.period}>
                    <EntryContent entry={w} />
                  </TimelineItem>
                ))}
              </TimelineSection>

              <TimelineSection
                index="02"
                title={a.projTitle}
                className="mt-12 border-t border-line pt-12"
              >
                {a.projects.map((w, i) => (
                  <TimelineItem key={i} period={w.period}>
                    <EntryContent entry={w} />
                  </TimelineItem>
                ))}
              </TimelineSection>

              <TimelineSection
                index="03"
                title={a.eduTitle}
                className="mt-12 border-t border-line pt-12"
              >
                {a.education.map((e, i) => (
                  <TimelineItem key={i} period={e.period}>
                    <p className="text-lg font-medium text-fg">{e.school}</p>
                    <p className="mt-1 text-muted">{e.degree}</p>
                  </TimelineItem>
                ))}
              </TimelineSection>
            </Timeline>
          </Reveal>
        </div>
      </section>

      {/* 板块三（白色）：技能 + 工具 */}
      <section data-nav-theme="light" className="theme-light bg-bg-light">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          {/* 技能 + 工具：2D 物理标签墙 */}
          <Reveal>
            <SkillPhysics
              skillsTitle={a.skillsTitle}
              toolsTitle={a.toolsTitle}
              skills={a.skills}
              toolGroups={a.toolGroups}
              hint={locale === "zh" ? "抓住一颗甩甩看" : "Grab one & throw it"}
              empty={
                locale === "zh"
                  ? "指向或点住一颗，看看它对我意味着什么 →"
                  : "Hover or tap a tag to see what it means to me →"
              }
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}

/** 时间线条目正文：职位 · 公司 + 一句话 + 要点列表（工作 / 项目共用） */
function EntryContent({
  entry,
}: {
  entry: {
    role: string;
    company: string;
    summary: string;
    points: readonly string[];
  };
}) {
  return (
    <>
      <p className="text-lg font-medium text-fg">
        {entry.role} · {entry.company}
      </p>
      <p className="mt-1.5 leading-relaxed text-muted">{entry.summary}</p>
      <ul className="mt-3 space-y-2">
        {entry.points.map((pt, j) => (
          <li
            key={j}
            className="flex gap-2.5 text-sm leading-relaxed text-muted"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
