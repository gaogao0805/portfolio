import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { PressureLabel } from "@/components/PressureLabel";
import { WorkPosters } from "@/components/work/WorkPosters";

export default async function HomePage({
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
      {/* 首页定位：首屏（白色） */}
      <div id="top" data-nav-theme="light" className="theme-light bg-bg-light">
        <Hero locale={locale} home={dict.home} />
      </div>

      {/* 作品板块（黑色 + 格子） */}
      <section id="work" data-nav-theme="dark" className="scroll-mt-24">
        <WorkPosters
          locale={locale}
          title={dict.work.title}
          subtitle={dict.work.subtitle}
          cta={dict.work.viewProject}
          hint={
            locale === "zh"
              ? "滚动翻页 · 点击查看项目"
              : "Scroll to flip · click to open"
          }
        />
      </section>

      {/* 关于板块（白色） */}
      <section
        id="about"
        data-nav-theme="light"
        className="theme-light relative z-10 scroll-mt-24 bg-bg-light"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center sm:px-8">
          <Reveal>
            <PressureLabel text="About Me" size={20} />
            <h2 className="display mt-3 text-4xl sm:text-5xl">{a.title}</h2>
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
