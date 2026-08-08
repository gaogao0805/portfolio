/**
 * 在 canvas 上画出工牌正面（头像 + 姓名 + 职位 + 联系方式），返回 PNG dataURL。
 * 这张图会被贴到 3D 工牌的正面。只能在浏览器端调用。
 *
 * 白色卡面 + 深青 / 紫色点缀。
 * 想换头像照片：把 avatar 传进来（见 LanyardProvider），否则用首字母圆形占位。
 */
export type BadgeOptions = {
  name: string;
  role: string;
  email: string;
  phone?: string;
  /** 已加载完成的头像图片（可选）；没有就画首字母 */
  avatar?: HTMLImageElement | null;
};

const ACCENT = "#0db5a2"; // 深青品牌色
const PURPLE = "#6d5bff"; // 次强调
const CARD = "#ffffff"; // 卡面白
const INK = "#0b0b0f"; // 深色文字
const MUTED = "#6b6b76";

export function createBadgeTexture(opts: BadgeOptions): string {
  const W = 600;
  const H = 844; // ≈ 卡面比例 0.711
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 卡面背景（白）
  ctx.fillStyle = CARD;
  ctx.fillRect(0, 0, W, H);

  // 左侧竖条 + 顶部标签条（电光绿）
  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, 0, 14, H);
  ctx.fillRect(0, 70, W, 64);
  ctx.fillStyle = INK;
  ctx.font = "700 26px ui-sans-serif, system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText("AI PRODUCT DESIGNER", 44, 103);

  // 头像圆
  const cx = W / 2;
  const cy = 300;
  const r = 96;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  if (opts.avatar) {
    const img = opts.avatar;
    const scale = Math.max((r * 2) / img.width, (r * 2) / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
  } else {
    ctx.fillStyle = INK;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.fillStyle = ACCENT;
    ctx.font = "700 120px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText((opts.name[0] || "G").toUpperCase(), cx, cy + 6);
  }
  ctx.restore();
  // 头像描边
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
  ctx.stroke();

  // 姓名
  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  ctx.font = "700 64px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(opts.name, cx, 470);

  // 职位
  ctx.fillStyle = PURPLE;
  ctx.font = "600 30px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(opts.role, cx, 520);

  // 分隔线
  ctx.strokeStyle = "#e3e3e8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 580);
  ctx.lineTo(W - 80, 580);
  ctx.stroke();

  // 联系方式（左对齐）
  ctx.textAlign = "left";
  const lx = 80;
  let ly = 640;
  ctx.font = "600 22px ui-monospace, monospace";
  ctx.fillStyle = MUTED;
  ctx.fillText("EMAIL", lx, ly);
  ctx.fillStyle = INK;
  ctx.font = "500 26px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(opts.email, lx, ly + 34);

  if (opts.phone) {
    ly += 96;
    ctx.font = "600 22px ui-monospace, monospace";
    ctx.fillStyle = MUTED;
    ctx.fillText("PHONE", lx, ly);
    ctx.fillStyle = INK;
    ctx.font = "500 26px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(opts.phone, lx, ly + 34);
  }

  // 底部强调条
  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, H - 18, W, 18);

  return canvas.toDataURL("image/png");
}
