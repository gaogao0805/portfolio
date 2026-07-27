import type { NextConfig } from "next";

// 部署到子路径（如 GitHub Pages 项目页 /repo-name/）时构建：
//   PAGES_BASE=/portfolio-static npm run build
// 日常开发与根路径部署不需要设置该变量。
const basePath = process.env.PAGES_BASE || "";

const nextConfig: NextConfig = {
  // 导出为纯静态 HTML 到 out/ 目录（可直接部署到任何静态服务器）
  output: "export",
  // 链接形如 /zh/work/ → 生成 zh/work/index.html，静态托管兼容性最好
  trailingSlash: true,
  // 我们没用 next/image 优化，导出时关闭默认优化
  images: { unoptimized: true },
  // 根路径 / 的跳转由 public/index.html 处理（导出模式不支持 redirects()）
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
