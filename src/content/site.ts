type SocialLink = {
  label: string;
  href: string;
};

/**
 * 站点级配置：联系方式、社交链接。
 * 想改联系方式 → 只改这一个文件。
 */
export const site = {
  name: "Zoey",
  email: "jiayi.g0805@gmail.com",
  showPhone: true,
  phone: "+86 156 5753 6018",
  avatar: "/avatar.jpg",
  resume: {
    zh: "/resume-zh.pdf",
    en: "/resume-en.pdf",
  },
  socials: [] as SocialLink[],
} as const;
