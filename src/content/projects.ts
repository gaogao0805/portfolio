import type { Locale } from "@/i18n/config";

/** 一段双语文本 */
type LocalizedText = Record<Locale, string>;
/** 一组双语列表 */
type LocalizedList = Record<Locale, string[]>;

export type ProjectSection = {
  heading: LocalizedText;
  /** 每段为一个段落 */
  body: LocalizedList;
};

export type ProjectGameRules = {
  eyebrow: LocalizedText;
  heading: LocalizedText;
  introduction: LocalizedText;
};

export type ProjectVideo = {
  src: string;
  poster?: string;
  title: LocalizedText;
  caption?: LocalizedText;
};

export type ProjectMetric = {
  value: LocalizedText;
  label: LocalizedText;
  description?: LocalizedText;
};

export type ProjectSocialImage = {
  src: string;
  width: number;
  height: number;
  alt: LocalizedText;
};

export type ProjectSocialProof = {
  eyebrow: LocalizedText;
  heading: LocalizedText;
  body: LocalizedText;
  images: ProjectSocialImage[];
};

export type ProjectGameItem = {
  title: LocalizedText;
  subtitle?: LocalizedText;
  description: LocalizedList;
  role: LocalizedText;
  duration?: LocalizedText;
  theme?: "dark" | "light";
  link?: string;
  video?: ProjectVideo;
  metrics?: ProjectMetric[];
  socialProof?: ProjectSocialProof;
};

export type Project = {
  /** URL 用的英文短标识，如 /work/mindful-app */
  slug: string;
  year: string;
  /** 卡片封面渐变（占位用，之后可替换为真实图片 cover） */
  gradient: string;
  /** 卡片封面图片，优先于 gradient */
  cover?: string;
  /** 封面明暗：浅底封面用 dark（角标/年份用黑字）；深底封面省略即可（默认白字） */
  coverTone?: "dark" | "light";
  /** App 图标（详情页头部展示，如 /images/ready-logo.svg） */
  logo?: string;
  /** 暂时隐藏（不进列表与详情页，数据保留，翻回 false 即恢复） */
  hidden?: boolean;
  /** 卡片上的强调字，比如 emoji 或缩写 */
  glyph: string;
  title: LocalizedText;
  /** 首页 / 作品列表展示标题；详情页仍使用 title */
  previewTitle?: LocalizedText;
  category: LocalizedText;
  summary: LocalizedText;
  /** 首页 / 作品列表展示摘要；详情页仍使用 summary */
  previewSummary?: LocalizedText;
  tags: LocalizedList;
  role: LocalizedText;
  team: LocalizedText;
  tools: LocalizedText;
  duration: LocalizedText;
  /** 线上地址（App Store / 网页 / 体验链接），没有就留空字符串 */
  link?: string;
  /** 详情页顶部弹幕式背景图 */
  introImages?: string[];
  /** 详情页顶部引言 */
  introQuote?: LocalizedText;
  /** 详情页的视觉展示图 */
  gallery?: string[];
  /** 详情页的游戏 / 产品录屏 */
  video?: ProjectVideo;
  /** 项目上线后的数据表现 */
  metrics?: ProjectMetric[];
  /** 社媒讨论 / 用户反馈截图 */
  socialProof?: ProjectSocialProof;
  /** 游戏 / 手游集合页中的单个游戏案例 */
  gameItems?: ProjectGameItem[];
  /** 游戏类项目的玩法说明 */
  gameRules?: ProjectGameRules;
  sections: ProjectSection[];
};

/**
 * 作品数据。新增一个项目 = 往这个数组里加一个对象 + （可选）放一张封面图。
 * 顺序就是展示顺序。
 *
 * 下面两个是你已上线的真实项目的占位框架，把 TODO 的地方换成真实内容即可。
 */
const allProjects: Project[] = [
  {
    slug: "shipped-app",
    year: "2025 — Present",
    cover: "/images/ready-cover.jpg",
    logo: "/images/ready-logo.svg",
    gradient: "linear-gradient(135deg,#6D5BFF 0%,#00E0C7 100%)",
    glyph: "APP",
    title: {
      zh: "就绪",
      en: "Ready",
    },
    category: { zh: "移动 App · AI 求职招聘", en: "Mobile App · AI Recruitment" },
    summary: {
      zh: "一款 AI 驱动的求职招聘软件，我负责从早期概念到上线的整体体验设计。",
      en: "An AI-powered recruitment app. I owned the experience from early concept to launch.",
    },
    tags: {
      zh: ["移动端", "0→1", "设计系统", "已上线"],
      en: ["Mobile", "0→1", "Design System", "Shipped"],
    },
    role: { zh: "产品设计师（主导）", en: "Product Designer (lead)" },
    team: { zh: "", en: "" },
    tools: { zh: "Figma、Claude Code、Codex", en: "Figma, Claude Code, Codex" },
    duration: { zh: "", en: "" },
    link: "", // TODO: App Store / 官网链接
    sections: [],
  },
  {
    slug: "mood-trace",
    year: "2025",
    cover: "/images/mood-trace-cover.jpg",
    logo: "/images/mood-trace-logo.svg",
    gradient: "linear-gradient(135deg,#6A7CFF 0%,#B78CFF 100%)",
    glyph: "🌙",
    title: {
      zh: "心绪轨迹",
      en: "Mood Trace",
    },
    previewTitle: {
      zh: "心绪轨迹",
      en: "Mood Trace",
    },
    category: { zh: "心理健康 · 情绪记录 App", en: "Mental Health · Mood App" },
    summary: {
      zh: "一款关注情绪与心理健康的 App：用轻量打卡记录每日情绪，AI 伙伴倾听与回应，把看不见的心理状态变成看得见的轨迹。",
      en: "A mental-health companion app: lightweight daily check-ins, an AI partner that listens and responds, turning invisible feelings into a visible trajectory.",
    },
    previewSummary: {
      zh: "记录每日情绪、AI 陪伴对话、看见自己的心理轨迹。",
      en: "Track daily moods, chat with an AI companion, and see your emotional trajectory.",
    },
    tags: {
      zh: ["情绪记录", "AI 陪伴", "移动端", "设计中"],
      en: ["Mood tracking", "AI companion", "Mobile", "In progress"],
    },
    role: { zh: "产品设计师（主导）", en: "Product Designer (lead)" },
    team: { zh: "", en: "" },
    tools: { zh: "Figma", en: "Figma" },
    duration: { zh: "", en: "" },
    link: "",
    sections: [],
  },
  {
    slug: "shipped-game",
    hidden: true,
    year: "2026",
    cover: "/images/game-cover.jpg",
    coverTone: "light",
    gradient: "linear-gradient(135deg,#FF7A45 0%,#FFD645 100%)",
    glyph: "🦆",
    title: {
      zh: "游戏与互动设计",
      en: "Game & Interaction Design",
    },
    previewTitle: {
      zh: "互动游戏合集",
      en: "Interactive Game Collection",
    },
    category: { zh: "手游 / 小游戏 · 作品集合", en: "Mobile & Mini Games · Collection" },
    summary: {
      zh: "这里集中展示我参与过的手游和小游戏项目，重点呈现 UI、玩法数值优化、游戏链路完善和上线后的真实反馈。",
      en: "A collection of mobile and mini game projects, focused on UI, gameplay balancing, game flow refinement, and real post-launch feedback.",
    },
    previewSummary: {
      zh: "整理已上线和进行中的游戏项目，覆盖玩法体验、界面视觉与反馈节奏设计。",
      en: "A collection of shipped and in-progress game projects across gameplay UX, UI visuals, and feedback pacing.",
    },
    tags: {
      zh: ["游戏", "互动设计", "视觉", "已上线"],
      en: ["Game", "Interaction", "Visual", "Shipped"],
    },
    role: {
      zh: "UI 设计、玩法数值优化、游戏链路完善",
      en: "UI design, gameplay balancing, and game flow refinement",
    },
    team: { zh: "", en: "" },
    tools: { zh: "", en: "" },
    duration: { zh: "持续整理中", en: "Ongoing collection" },
    link: "",
    gameItems: [
      {
        theme: "dark",
        title: {
          zh: "鹅难财：从五道口到 CBD",
          en: "Goose Fortune: From Wudaokou to CBD",
        },
        subtitle: {
          zh: "一天内完成制作的经营小游戏",
          en: "A management mini game built in one day",
        },
        description: {
          zh: [
            "围绕网络热门话题“鹅腿阿姨”展开，用夸张剧情和快速反馈把玩家带入一轮轮经营选择。",
            "我主要负责 UI 设计、玩法数值优化和游戏链路完善，让关键路径、数值反馈、结算和继续游玩的动机在短时间内成立。",
          ],
          en: [
            "Built around the viral “goose leg auntie” topic, the game uses exaggerated story beats and fast feedback to pull players into repeated business choices.",
            "I mainly worked on UI design, gameplay balancing, and game flow refinement, making the key path, value feedback, result screen, and replay motivation work within a very short production window.",
          ],
        },
        role: {
          zh: "UI 设计、玩法数值优化、游戏链路完善",
          en: "UI design, gameplay balancing, and game flow refinement",
        },
        duration: { zh: "1 天完成制作", en: "Built in 1 day" },
        link: "http://enancai.starways.pro/",
        video: {
          src: "/videos/goose-fortune-gameplay.mp4",
          poster: "/videos/goose-fortune-gameplay-poster.jpg",
          title: {
            zh: "游戏录屏",
            en: "Gameplay Recording",
          },
          caption: {
            zh: "完整展示游戏从进入、操作到反馈的核心体验。",
            en: "A walkthrough of the core flow, from entering the game to interaction and feedback.",
          },
        },
        metrics: [
          {
            value: { zh: "4W", en: "40K" },
            label: { zh: "DAU", en: "DAU" },
            description: {
              zh: "上线两周内日活达到 4 万。",
              en: "Daily active users reached 40K within the first two weeks.",
            },
          },
          {
            value: { zh: "2 周", en: "2 weeks" },
            label: { zh: "上线观察期", en: "Launch window" },
            description: {
              zh: "用上线早期表现验证游戏传播与留存潜力。",
              en: "Early launch performance was used to validate reach and retention potential.",
            },
          },
          {
            value: { zh: "小红书", en: "RedNote" },
            label: { zh: "用户讨论", en: "User discussion" },
            description: {
              zh: "引发玩家发帖、评论和二创式讨论。",
              en: "Players posted comments, walkthroughs, and playful reactions.",
            },
          },
        ],
        socialProof: {
          eyebrow: { zh: "上线反馈", en: "Launch feedback" },
          heading: { zh: "小红书上的自发讨论", en: "Organic discussion on RedNote" },
          body: {
            zh: "上线后，玩家围绕关卡、剧情梗和角色素材发起讨论，不少评论反馈游戏有传播性和可玩性。",
            en: "After launch, players discussed levels, story jokes, and character assets, with comments showing that the game had shareability and replay appeal.",
          },
          images: [
        {
          src: "/images/cdn/xhs-search-discussion.5q84bnv5i9.webp",
          width: 852,
          height: 1636,
          alt: {
            zh: "小红书搜索页中的鹅难财相关讨论截图",
            en: "RedNote search results showing Goose Fortune discussions",
          },
        },
        {
          src: "/images/cdn/xhs-video-comments.7w7ixfmt9b.webp",
          width: 1400,
          height: 1078,
          alt: {
            zh: "小红书视频评论与互动数据截图",
            en: "RedNote video comments and engagement screenshot",
          },
        },
        {
          src: "/images/cdn/xhs-positive-feedback.4cll7mk3hf.webp",
          width: 1400,
          height: 1150,
          alt: {
            zh: "小红书玩家正向反馈截图",
            en: "RedNote positive player feedback screenshot",
          },
        },
        {
          src: "/images/cdn/xhs-fan-content.8vnmalpkfa.webp",
          width: 1400,
          height: 1074,
          alt: {
            zh: "小红书玩家二创与攻略讨论截图",
            en: "RedNote player-made content and discussion screenshot",
          },
        },
          ],
        },
      },
    ],
    sections: [],
  },
  {
    slug: "cyber-warfare",
    year: "2023",
    cover: "/images/cdn/cyber-warfare-cover.3629z0hvd4.webp",
    gradient: "linear-gradient(135deg,#0A2E4D 0%,#00FF88 50%,#0A2E4D 100%)",
    glyph: "🃏",
    title: {
      zh: "CYBER WARFARE",
      en: "CYBER WARFARE",
    },
    previewTitle: {
      zh: "卡牌系统设计",
      en: "Card Game System Design",
    },
    category: { zh: "卡牌设计 · 网络安全主题", en: "Card Game · Cybersecurity Theme" },
    summary: {
      zh: "信息泄露无处不在，我们希望通过游戏卡牌的形式，让玩家快速理解隐私泄露的危害，在生活中保持警惕。",
      en: "A card game that raises awareness of information leakage and personal privacy through play.",
    },
    tags: {
      zh: ["卡牌", "插画", "视觉设计", "网络安全"],
      en: ["Card Game", "Illustration", "Visual Design", "Cybersecurity"],
    },
    role: {
      zh: "视觉设计师、游戏逻辑整理、规则制定",
      en: "Visual Designer, Game Logic Organizer, Rule Designer",
    },
    team: { zh: "4 人", en: "4 people" },
    tools: { zh: "Figma、Illustrator、Photoshop", en: "Figma, Illustrator, Photoshop" },
    duration: { zh: "2~3 周", en: "2-3 weeks" },
    link: "",
    introImages: [
      "/images/cdn/cyber-news-1.2yz23l211z.webp",
      "/images/cdn/cyber-news-2.2vfg5v8yc5.webp",
      "/images/cdn/cyber-news-3.7w7ixffsuv.webp",
      "/images/cdn/cyber-news-4.2dpeha7kra.webp",
      "/images/cdn/cyber-news-5.8dxkm0h6fn.webp",
    ],
    introQuote: {
      zh: "无论我们做什么，似乎总有人在窥探我们的生活。信息泄露已成为不可回避的现实——尤其在互联网时代，大数据催生了海量信息。",
      en: "No matter what we do, it seems someone is always watching. Information leakage is an inevitable reality — especially in the age of the Internet and big data.",
    },
    gameRules: {
      eyebrow: { zh: "HOW TO PLAY", en: "HOW TO PLAY" },
      heading: { zh: "游戏规则", en: "Game rules" },
      introduction: {
        zh: "玩家分别扮演网民、公司与黑客，在信息提交、窃取、举报与防御中形成相互制衡。不同身份拥有各自的能力与胜利条件。",
        en: "Players take the roles of users, companies, and hackers. Information submission, theft, reporting, and defense create a system of checks and balances, with distinct abilities and winning conditions for each role.",
      },
    },
    sections: [],
  },
  {
    slug: "event-visual",
    year: "Various",
    cover: "/images/event-visual-triptych.jpg",
    gradient: "linear-gradient(135deg,#0E3B8C 0%,#1B5FBD 100%)",
    glyph: "📣",
    title: {
      zh: "运营视觉",
      en: "Operational Visuals",
    },
    category: { zh: "运营视觉 · 海报合集", en: "Operational Visuals · Poster Collection" },
    summary: {
      zh: "整理我做过的海报项目，以及对应的周边物料与展示图。",
      en: "A collection of poster projects, along with related merchandise and display visuals.",
    },
    tags: {
      zh: ["海报合集", "平面", "物料", "展示"],
      en: ["Poster", "Graphic", "Assets", "Display"],
    },
    role: { zh: "视觉设计师", en: "Visual Designer" },
    team: { zh: "个人完成", en: "Solo project" },
    tools: { zh: "Figma、Photoshop、Illustrator", en: "Figma, Photoshop, Illustrator" },
    duration: { zh: "持续整理中", en: "Ongoing" },
    link: "",
    gallery: [
      "/images/cdn/cover.7w7ixgeh8m.webp",
      "/images/cdn/frame-8.70b1i04ssk.webp",
      "/images/cdn/frame-6.8l0shh2093.webp",
      "/images/cdn/frame-7.99u21hpj9g.webp",
      "/images/cdn/rectangle-5.2ksmcqsekj.webp",
      "/images/cdn/rectangle-6.8adyobms3c.webp",
      "/images/cdn/rectangle-7.5j4wg90o1h.webp",
      "/images/cdn/rectangle-2.5xbc748ywp.webp",
      "/images/cdn/rectangle-3.2rvu86ejzv.webp",
    ],
    sections: [],
  },
];

/** 对外可见的项目列表（hidden 的不进列表、详情页与上下篇导航） */
export const projects: Project[] = allProjects.filter((p) => !p.hidden);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacent(slug: string): { prev: Project; next: Project } {
  const i = projects.findIndex((p) => p.slug === slug);
  const len = projects.length;
  return {
    prev: projects[(i - 1 + len) % len],
    next: projects[(i + 1) % len],
  };
}
