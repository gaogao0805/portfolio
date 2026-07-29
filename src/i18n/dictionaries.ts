import type { Locale } from "./config";

/**
 * 站点全部 UI 文案（中 / 英）。
 * 作品的正文内容在 src/content/projects.ts 里单独维护。
 * 想改文字 → 直接改这里对应的 zh / en 字段即可。
 */
const dictionaries = {
  zh: {
    meta: {
      title: "Zoey · 产品设计师",
      description:
        "一名专注 AI 产品与移动端体验的设计师作品集 —— 涵盖 App、游戏、视觉设计。",
    },
    nav: {
      home: "首页",
      work: "作品",
      about: "关于",
      contact: "联系",
      langLabel: "EN",
    },
    home: {
      // 首屏
      kicker: "AI 产品设计师 / UI · UX",
      heroGreeting: "我是 Zoey",
      heroTagline: "设计能用、好用、有人用的产品",
      heroTaglineEm: "能用、好用、有人用",
      intro:
        "一名拥有约一年经验的 AI 产品设计师，专注移动端体验——从 0 到 1 把想法做成真正上线、有人在用的产品。",
      introShort:
        "一名拥有约一年经验的 AI 产品设计师——从 0 到 1 把想法做成有人在用的产品。",
      ctaWork: "看我的作品",
      ctaContact: "聊一聊",
      ctaResume: "看简历",
      scroll: "向下滚动",
      // 精选作品
      featuredKicker: "精选作品",
      featuredTitle: "已落地的项目",
      featuredMore: "查看全部作品",
      // 关于简版
      aboutKicker: "关于我",
      aboutTitle: "不止是把界面画好看",
      aboutBody:
        "我相信好的设计要经得起真实用户的使用。比起堆砌视觉，我更在意它是否解决了问题、是否真的被用起来。",
      aboutLink: "了解更多",
    },
    work: {
      kicker: "作品",
      title: "项目精选",
      titleEm: "精选",
      subtitle: "从 AI 产品到视觉设计与游戏卡牌，这些是我参与的项目。",
      viewProject: "查看项目",
    },
    project: {
      backToWork: "返回作品",
      role: "我的职责",
      team: "团队",
      tools: "工具",
      duration: "周期",
      year: "年份",
      next: "下一个项目",
      prev: "上一个项目",
      visit: "访问 / 体验",
    },
    about: {
      kicker: "关于我",
      title: "你好，我是 Zoey",
      role: "AI 产品设计师",
      lead: "一名有创造力、善用 AI 工具的 AI 产品设计师，专注把 AI 的能力落到真实、好用的产品体验里。",
      preferredTitle: "期望城市",
      preferred: ["北京", "上海", "杭州", "广州", "深圳"],
      bio: [
        "我能独立把全部设计内容转化成代码形式交付，也清楚 LLM 的能力与边界——所以用 AI 做东西时上手快、协作顺、落地稳。",
        "创造力强、效率高，传统设计与剪辑工具也都能即刻上手。",
      ],
      highlightsTitle: "我的优势",
      highlights: [
        {
          title: "AI 产品设计专长",
          desc: "AI 初创 0→1 完整产品设计经验，深度参与 LLM 应用落地——对话式交互、Memory 系统、AI 体验优化。",
        },
        {
          title: "独立全流程",
          desc: "作为团队唯一设计师，独立完成调研、交互、UI、设计系统到研发跟进，并能把设计转成代码交付。",
        },
        {
          title: "系统化思维",
          desc: "熟悉 Memory 分类存储、双边推荐与设计的协同，用设计构建用户画像、驱动业务闭环。",
        },
        {
          title: "快速迭代 × 协作",
          desc: "适应快节奏，与研发 / 产品紧密协作，输出规范的设计文档与组件库，提升效率。",
        },
      ],
      workTitle: "工作经历",
      work: [
        {
          company: "银河驿站",
          role: "AI 产品设计师",
          period: "2025.11 — 至今",
          summary: "主导求职类 AI 应用「就绪」的产品设计——一款与 AI 强相关的求职 App。",
          points: [
            "主导 App 从 0 到 1 全流程设计：用户调研、交互、UI、设计系统到研发对接。",
            "设计 Chat 功能与 Memory 分类存储体系——构建偏好 / 能力 / 行为 / 反馈四类数据，驱动双边推荐，实现对话式职位匹配与简历优化。",
            "针对 AI 运行的不确定性，设计加载状态、降级方案与预期管理机制，提升稳定性与体验。",
            "从 0 到 1 搭建组件库与设计规范（基础 + 业务组件），支撑快速迭代、显著提升研发效率。",
          ],
        },
        {
          company: "会稽山绍兴酒股份有限公司",
          role: "产品实习生",
          period: "2025.10 — 2025.12",
          summary: "参与会稽山 ToC 用户数字化体验重塑，负责子品牌视觉与品牌内容营销。",
          points: [
            "全链路体验重塑：落地五码合一数字化体系，打通线上线下渠道，完成子品牌爽酒系列海报视觉与宣传物料制作。",
            "品牌内容年轻化：主导制作品牌推广短视频，丰富线上传播矩阵，将单次消费转化为长期内容互动。",
            "私域商业闭环：依托五码合一扫码营销体系落地扫码互动活动，沉淀私域流量、激活会员复购，完成数字化营销与用户运营闭环。",
          ],
        },
        {
          company: "AD Studio",
          role: "交互设计实习生",
          period: "2023.07 — 2023.10",
          summary: "面向社区居民 C 端轻医疗服务场景的交互设计，主攻适老化体验。",
          points: [
            "需求与竞品研究：调研患者需求并开展竞品分析，提炼交互模式，明确产品设计改进方向。",
            "设计体系搭建：推进适老化「关怀模式」设计，通过放大字体、强化色彩对比、简化操作路径适配老年核心用户。",
            "体验测试迭代：协助组织可用性测试，收集社区居民真实反馈，持续优化操作路径，提升交互效率与老年群体满意度。",
          ],
        },
        {
          company: "触答设计顾问有限公司",
          role: "产品设计实习生",
          period: "2022.08 — 2022.11",
          summary: "汕头妈屿岛户外遮阳设备智能租赁的软硬件产品设计。",
          points: [
            "实地调研分析：开展游客深度访谈，完成用户旅程梳理与可视化，挖掘滨海场景户外遮阳设备租赁真实需求。",
            "软硬件方案设计：自主设计便携式遮阳硬件，搭建配套 App 智能租赁流程与产品原型，推动项目与汕头工业城达成深度合作。",
            "方案落地优化：识别服务核心痛点，迭代整套租赁解决方案，助力项目落地试运行。",
          ],
        },
      ],
      projTitle: "项目经历",
      projects: [
        {
          company: "Lloyds Bank",
          role: "保险数字化服务",
          period: "2025.02 — 2025.05",
          summary: "围绕职场女性生育与职场权益保障的保险数字化服务设计。",
          points: [
            "需求链路梳理：挖掘职场女性生育、职场权益保障痛点，产出服务蓝图、用户旅程图，完整梳理保险全业务链路。",
            "双端体验优化：搭建官网与 App 信息架构，优化核心展示页面，将金融保障可视化呈现。",
          ],
        },
        {
          company: "Generations Working Together (GWT)",
          role: "特殊家庭服务",
          period: "2025.03 — 2025.10",
          summary: "以服务设计打通特殊家庭的代际沟通。",
          points: [
            "用户需求挖掘：联合机构开展深度用户调研，精准捕捉特殊人群代际沟通缺失痛点，完成创新项目立项规划。",
            "媒介产品创新：依托服务设计思维独立开发互动桌游，打造轻量化、高适配性的工具型社交载体，打通代际交流壁垒。",
            "模式落地验证：统筹运营 6 场标准化线下活动，规模化投放自研产品，完成创新服务模式的市场可行性验证。",
          ],
        },
      ],
      eduTitle: "教育经历",
      education: [
        {
          school: "格拉斯哥大学 · 格拉斯哥艺术学院",
          degree: "设计创新与服务设计 · 硕士",
          period: "2024.09 — 2025.09",
        },
        {
          school: "汕头大学",
          degree: "数字媒体艺术 · 本科",
          period: "2020.10 — 2024.06",
        },
      ],
      skillsTitle: "技能",
      skills: [
        { label: "服务设计", desc: "硕士主修。服务蓝图、用户旅程打底——Lloyds 保险链路与 GWT 代际桌游都是这套方法。" },
        { label: "AI 产品设计", desc: "「就绪」App 从 0 到 1：对话式职位匹配 + Memory 系统的产品化。" },
        { label: "对话式交互", desc: "Chat 式求职匹配的设计，外加 AI 不确定性下的加载、降级与预期管理。" },
        { label: "Memory 系统设计", desc: "偏好 / 能力 / 行为 / 反馈四类记忆数据，驱动双边推荐。" },
        { label: "设计转代码", desc: "设计直接交付成可运行的前端——这个网站就是这么写的。" },
        { label: "用户体验 (UX)", desc: "从调研、旅程梳理到可用性测试的完整链路。" },
        { label: "界面设计 (UI)", desc: "以移动端为主，能从零搭组件库与设计规范。" },
        { label: "交互设计 / 原型", desc: "适老化「关怀模式」、智能租赁 App 流程原型都出自这里。" },
        { label: "设计系统", desc: "「就绪」的基础 + 业务组件库，撑起快速迭代。" },
        { label: "用户研究", desc: "深度访谈、竞品分析、田野调查——妈屿岛晒出来的那种。" },
        { label: "Vibe Coding", desc: "和 Claude Code / Codex 结对，把想法快速做成真东西。" },
        { label: "TouchDesigner", desc: "艺术编程，玩生成视觉与互动装置。" },
        { label: "3D 建模", desc: "便携遮阳硬件这类产品造型与空间可视化。" },
        { label: "平面设计", desc: "海报与品牌物料，比如会稽山爽酒系列。" },
      ],
      toolsTitle: "工具",
      toolGroups: [
        {
          label: "AI",
          items: [
            { label: "Claude Code", desc: "日常主力。这个站一大半是它陪我写的。" },
            { label: "Codex", desc: "Vibe Coding 双保险，和 Claude Code 互补着用。" },
            { label: "ChatGPT", desc: "调研梳理、文案润色、脑暴搭子。" },
          ],
        },
        {
          label: "设计 / 剪辑",
          items: [
            { label: "Figma", desc: "界面、组件库、原型的主战场。" },
            { label: "Photoshop", desc: "海报修图与视觉物料。" },
            { label: "Illustrator", desc: "矢量图形与品牌元素。" },
            { label: "Premiere", desc: "品牌短视频剪辑，会稽山那波就是它。" },
            { label: "After Effects", desc: "动效 demo 和视觉小动画。" },
          ],
        },
      ],
      viewDetails: "查看详情",
    },
    contact: {
      kicker: "联系",
      title: "一起做点东西",
      lead: "无论是工作机会、项目合作还是单纯交流，都欢迎找我。",
      callTitle: "打给我",
      emailTitle: "发邮件",
      copy: "复制",
      copied: "已复制",
      socialTitle: "在别处找到我",
    },
    footer: {
      tagline: "用设计解决真实问题。",
      built: "本站由本人设计与开发。",
      rights: "保留所有权利。",
    },
  },

  en: {
    meta: {
      title: "Zoey · Product Designer",
      description:
        "Portfolio of an AI-focused product designer — apps, games, and visual design.",
    },
    nav: {
      home: "Home",
      work: "Work",
      about: "About",
      contact: "Contact",
      langLabel: "中",
    },
    home: {
      kicker: "AI Product Designer / UI · UX",
      heroGreeting: "I'm Zoey",
      heroTagline: "Designing products that are usable, lovable, and actually used.",
      heroTaglineEm: "usable, lovable, and actually used",
      intro:
        "An AI product designer with around a year of experience, focused on mobile experiences — turning ideas into products that ship and get used.",
      introShort:
        "An AI product designer with around a year of experience — turning ideas into products people use.",
      ctaWork: "View my work",
      ctaContact: "Say hello",
      ctaResume: "Resume",
      scroll: "Scroll",
      featuredKicker: "Selected work",
      featuredTitle: "Things I've shipped",
      featuredMore: "View all work",
      aboutKicker: "About",
      aboutTitle: "More than making screens look good",
      aboutBody:
        "I believe good design has to hold up in real users' hands. Beyond visuals, I care whether it solves the problem and actually gets used.",
      aboutLink: "Learn more",
    },
    work: {
      kicker: "Work",
      title: "Selected projects",
      titleEm: "projects",
      subtitle:
        "From AI products to visual design and game cards — here's what I've worked on.",
      viewProject: "View project",
    },
    project: {
      backToWork: "Back to work",
      role: "My role",
      team: "Team",
      tools: "Tools",
      duration: "Duration",
      year: "Year",
      next: "Next project",
      prev: "Previous project",
      visit: "Visit / try it",
    },
    about: {
      kicker: "About",
      title: "Hi, I'm Zoey",
      role: "AI Product Designer",
      lead: "A creative AI product designer who builds with AI tools — focused on turning AI capabilities into real, usable product experiences.",
      preferredTitle: "Open to",
      preferred: ["Beijing", "Shanghai", "Hangzhou", "Guangzhou", "Shenzhen"],
      bio: [
        "I can independently turn all of my design into shippable code, and I'm clear on what LLMs can and can't do — so building with AI is fast, smooth, and reliable.",
        "Strong creativity, high efficiency, and quick to pick up traditional design and video tools too.",
      ],
      highlightsTitle: "Strengths",
      highlights: [
        {
          title: "AI product design",
          desc: "Full 0→1 design at an AI startup; hands-on LLM delivery — conversational UX, memory systems, AI experience optimization.",
        },
        {
          title: "End-to-end, solo",
          desc: "Sole designer: research, interaction, UI, design system, dev follow-through — and delivering design as code.",
        },
        {
          title: "Systems thinking",
          desc: "Memory storage and two-sided recommendation × design — building user profiles and closing the business loop.",
        },
        {
          title: "Fast & collaborative",
          desc: "Thrives in fast-paced teams; clean design docs and component libraries that boost efficiency.",
        },
      ],
      workTitle: "Experience",
      work: [
        {
          company: "Galaxy Station",
          role: "AI Product Designer",
          period: "2025.11 — Present",
          summary: "Leading product design for “Ready” (就绪), an AI-driven job-search app.",
          points: [
            "Drove the app's 0→1 design end-to-end: user research, interaction, UI, design system, and dev hand-off.",
            "Designed the Chat feature and a categorized Memory system — preference / ability / behavior / feedback data driving two-sided recommendation for conversational job matching and résumé optimization.",
            "Built loading states, graceful fallbacks, and expectation management for AI's run-time uncertainty — improving stability and UX.",
            "Set up the component library and design standards from scratch (base + business components), enabling fast iteration and boosting dev efficiency.",
          ],
        },
        {
          company: "Kuaijishan Shaoxing Wine Co., Ltd.",
          role: "Product Intern",
          period: "2025.10 — 2025.12",
          summary: "Reshaped Kuaijishan's D2C digital experience; owned sub-brand visuals and brand content marketing.",
          points: [
            "End-to-end experience redesign: implemented the “Five Codes in One” digital system connecting online and offline channels; delivered poster visuals and promotional materials for the “Shuangjiu” sub-brand series.",
            "Brand rejuvenation: led production of brand promotional short videos, enriching the online content matrix and turning one-off purchases into long-term content engagement.",
            "Private-domain business loop: launched scan-to-interact campaigns on the “Five Codes in One” marketing system, converting private-domain traffic and reactivating member repurchase.",
          ],
        },
        {
          company: "AD Studio",
          role: "Interaction Design Intern",
          period: "2023.07 — 2023.10",
          summary: "Interaction design for a community-facing light-healthcare service, focused on age-friendly experiences.",
          points: [
            "Requirements & competitive research: investigated patient needs, ran competitive analysis, and distilled interaction patterns to define product improvement directions.",
            "Design system: drove the age-friendly “Care Mode” design — larger typography, stronger color contrast, and simplified flows for elderly core users.",
            "Testing & iteration: helped organize usability tests with community residents and continuously optimized user flows, improving interaction efficiency and elderly user satisfaction.",
          ],
        },
        {
          company: "Chuda Design Consulting Co., Ltd.",
          role: "Product Design Intern",
          period: "2022.08 — 2022.11",
          summary: "Hardware + software product design for a smart sunshade rental service on Mayu Island, Shantou.",
          points: [
            "Field research: conducted in-depth tourist interviews and visualized user journeys, uncovering real demand for outdoor sunshade equipment rental in coastal scenarios.",
            "Hardware + software solution: independently designed a portable sunshade product and the companion app's smart rental flow, leading to a deep partnership with Shantou Industrial City.",
            "Landing & iteration: identified core service pain points, iterated the full rental solution, and supported the project's trial launch.",
          ],
        },
      ],
      projTitle: "Projects",
      projects: [
        {
          company: "Lloyds Bank",
          role: "Insurance Digital Service",
          period: "2025.02 — 2025.05",
          summary: "Digital insurance service design around maternity and workplace rights protection for working women.",
          points: [
            "Mapping the service chain: uncovered pain points of working women around maternity and workplace rights; produced service blueprints and user journey maps covering the full insurance business chain.",
            "Web + app optimization: built the information architecture for the official website and app, refined key pages, and visualized financial protection.",
          ],
        },
        {
          company: "Generations Working Together (GWT)",
          role: "Services for Special-Needs Families",
          period: "2025.03 — 2025.10",
          summary: "Service design bridging intergenerational communication in special-needs families.",
          points: [
            "User research: partnered with the organization on in-depth research, pinpointing the intergenerational communication gap and completing the full innovation project planning.",
            "Medium innovation: independently developed an interactive board game — a lightweight, highly adaptable social tool bridging generational barriers.",
            "Validation: organized 6 standardized offline events with the self-developed product deployed at scale, validating the service model's market feasibility.",
          ],
        },
      ],
      eduTitle: "Education",
      education: [
        {
          school: "University of Glasgow · Glasgow School of Art",
          degree: "MSc Design Innovation and Service Design",
          period: "2024.09 — 2025.09",
        },
        {
          school: "Shantou University",
          degree: "BA Digital Media Art",
          period: "2020.10 — 2024.06",
        },
      ],
      skillsTitle: "Skills",
      skills: [
        { label: "Service Design", desc: "Master's focus. Blueprints & journey maps — the Lloyds insurance flow and the GWT board game ran on this." },
        { label: "AI Product Design", desc: "Took the “Ready” app 0→1: conversational job matching + a production Memory system." },
        { label: "Conversational UX", desc: "Chat-based job matching, plus loading, fallbacks and expectation design for AI uncertainty." },
        { label: "Memory Systems", desc: "Preference / ability / behavior / feedback memories driving two-sided recommendation." },
        { label: "Design-to-Code", desc: "Designs ship as working front-end — this site was built exactly that way." },
        { label: "UX", desc: "The full loop: research, journey mapping, usability testing." },
        { label: "UI", desc: "Mobile-first; component libraries and design standards from scratch." },
        { label: "Interaction / Prototyping", desc: "The age-friendly “Care Mode” and the smart-rental app flow started here." },
        { label: "Design Systems", desc: "Ready's base + business component library, built for fast iteration." },
        { label: "User Research", desc: "In-depth interviews, competitive analysis, fieldwork — the Mayu Island kind." },
        { label: "Vibe Coding", desc: "Pairing with Claude Code / Codex to make ideas real, fast." },
        { label: "TouchDesigner", desc: "Creative coding for generative visuals and interactive installations." },
        { label: "3D Modeling", desc: "Product forms like the portable sunshade, plus spatial visualization." },
        { label: "Graphic Design", desc: "Posters and brand collateral, e.g. the Kuaijishan Shuangjiu series." },
      ],
      toolsTitle: "Tools",
      toolGroups: [
        {
          label: "AI",
          items: [
            { label: "Claude Code", desc: "Daily driver — most of this site was pair-written with it." },
            { label: "Codex", desc: "The other half of my vibe-coding duo." },
            { label: "ChatGPT", desc: "Research wrangling, copy polish, brainstorm buddy." },
          ],
        },
        {
          label: "Design / Video",
          items: [
            { label: "Figma", desc: "Home turf for UI, component libraries and prototypes." },
            { label: "Photoshop", desc: "Poster retouching and visual collateral." },
            { label: "Illustrator", desc: "Vector graphics and brand elements." },
            { label: "Premiere", desc: "Brand short-video cuts — the Kuaijishan series." },
            { label: "After Effects", desc: "Motion demos and visual loops." },
          ],
        },
      ],
      viewDetails: "View details",
    },
    contact: {
      kicker: "Contact",
      title: "Let's build something",
      lead: "Open to opportunities, collaborations, or just a chat.",
      callTitle: "Call me",
      emailTitle: "Email me",
      copy: "Copy",
      copied: "Copied",
      socialTitle: "Find me elsewhere",
    },
    footer: {
      tagline: "Designing solutions to real problems.",
      built: "Designed & built by me.",
      rights: "All rights reserved.",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
