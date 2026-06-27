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
      heroTagline: "设计能被用起来的产品",
      intro:
        "一名拥有约一年经验的 AI 产品设计师，专注移动端体验——从 0 到 1 把想法做成真正上线、有人在用的产品。",
      ctaWork: "看我的作品",
      ctaContact: "聊一聊",
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
      lead: "一名有创造力、善用 AI 工具的 AI 产品设计师。",
      preferredTitle: "期望城市",
      preferred: ["北京", "上海", "杭州", "广州", "深圳"],
      bio: [
        "我是一名 AI 产品设计师，专注把 AI 的能力落到真实、好用的产品体验里。",
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
      ],
      eduTitle: "教育经历",
      education: [
        {
          school: "格拉斯哥大学 · 格拉斯哥艺术学院",
          degree: "服务设计 · 硕士",
          period: "2024.09 — 2025.09",
        },
        {
          school: "汕头大学",
          degree: "数字媒体艺术 · 本科",
          period: "2020.10 — 2024.07",
        },
      ],
      skillsTitle: "技能",
      skills: [
        "服务设计",
        "AI 产品设计",
        "对话式交互",
        "Memory 系统设计",
        "设计转代码",
        "用户体验 (UX)",
        "界面设计 (UI)",
        "交互设计 / 原型",
        "设计系统",
        "用户研究",
      ],
      toolsTitle: "工具",
      toolGroups: [
        { label: "AI", items: ["Claude Code", "Codex", "ChatGPT"] },
        {
          label: "设计 / 剪辑",
          items: ["Figma", "Photoshop", "Illustrator", "Premiere", "After Effects"],
        },
      ],
      viewDetails: "查看详情",
      resume: "下载简历 (PDF)",
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
      heroTagline: "Designing products people actually use.",
      intro:
        "An AI product designer with around a year of experience, focused on mobile experiences — turning ideas into products that ship and get used.",
      ctaWork: "View my work",
      ctaContact: "Say hello",
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
      lead: "A creative AI product designer who builds with AI tools.",
      preferredTitle: "Open to",
      preferred: ["Beijing", "Shanghai", "Hangzhou", "Guangzhou", "Shenzhen"],
      bio: [
        "I'm an AI product designer, focused on turning AI capabilities into real, usable product experiences.",
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
      ],
      eduTitle: "Education",
      education: [
        {
          school: "University of Glasgow · Glasgow School of Art",
          degree: "MSc Service Design",
          period: "2024.09 — 2025.09",
        },
        {
          school: "Shantou University",
          degree: "BA Digital Media Art",
          period: "2020.10 — 2024.07",
        },
      ],
      skillsTitle: "Skills",
      skills: [
        "Service Design",
        "AI Product Design",
        "Conversational UX",
        "Memory Systems",
        "Design-to-Code",
        "UX",
        "UI",
        "Interaction / Prototyping",
        "Design Systems",
        "User Research",
      ],
      toolsTitle: "Tools",
      toolGroups: [
        { label: "AI", items: ["Claude Code", "Codex", "ChatGPT"] },
        {
          label: "Design / Video",
          items: ["Figma", "Photoshop", "Illustrator", "Premiere", "After Effects"],
        },
      ],
      viewDetails: "View details",
      resume: "Download résumé (PDF)",
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
