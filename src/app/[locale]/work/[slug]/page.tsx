import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { projects, getProject, getAdjacent } from "@/content/projects";
import type { Project } from "@/content/projects";
import { Reveal } from "@/components/Reveal";
import { NewsDanmaku } from "@/components/work/NewsDanmaku";
import { CyberGameRules } from "@/components/work/CyberGameRules";
import { CyberGameComponents } from "@/components/work/CyberGameComponents";
import { OperationalVisualGallery } from "@/components/work/OperationalVisualGallery";
import { GameCollectionShowcase } from "@/components/work/GameCollectionShowcase";
import { AgentWheelShowcase } from "@/components/work/AgentWheelShowcase";
import { AgentChatShowcase } from "@/components/work/AgentChatShowcase";
import { AgentHomeShowcase } from "@/components/work/AgentHomeShowcase";
import { AgentDelegateShowcase } from "@/components/work/AgentDelegateShowcase";
import { AgentVoiceShowcase } from "@/components/work/AgentVoiceShowcase";
import { AgentPrivacyShowcase } from "@/components/work/AgentPrivacyShowcase";
import { AgentDesignSystem } from "@/components/work/AgentDesignSystem";
import { AgentAppArch } from "@/components/work/AgentAppArch";
import { AgentSelectionProvider } from "@/components/work/AgentSelectionContext";
import { AgentJourney } from "@/components/work/AgentJourney";
import { AgentScreensShowcase } from "@/components/work/AgentScreensShowcase";
import { MoodTraceShowcase } from "@/components/work/mood/MoodTraceShowcase";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// 静态导出：只生成上面列出的项目页，未知 slug 返回 404
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project) return {};
  return {
    title: `${project.title[locale]} · Zoey`,
    description: project.summary[locale],
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = getProject(slug);
  if (!project) notFound();
  const dict = getDictionary(locale);
  const { prev, next } = getAdjacent(slug);

  const meta = [
    { label: dict.project.role, value: project.role[locale] },
    { label: dict.project.team, value: project.team[locale] },
    { label: dict.project.tools, value: project.tools[locale] },
    { label: dict.project.duration, value: project.duration[locale] },
    { label: dict.project.year, value: project.year },
  ].filter((m) => m.value.trim().length > 0);
  const isPosterCollection = slug === "event-visual";

  return (
    <article data-nav-theme="dark" className="overflow-x-clip">
      {/* 头部 */}
      <header
        data-nav-theme="dark"
        className="relative overflow-hidden border-b border-line"
      >
        {/* 封面压花：封面图做暗色水印（目前：就绪 / 心绪轨迹 / 卡牌；
            浅底封面不适合，新增时按 slug 逐个开通） */}
        {(slug === "shipped-app" || slug === "mood-trace" || slug === "cyber-warfare") &&
        project.cover ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-3/4 sm:w-1/2"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 55%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 55%)",
            }}
          >
            <div
              className="h-full w-full"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to top, black 55%, transparent 98%)",
                maskImage:
                  "linear-gradient(to top, black 55%, transparent 98%)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.cover}
                alt=""
                className="h-full w-full object-cover object-center opacity-20 blur-[1px] grayscale-[35%]"
              />
            </div>
          </div>
        ) : null}
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-24">
          <Link
            href={`/${locale}#work`}
            className="text-xs text-muted transition-colors hover:text-accent sm:text-sm"
          >
            ← {dict.project.backToWork}
          </Link>
          <div className="mt-6 flex items-center gap-4 sm:mt-8 sm:gap-5">
            {project.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.logo}
                alt={`${project.title[locale]} App icon`}
                className="h-14 w-14 shrink-0 rounded-[24%] border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:h-16 sm:w-16"
              />
            ) : null}
            <div>
              <p className="kicker">{project.category[locale]}</p>
              <h1 className="display mt-2 max-w-3xl text-4xl leading-[1.15] sm:text-7xl">
                {project.title[locale]}
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:mt-6 sm:text-xl">
            {project.summary[locale]}
          </p>
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 sm:mt-8"
            >
              {dict.project.visit} ↗
            </a>
          ) : null}
        </div>
      </header>

      {/* 弹幕式项目背景（仅部分项目有） */}
      {project.introImages && project.introQuote ? (
        <NewsDanmaku
          images={project.introImages}
          quote={project.introQuote[locale]}
          question={locale === "zh"
            ? "我们如何保护个人权益，避免隐私被窥探？"
            : "How can we protect our personal rights and stop living under surveillance?"}
          answer={locale === "zh"
            ? "让更多人意识到信息泄露的危害、建立防范意识——这就是这个项目的初衷。我们选择用游戏卡牌这种轻松的形式，让玩家在对抗中理解隐私安全的重要性。"
            : "Raising awareness of information leakage and building a sense of prevention — that's the purpose of this project. We chose a card game format so players can grasp the importance of privacy security through play."}
        />
      ) : null}

      {project.video ? (
        <GameVideoShowcase locale={locale} video={project.video} />
      ) : null}

      {project.metrics?.length || project.socialProof ? (
        <ProjectImpactShowcase locale={locale} project={project} />
      ) : null}

      {project.gameItems?.length ? (
        <GameCollectionShowcase locale={locale} items={project.gameItems} />
      ) : null}

      {isPosterCollection && project.gallery?.length ? (
        <OperationalVisualGallery
          locale={locale}
          title={locale === "zh" ? "浙里等你" : "Travel in Zhejiang"}
          description={
            locale === "zh"
              ? "浙江旅游推广海报和相关周边设计。"
              : "A poster and merchandise design project for Zhejiang tourism."
          }
          images={project.gallery}
        />
      ) : null}

      {/* 游戏规则 */}
      {project.gameRules ? (
        <CyberGameRules locale={locale} rules={project.gameRules} />
      ) : null}

      {slug === "cyber-warfare" ? (
        <CyberGameComponents locale={locale} />
      ) : null}

      {slug === "shipped-app" ? (
        <AgentSelectionProvider>
          <AgentAppArch locale={locale} />
          <AgentDesignSystem locale={locale} />
          <AgentJourney>
            <AgentWheelShowcase locale={locale} />
            <AgentHomeShowcase locale={locale} />
            <AgentDelegateShowcase locale={locale} />
            <AgentVoiceShowcase locale={locale} />
            <AgentChatShowcase locale={locale} />
            <AgentPrivacyShowcase locale={locale} />
          </AgentJourney>
          <AgentScreensShowcase locale={locale} />
        </AgentSelectionProvider>
      ) : null}

      {/* 心绪轨迹：展示框架（占位卡槽待素材替换） */}
      {slug === "mood-trace" ? <MoodTraceShowcase locale={locale} /> : null}

      {/* 正文章节 */}
      <div>
        {project.sections.map((s, i) => (
          <section
            key={s.heading[locale]}
            data-nav-theme="dark"
            className={i % 2 === 0 ? "bg-[#101017]" : "bg-bg"}
          >
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-24">
              <Reveal>
                <div className="grid gap-4 md:grid-cols-[180px_1fr] md:gap-10">
                  <h2 className="display text-xl text-accent sm:text-2xl">
                    {s.heading[locale]}
                  </h2>
                  <div className="space-y-4">
                    {s.body[locale].map((para, j) => (
                      <p key={j} className="text-base leading-relaxed text-muted sm:text-lg">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      {/* 项目概览 */}
      {!project.gameItems?.length && !isPosterCollection ? (
        <section data-nav-theme="dark" className="bg-bg-soft">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="font-mono text-xs uppercase tracking-wider text-muted">
                    {m.label}
                  </dt>
                  <dd className="mt-2 text-sm text-fg">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* 上一个 / 下一个 */}
      <nav data-nav-theme="dark" className="border-t border-line">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-2 sm:px-8">
          <Link href={`/${locale}/work/${prev.slug}`} className="group">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              ← {dict.project.prev}
            </span>
            <p className="display mt-2 text-lg transition-colors group-hover:text-accent sm:text-xl">
              {prev.title[locale]}
            </p>
          </Link>
          <Link
            href={`/${locale}/work/${next.slug}`}
            className="group text-right"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              {dict.project.next} →
            </span>
            <p className="display mt-2 text-lg transition-colors group-hover:text-accent sm:text-xl">
              {next.title[locale]}
            </p>
          </Link>
        </div>
      </nav>
    </article>
  );
}

function ProjectImpactShowcase({
  locale,
  project,
}: {
  locale: Locale;
  project: Project;
}) {
  return (
    <section data-nav-theme="dark" className="bg-bg-soft">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[360px_1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              {locale === "zh" ? "上线表现" : "Launch impact"}
            </span>
            <h2 className="display mt-2 text-2xl sm:text-4xl">
              {locale === "zh" ? "数据与玩家反馈" : "Metrics and player feedback"}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {locale === "zh"
                ? "用上线后的真实数据和社媒讨论补充说明这个小游戏的传播表现。"
                : "Post-launch metrics and social discussion show how the mini game performed beyond the build itself."}
            </p>

            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
              >
                {locale === "zh" ? "体验游戏" : "Play the game"} ↗
              </a>
            ) : null}
          </div>

          <div className="space-y-8">
            {project.metrics?.length ? (
              <MetricGrid locale={locale} metrics={project.metrics} />
            ) : null}

            {project.socialProof ? (
              <SocialProofGallery
                locale={locale}
                socialProof={project.socialProof}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricGrid({
  locale,
  metrics,
}: {
  locale: Locale;
  metrics: NonNullable<Project["metrics"]>;
}) {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-3">
      {metrics.map((metric) => (
        <div
          key={`${metric.value[locale]}-${metric.label[locale]}`}
          className="border border-line bg-bg px-4 py-5"
        >
          <p className="display text-3xl text-accent sm:text-4xl">
            {metric.value[locale]}
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-wider text-fg">
            {metric.label[locale]}
          </p>
          {metric.description ? (
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {metric.description[locale]}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function SocialProofGallery({
  locale,
  socialProof,
}: {
  locale: Locale;
  socialProof: NonNullable<Project["socialProof"]>;
}) {
  return (
    <div className="mt-10">
      <span className="font-mono text-xs uppercase tracking-wider text-muted">
        {socialProof.eyebrow[locale]}
      </span>
      <h3 className="display mt-2 text-xl sm:text-3xl">
        {socialProof.heading[locale]}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
        {socialProof.body[locale]}
      </p>

      <div className="mt-6 columns-1 gap-4 sm:columns-2">
        {socialProof.images.map((image) => (
          <div
            key={image.src}
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
          </div>
        ))}
      </div>
    </div>
  );
}

function GameVideoShowcase({
  locale,
  video,
}: {
  locale: Locale;
  video: NonNullable<Project["video"]>;
}) {
  return (
    <section data-nav-theme="dark" className="bg-bg">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-center">
        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">
            {locale === "zh" ? "实机展示" : "Live Demo"}
          </span>
          <h2 className="display mt-2 text-2xl sm:text-4xl">
            {video.title[locale]}
          </h2>
          {video.caption ? (
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              {video.caption[locale]}
            </p>
          ) : null}
        </div>

        <GameVideoPlayer locale={locale} video={video} />
      </div>
    </section>
  );
}

function GameVideoPlayer({
  locale,
  video,
}: {
  locale: Locale;
  video: NonNullable<Project["video"]>;
}) {
  return (
    <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[28px] border border-line bg-black p-2 shadow-2xl">
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
    </div>
  );
}
