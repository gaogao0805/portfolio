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
import { ProjectToc } from "@/components/work/ProjectToc";

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
    // 年份单独放在头部卡片右上角，不进 meta 列
  ].filter((m) => m.value.trim().length > 0);
  const isPosterCollection = slug === "event-visual";
  // 中文标题用得意黑（仅中文部分），纯拉丁标题（如 CYBER WARFARE）保持原字重与英文版一致
  const titleHasCjk = /[\u4e00-\u9fff]/.test(project.title.zh);

  return (
    <article data-nav-theme="light" className="overflow-x-clip">
      {/* 悬浮章节导航（仅配了 toc 的项目显示，返回键并入胶囊） */}
      {project.toc?.length ? (
        <ProjectToc
          locale={locale}
          items={project.toc}
          backHref={`/${locale}#work`}
          backLabel={dict.project.backToWork}
        />
      ) : (
        /* 无 TOC 的项目页：独立的深色圆角返回钮（移动端让位 Dock） */
        <Link
          href={`/${locale}#work`}
          aria-label={dict.project.backToWork}
          className="fixed left-5 top-24 z-40 hidden h-11 w-11 items-center justify-center rounded-2xl bg-[#161515] text-white shadow-[0_10px_26px_rgba(0,0,0,0.22)] transition-transform hover:-translate-x-0.5 sm:flex"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>
      )}

      {/* 头部：浅灰大圆角卡片（标题 + meta + 年份右上 + 压纹封面） */}
      <header data-nav-theme="light" id="overview" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-8 sm:pb-12 sm:pt-10">
          <div className="relative overflow-hidden rounded-[2rem] bg-bg-gray p-6 sm:p-12">
            {/* 压纹封面：低透明水印压入卡片右缘（自有质感，不抄照片拼贴） */}
            {project.cover ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 sm:block"
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
                    className="h-full w-full object-cover object-center opacity-[0.17] blur-[1px] grayscale-[35%]"
                  />
                </div>
              </div>
            ) : null}
            <div className="relative z-10">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
                <div className="flex items-center gap-4 sm:gap-5">
                  {project.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.logo}
                      alt={`${project.title[locale]} App icon`}
                      className="h-14 w-14 shrink-0 rounded-[24%] border border-black/10 sm:h-16 sm:w-16"
                    />
                  ) : null}
                  <div>
                    <h1 className={`display max-w-3xl text-4xl leading-[1.15] sm:text-6xl ${locale === "zh" && titleHasCjk ? "font-smiley-cjk" : ""}`}>
                      {project.title[locale]}
                    </h1>
                  </div>
                </div>
                {/* 年份 + 体验 CTA 收进右上角 */}
                <div className="flex shrink-0 flex-col items-end gap-3">
                  <span className="font-sans text-xs uppercase tracking-wider text-muted sm:text-sm">
                    {project.year}
                  </span>
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 sm:px-5 sm:py-2.5 sm:text-sm"
                    >
                      {dict.project.visit} ↗
                    </a>
                  ) : null}
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:mt-6 sm:text-lg">
                {project.summary[locale]}
              </p>
              {meta.length ? (
                <dl
                  className={`mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-black/10 pt-7 ${
                    meta.length <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-4"
                  }`}
                >
                  {meta.map((m) => (
                    <div key={m.label}>
                      <dt className="font-sans text-xs uppercase tracking-wider text-muted">
                        {m.label}
                      </dt>
                      <dd className="mt-1.5 text-sm text-fg">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* 我的职责（叙事板块，配了 roleDetail 才显示）——左标签右正文，
          与正文章节同一网格（md:grid-cols-[180px_1fr]） */}
      {project.roleDetail?.[locale]?.length ? (
        <section data-nav-theme="light" className="bg-bg">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
            <Reveal>
              <div className="grid gap-4 md:grid-cols-[180px_1fr] md:gap-10">
                <h2 className="display text-xl text-accent sm:text-2xl">
                  {dict.project.role}
                </h2>
                <div className="max-w-3xl space-y-4">
                  {project.roleDetail[locale].map((para, i) => (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-fg/85 sm:text-lg"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* 弹幕式项目背景（仅部分项目有） */}
      {project.introImages && project.introQuote ? (
        <div id="background" className="scroll-mt-20">
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
        </div>
      ) : null}

      {project.video ? (
        <div id="video" className="scroll-mt-20">
          <GameVideoShowcase locale={locale} video={project.video} />
        </div>
      ) : null}

      {project.metrics?.length || project.socialProof ? (
        <div id="impact" className="scroll-mt-20">
          <ProjectImpactShowcase locale={locale} project={project} />
        </div>
      ) : null}

      {project.gameItems?.length ? (
        <div id="cases" className="scroll-mt-20">
          <GameCollectionShowcase locale={locale} items={project.gameItems} />
        </div>
      ) : null}

      {isPosterCollection && project.gallery?.length ? (
        <div id="gallery" className="scroll-mt-20">
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
        </div>
      ) : null}

      {/* 游戏规则 */}
      {project.gameRules ? (
        <div id="rules" className="scroll-mt-20">
          <CyberGameRules locale={locale} rules={project.gameRules} />
        </div>
      ) : null}

      {slug === "cyber-warfare" ? (
        <div id="components" className="scroll-mt-20">
          <CyberGameComponents locale={locale} />
        </div>
      ) : null}

      {slug === "shipped-app" ? (
        <AgentSelectionProvider>
          <div id="architecture" className="scroll-mt-20">
            <AgentAppArch locale={locale} />
          </div>
          <div id="design-system" className="scroll-mt-20">
            <AgentDesignSystem locale={locale} />
          </div>
          <div id="features" className="scroll-mt-20">
            <AgentJourney>
              <AgentWheelShowcase locale={locale} />
              <AgentHomeShowcase locale={locale} />
              <AgentDelegateShowcase locale={locale} />
              <AgentVoiceShowcase locale={locale} />
              <AgentChatShowcase locale={locale} />
              <AgentPrivacyShowcase locale={locale} />
            </AgentJourney>
          </div>
          <div id="screens" className="scroll-mt-20">
            <AgentScreensShowcase locale={locale} />
          </div>
        </AgentSelectionProvider>
      ) : null}

      {/* 心绪轨迹：展示框架（占位卡槽待素材替换） */}
      {slug === "mood-trace" ? <MoodTraceShowcase locale={locale} /> : null}

      {/* 正文章节 */}
      <div>
        {project.sections.map((s, i) => (
          <section
            key={s.heading[locale]}
            data-nav-theme="light"
            className={i % 2 === 0 ? "bg-bg-gray" : "bg-bg"}
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

      {/* 项目 meta 已并入头部卡片，不再单独成章 */}

      {/* 上一个 / 下一个 */}
      <nav data-nav-theme="light" className="border-t border-line">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-2 sm:px-8">
          <Link href={`/${locale}/work/${prev.slug}`} className="group">
            <span className="font-sans text-xs uppercase tracking-wider text-muted">
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
            <span className="font-sans text-xs uppercase tracking-wider text-muted">
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
    <section data-nav-theme="light" className="bg-bg-soft">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[360px_1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <span className="font-sans text-xs uppercase tracking-wider text-muted">
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
          <p className="mt-2 font-sans text-xs uppercase tracking-wider text-fg">
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
      <span className="font-sans text-xs uppercase tracking-wider text-muted">
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
    <section data-nav-theme="light" className="bg-bg">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-center">
        <div className="max-w-xl">
          <span className="font-sans text-xs uppercase tracking-wider text-muted">
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
