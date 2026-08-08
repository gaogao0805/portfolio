import type { Metadata } from "next";
import Image from "next/image";
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
  const work = a.work;

  return (
    <>
      {/* 板块一（白色）：头部 + 优势亮点 */}
      <section data-nav-theme="light" className="theme-light bg-bg-light">
        <div className="mx-auto max-w-5xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
          {/* 头部：职位胶囊 + 首页同款大陈述（得意黑 + serif 名牌 + 装帧引号），右侧拍立得 */}
          <Reveal>
            <div className="mt-10 flex flex-col gap-12 sm:flex-row sm:items-center sm:justify-between sm:gap-16">
              <div>
                <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-black">
                  {a.role}
                </span>
                <div className="mt-6 flex flex-col gap-3 sm:gap-5">
                  <p
                    className={`display ${
                      locale === "zh"
                        ? "font-smiley-cjk text-2xl sm:text-[2.75rem] xl:text-[3.2rem]"
                        : "text-2xl sm:text-[2rem]"
                    }`}
                  >
                    {locale === "zh" ? (
                      <>
                        你好，我是<em className="serif-em">Zoey</em>，
                      </>
                    ) : (
                      <>
                        Hi, I&apos;m <em className="serif-em">Zoey</em> —
                      </>
                    )}
                  </p>
                  <h1
                    className={`display relative max-w-xl leading-[1.45] sm:max-w-none ${
                      locale === "zh"
                        ? "font-smiley-cjk text-2xl sm:text-[2.75rem] xl:text-[3.2rem]"
                        : "text-2xl sm:text-[2rem]"
                    }`}
                  >
                    {/* 装帧引号：CSS 直角括号对 */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -left-4 -top-4 h-5 w-5 select-none border-l-[3px] border-t-[3px] border-accent/60 sm:-left-9 sm:-top-5 sm:h-6 sm:w-6"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-4 -right-4 h-5 w-5 select-none border-b-[3px] border-r-[3px] border-accent/60 sm:-bottom-5 sm:-right-9 sm:h-6 sm:w-6"
                    />
                    {locale === "zh" ? (
                      <>
                        以克制的设计语言，
                        <br />
                        赋予每个细节恰到好处的意义。
                      </>
                    ) : (
                      <>
                        a restrained design language,
                        <br />
                        giving every detail its right meaning.
                      </>
                    )}
                  </h1>
                </div>
              </div>
              {/* 拍立得：首页同款（白框微斜、签名落款、hover 回正）；移动端排在文字下方居中 */}
              <div className="group w-56 shrink-0 rotate-[-3deg] self-center bg-white p-2.5 pb-3 shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-transform duration-500 hover:rotate-0 sm:w-64">
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <Image
                    src="/avatar.jpg"
                    alt={locale === "zh" ? "Zoey 的照片" : "Photo of Zoey"}
                    fill
                    sizes="240px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="mt-2.5 flex h-8 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.svg"
                    alt=""
                    className="h-5 w-auto opacity-70"
                  />
                </div>
              </div>
            </div>
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
                {work.map((w, i) => (
                  <TimelineItem key={i} period={w.period}>
                    <EntryContent entry={w} />
                  </TimelineItem>
                ))}
              </TimelineSection>

              {/* 章节分割线：ml-8 从内容缩进处起笔，避开左侧竖线脊柱，不与竖线交错 */}
              <div aria-hidden className="my-12 ml-8 border-t border-line" />

              <TimelineSection
                index="02"
                title={a.projTitle}
              >
                {a.projects.map((w, i) => (
                  <TimelineItem key={i} period={w.period}>
                    <EntryContent entry={w} />
                  </TimelineItem>
                ))}
              </TimelineSection>

              <div aria-hidden className="my-12 ml-8 border-t border-line" />

              <TimelineSection
                index="03"
                title={a.eduTitle}
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
