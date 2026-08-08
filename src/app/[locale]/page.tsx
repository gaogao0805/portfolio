import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, otherLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { WorkPosters } from "@/components/work/WorkPosters";
import Image from "next/image";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const a = dict.about;
  // 构建开关：HIDE_POLAROID=1 npm run build 时隐藏首页 About 拍立得、板块退化为居中堆叠
  // （部署仓库用；日常开发与默认构建保留拍立得和左右排版）
  const hidePolaroid = process.env.HIDE_POLAROID === "1";

  return (
    <>
      {/* 首页定位：首屏（纯色白底） */}
      <div
        id="top"
        data-nav-theme="light"
        className="theme-light relative overflow-hidden"
      >
        <Hero
          locale={locale}
          home={dict.home}
          introAlt={locale === "zh" ? getDictionary(otherLocale(locale)).home.intro : undefined}
        />
      </div>

      {/* 作品板块（白色 + 横向对焦卡片流） */}
      <section id="work" data-nav-theme="light" className="scroll-mt-24 bg-white">
        <WorkPosters
          locale={locale}
          title={dict.work.title}
          titleEm={dict.work.titleEm}
          cta={dict.work.viewProject}
          hint={
            locale === "zh"
              ? "滚动翻页 · 点击查看项目"
              : "Scroll to flip · click to open"
          }
        />
      </section>

      {/* 关于板块（透明底，共享全页氛围层） */}
      <section
        id="about"
        data-nav-theme="light"
        className="theme-light relative z-10 scroll-mt-24 overflow-hidden"
      >
        <div
          className={`relative mx-auto flex max-w-2xl flex-col items-center px-5 py-28 text-center sm:px-8 sm:py-36 ${
            hidePolaroid
              ? ""
              : "sm:max-w-5xl sm:flex-row sm:items-center sm:justify-center sm:gap-16 sm:text-left"
          }`}
        >
          {/* 拍立得照片：白框、微斜、签名落款，hover 回正（HIDE_POLAROID=1 构建时隐藏） */}
          <Reveal delay={0.05} className={hidePolaroid ? "hidden" : undefined}>
            <div className="group mb-14 w-56 shrink-0 rotate-[-3deg] bg-white p-2.5 pb-3 shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-transform duration-500 hover:rotate-0 sm:mb-0 sm:w-64">
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
          </Reveal>
          <Reveal>
            {/* 文字干净利落，贴纸浮在块边缘（拼贴式，参考 adasilv2） */}
            <div className="relative">
              {/* Hero 同款节奏：小问候行 + 大陈述块，块间明确 gap——
                  比单 h2 硬换行的同号字墙更舒展 */}
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
                <h2
                  className={`display relative max-w-xl leading-[1.45] sm:max-w-none ${
                    locale === "zh"
                      ? "font-smiley-cjk text-2xl sm:text-[2.75rem] xl:text-[3.2rem]"
                      : "text-2xl sm:text-[2rem]"
                  }`}
                >
                  {/* 装帧引号「」：CSS 画的直角括号对，语录感装帧 */}
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
                </h2>
              </div>
              <Link
                href={`/${locale}/about#resume`}
                className="mt-10 inline-block rounded-full border border-line px-8 py-4 text-base font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
              >
                {a.viewDetails}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
