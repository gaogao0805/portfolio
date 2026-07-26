/**
 * 「就绪」App 经纪人数据，供转盘复刻与对话复刻共享。
 * 文案与素材地址来自 frontend-app-demo/src/constants/agentsData.ts。
 */

export type AgentSide = "c" | "b";

export type Agent = {
  key: string;
  /** c = C 端求职经纪人，b = B 端招聘经纪人 */
  side: AgentSide;
  name: string;
  nickName: string;
  slogan: string;
  tags: [string, string];
  /** 顶部背景渐变的起始色（不透明），透明端用字符串替换得到 */
  tint: string;
  circleGradient: [string, string];
  bigImage: string;
  avatar: { selected: string; unselected: string };
  colors: { primary: string; tagBorder: string; tagText: string };
  /** 中饱和强调色（状态行文字等需要色相清晰的位置用） */
  accent: string;
};

export const AGENTS: Agent[] = [
  {
    key: "shennan",
    side: "c",
    name: "沈楠",
    nickName: "沉稳姐姐",
    slogan: "职场如棋局，每一步都需深思熟虑。我们用行动定义下一步。",
    tags: ["长期主义", "温柔坚定"],
    tint: "rgba(206, 244, 247, 1)",
    circleGradient: ["rgba(206, 244, 247, 1)", "rgba(206, 244, 247, 0)"],
    bigImage: "https://static.go2ready.com/app/asset/agent-select/v3/shennan.png",
    avatar: {
      selected: "https://static.go2ready.com/app/asset/agent-select/v2/shennanSelected.png",
      unselected: "https://static.go2ready.com/app/asset/agent-select/v2/shennanUnselected.png",
    },
    colors: {
      primary: "rgba(186, 230, 234, 1)",
      tagBorder: "rgba(233, 255, 253, 1)",
      tagText: "rgba(21, 61, 72, 1)",
    },
    accent: "#2F8A94",
  },
  {
    key: "xiaxiaoye",
    side: "c",
    name: "夏小野",
    nickName: "小太阳",
    slogan: "嘿！不需要在迷雾里独自摸索，有我在，放心出发吧！",
    tags: ["热情靠谱", "一秒共情"],
    tint: "rgba(222, 247, 206, 1)",
    circleGradient: ["rgba(222, 247, 206, 1)", "rgba(222, 247, 206, 0)"],
    bigImage: "https://static.go2ready.com/app/asset/agent-select/v3/xiaxiaoye.png",
    avatar: {
      selected: "https://static.go2ready.com/app/asset/agent-select/v2/xiaxiaoyeSelected.png",
      unselected: "https://static.go2ready.com/app/asset/agent-select/v2/xiaxiaoyeUnselected.png",
    },
    colors: {
      primary: "rgba(202, 239, 177, 1)",
      tagBorder: "rgba(241, 255, 232, 1)",
      tagText: "rgba(21, 72, 40, 1)",
    },
    accent: "#3E8B50",
  },
  {
    key: "zhangmingming",
    side: "c",
    name: "张明明",
    nickName: "Nerd小哥",
    slogan: "帮你拨开表象的迷雾，抓住事情最核心的逻辑。",
    tags: ["慢热理工脑", "问题拆解"],
    tint: "rgba(222, 228, 254, 1)",
    circleGradient: ["rgba(222, 228, 254, 1)", "rgba(222, 228, 254, 0)"],
    bigImage: "https://static.go2ready.com/app/asset/agent-select/v3/zhangmingming.png",
    avatar: {
      selected: "https://static.go2ready.com/app/asset/agent-select/v2/zhangmingmingSelected.png",
      unselected: "https://static.go2ready.com/app/asset/agent-select/v2/zhangmingmingUnselected.png",
    },
    colors: {
      primary: "rgba(203, 211, 252, 1)",
      tagBorder: "rgba(234, 240, 255, 1)",
      tagText: "rgba(38, 21, 72, 1)",
    },
    accent: "#5B4FC4",
  },
  {
    key: "xunyuan",
    side: "c",
    name: "寻远",
    nickName: "霸道总裁",
    slogan: "我们一起，找到那条专属于你的最优轨迹。",
    tags: ["护你到底", "我来处理"],
    tint: "rgba(255, 245, 203, 1)",
    circleGradient: ["rgba(255, 245, 203, 1)", "rgba(255, 245, 203, 0)"],
    bigImage: "https://static.go2ready.com/app/asset/agent-select/v3/xunyuan.png",
    avatar: {
      selected: "https://static.go2ready.com/app/asset/agent-select/v2/xunyuanSelected.png",
      unselected: "https://static.go2ready.com/app/asset/agent-select/v2/xunyuanUnselected.png",
    },
    colors: {
      primary: "rgba(244, 227, 173, 1)",
      tagBorder: "rgba(252, 245, 225, 1)",
      tagText: "rgba(72, 54, 21, 1)",
    },
    accent: "#A48341",
  },
  {
    key: "shenrui",
    side: "b",
    name: "沈睿",
    nickName: "人才狙击手",
    slogan: "招聘最大的成本是拖。需求给我，我比你想象的更快交付。",
    tags: ["快 准 狠", "一击必中"],
    tint: "rgba(255, 213, 179, 1)",
    circleGradient: ["rgba(255, 213, 179, 1)", "rgba(255, 213, 179, 0)"],
    bigImage:
      "https://static.go2ready.com/app/agents/Shenrui/agent-selection/character/Shenrui_agent-selection_character.png",
    avatar: {
      selected:
        "https://static.go2ready.com/app/agents/Shenrui/agent-selection/avatar/selected/Shenrui_agent-selection_avatar_selected.png",
      unselected:
        "https://static.go2ready.com/app/agents/Shenrui/agent-selection/avatar/unselected/Shenrui_agent-selection_avatar_unselected.png",
    },
    colors: {
      primary: "#FCCDAA",
      tagBorder: "#FFE9D8",
      tagText: "#562F1B",
    },
    accent: "#E8803A",
  },
  {
    key: "chenzhiheng",
    side: "b",
    name: "陈知衡",
    nickName: "招聘军师",
    slogan: "好的人才不会写在简历的第一行。让我帮你翻到那一页，找到真正对的人。",
    tags: ["步步为营", "人定后动"],
    tint: "rgba(182, 224, 255, 1)",
    circleGradient: ["rgba(182, 224, 255, 1)", "rgba(182, 224, 255, 0)"],
    bigImage:
      "https://static.go2ready.com/app/agents/Chenzhiheng/agent-selection/character/Chenzhiheng_agent-selection_character.png",
    avatar: {
      selected:
        "https://static.go2ready.com/app/agents/Chenzhiheng/agent-selection/avatar/selected/Chenzhiheng_agent-selection_avatar_selected.png",
      unselected:
        "https://static.go2ready.com/app/agents/Chenzhiheng/agent-selection/avatar/unselected/Chenzhiheng_agent-selection_avatar_unselected.png",
    },
    colors: {
      primary: "#B6E0FF",
      tagBorder: "#D8EFFF",
      tagText: "#1C3B52",
    },
    accent: "#3A8BC2",
  },
];

export const getAgentByKey = (key: string): Agent =>
  AGENTS.find((a) => a.key === key) ?? AGENTS[0];
