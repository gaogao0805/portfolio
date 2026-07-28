import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { PressureLabel } from "@/components/PressureLabel";
import { WorkPosters } from "@/components/work/WorkPosters";
import { EmText } from "@/components/EmText";
import { AmbientOrbs } from "@/components/AmbientOrbs";
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
  // 构建开关：HIDE_POLAROID=1 npm run build 时隐藏首页 About 拍立得、板块整体居中
  // （部署仓库用；日常开发与默认构建保留拍立得和左右排版）
  const hidePolaroid = process.env.HIDE_POLAROID === "1";

  return (
    <>
      {/* 首页定位：首屏（白色 + 漂移光斑氛围层） */}
      <div
        id="top"
        data-nav-theme="light"
        className="theme-light relative overflow-hidden bg-bg-light"
      >
        <AmbientOrbs />
        <Hero locale={locale} home={dict.home} />
      </div>

      {/* 作品板块（黑色 + 格子） */}
      <section id="work" data-nav-theme="dark" className="scroll-mt-24">
        <WorkPosters
          locale={locale}
          title={dict.work.title}
          titleEm={dict.work.titleEm}
          subtitle={dict.work.subtitle}
          cta={dict.work.viewProject}
          hint={
            locale === "zh"
              ? "滚动翻页 · 点击查看项目"
              : "Scroll to flip · click to open"
          }
        />
      </section>

      {/* 关于板块（白色 + 漂移光斑氛围层） */}
      <section
        id="about"
        data-nav-theme="light"
        className="theme-light relative z-10 scroll-mt-24 overflow-hidden bg-bg-light"
      >
        <AmbientOrbs />
        <div
          className={`relative mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center sm:px-8 ${
            hidePolaroid
              ? ""
              : "sm:max-w-4xl sm:flex-row sm:items-center sm:gap-14 sm:text-left"
          }`}
        >
          {/* 拍立得照片：白框、微斜、签名落款，hover 回正（HIDE_POLAROID=1 构建时隐藏） */}
          <Reveal delay={0.05} className={hidePolaroid ? "hidden" : undefined}>
            <div className="group mb-10 w-56 shrink-0 rotate-[-3deg] bg-white p-2.5 pb-3 shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-transform duration-500 hover:rotate-0 sm:mb-0 sm:w-60">
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
            <PressureLabel text="About Me" size={20} />
            <h2 className="display mt-3 text-4xl sm:text-5xl">
              <EmText text={a.title} em="Zoey" />
            </h2>
            <p className="mt-5 text-xl text-muted">{a.lead}</p>
            <p className="mt-5 leading-relaxed text-fg/80">{a.bio[0]}</p>
            <Link
              href={`/${locale}/about`}
              className="mt-8 inline-block rounded-full border border-line px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
            >
              {a.viewDetails} →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
