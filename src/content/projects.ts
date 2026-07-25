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
export const projects: Project[] = [
  {
    slug: "shipped-app",
    year: "2025 — Present",
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
    team: { zh: "TODO：如 1 设计 + 2 开发 + 1 PM", en: "TODO: e.g. 1 design, 2 dev, 1 PM" },
    tools: { zh: "Figma、Principle", en: "Figma, Principle" },
    duration: { zh: "TODO：如 3 个月", en: "TODO: e.g. 3 months" },
    link: "", // TODO: App Store / 官网链接
    sections: [
      {
        heading: { zh: "背景与挑战", en: "Background & challenge" },
        body: {
          zh: [
            "TODO：这个产品要解决什么问题？目标用户是谁？当时面临的核心挑战是什么？",
            "用一两段把背景讲清楚，让没有上下文的人也能看懂。",
          ],
          en: [
            "TODO: What problem does this product solve? Who is it for? What was the core challenge?",
            "Set the context in a paragraph or two so anyone can follow.",
          ],
        },
      },
      {
        heading: { zh: "设计过程", en: "Design process" },
        body: {
          zh: [
            "TODO：你做了哪些调研 / 梳理了哪些流程？画了哪些线框、尝试了哪些方案？",
            "重点写你的思考和取舍——为什么这样做、放弃了什么。（这里可以插过程图）",
          ],
          en: [
            "TODO: What research / flows did you map? What wireframes and directions did you try?",
            "Focus on your thinking and trade-offs — why this, what you dropped. (Add process images here.)",
          ],
        },
      },
      {
        heading: { zh: "最终方案", en: "Final solution" },
        body: {
          zh: ["TODO：最终上线的方案长什么样？关键界面和交互亮点。（这里放成品图）"],
          en: ["TODO: What shipped? Key screens and interaction highlights. (Add final visuals here.)"],
        },
      },
      {
        heading: { zh: "成果", en: "Outcome" },
        body: {
          zh: ["TODO：上线后的数据 / 反馈 / 你学到了什么。有数字尽量放数字。"],
          en: ["TODO: Post-launch metrics / feedback / what you learned. Use numbers if you have them."],
        },
      },
    ],
  },
  {
    slug: "shipped-game",
    year: "2026",
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
          src: "https://github.com/gaogao0805/picx-images-hosting/raw/master/xhs-search-discussion.5q84bnv5i9.webp",
          width: 852,
          height: 1636,
          alt: {
            zh: "小红书搜索页中的鹅难财相关讨论截图",
            en: "RedNote search results showing Goose Fortune discussions",
          },
        },
        {
          src: "https://github.com/gaogao0805/picx-images-hosting/raw/master/xhs-video-comments.7w7ixfmt9b.webp",
          width: 1400,
          height: 1078,
          alt: {
            zh: "小红书视频评论与互动数据截图",
            en: "RedNote video comments and engagement screenshot",
          },
        },
        {
          src: "https://github.com/gaogao0805/picx-images-hosting/raw/master/xhs-positive-feedback.4cll7mk3hf.webp",
          width: 1400,
          height: 1150,
          alt: {
            zh: "小红书玩家正向反馈截图",
            en: "RedNote positive player feedback screenshot",
          },
        },
        {
          src: "https://github.com/gaogao0805/picx-images-hosting/raw/master/xhs-fan-content.8vnmalpkfa.webp",
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
      {
        theme: "light",
        title: {
          zh: "高考志愿模拟器",
          en: "College Application Simulator",
        },
        subtitle: {
          zh: "志愿填报主题手游项目，占位整理中",
          en: "A mobile game about college application choices, placeholder in progress",
        },
        description: {
          zh: [
            "一个围绕高考志愿选择展开的模拟器项目，后续会补充具体玩法、录屏和上线表现。",
            "这个案例会用于展示我在手游链路、选择反馈、信息层级和数值体验上的设计整理。",
          ],
          en: [
            "A simulator project built around college application choices. Gameplay details, recordings, and launch performance will be added later.",
            "This case will document my work on mobile game flow, choice feedback, information hierarchy, and value tuning.",
          ],
        },
        role: {
          zh: "UI 设计、游戏链路梳理、反馈体验优化",
          en: "UI design, game flow mapping, and feedback UX optimization",
        },
        duration: { zh: "整理中", en: "In progress" },
      },
    ],
    sections: [],
  },
  {
    slug: "cyber-warfare",
    year: "2023",
    cover: "https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-warfare-cover.3629z0hvd4.webp",
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
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-news-1.2yz23l211z.webp",
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-news-2.2vfg5v8yc5.webp",
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-news-3.7w7ixffsuv.webp",
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-news-4.2dpeha7kra.webp",
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-news-5.8dxkm0h6fn.webp",
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
    year: "2026",
    gradient: "linear-gradient(135deg,#FF4D6A 0%,#FF9A44 100%)",
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
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/cover.7w7ixgeh8m.webp",
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/frame-8.70b1i04ssk.webp",
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/frame-6.8l0shh2093.webp",
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/frame-7.99u21hpj9g.webp",
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/rectangle-5.2ksmcqsekj.webp",
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/rectangle-6.8adyobms3c.webp",
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/rectangle-7.5j4wg90o1h.webp",
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/rectangle-2.5xbc748ywp.webp",
      "https://github.com/gaogao0805/picx-images-hosting/raw/master/rectangle-3.2rvu86ejzv.webp",
    ],
    sections: [],
  },
];

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
