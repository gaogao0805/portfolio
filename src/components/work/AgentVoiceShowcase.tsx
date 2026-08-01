"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import type { Locale } from "@/i18n/config";

/**
 * 「就绪」App 语音访谈 + 职场洞察便利贴报告的网页复刻。
 * 视觉参数 1:1 来自 vibe-voice H5（语音访谈 / 洞察卡片）：
 * - 语音光球：顶点/片元 GLSL 原样移植，256×256 Perlin 纹理、渲染循环平滑参数一致
 * - 状态机：connecting 灰（#9E9E9E/#BDBDBD），其余青（#78DCC8/#B8EDE3）；
 *   listening / thinking / speaking 的 input/output 音量公式与原实现一致
 * - 便利贴：绿 #D8F8DE / 蓝 #C8F2FF / 黄 #FFF6C8，胶带 SVG、旋转角、底部模糊阴影原样；
 *   入场 opacity 0→1、scale .8→1、rotate -5°→0°，spring stiffness 200 damping 18
 */

/* ==================== WebGL 语音光球（原样移植） ==================== */

const ORB_VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const ORB_FRAGMENT_SHADER = `
precision highp float;
uniform float uTime;
uniform float uAnimation;
uniform float uInverted;
uniform float uOffsets[7];
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uInputVolume;
uniform float uOutputVolume;
uniform float uOpacity;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

const float PI = 3.14159265358979323846;

bool drawOval(vec2 polarUv, vec2 polarCenter, float a, float b, bool reverseGradient, float softness, out vec4 color) {
    vec2 p = polarUv - polarCenter;
    float oval = (p.x * p.x) / (a * a) + (p.y * p.y) / (b * b);
    float edge = smoothstep(1.0, 1.0 - softness, oval);
    if (edge > 0.0) {
        float gradient = reverseGradient ? (1.0 - (p.x / a + 1.0) / 2.0) : ((p.x / a + 1.0) / 2.0);
        gradient = mix(0.5, gradient, 0.1);
        color = vec4(vec3(gradient), 0.85 * edge);
        return true;
    }
    return false;
}

vec3 colorRamp(float g, vec3 c1, vec3 c2, vec3 c3, vec3 c4) {
    if (g < 0.33) return mix(c1, c2, g * 3.0);
    else if (g < 0.66) return mix(c2, c3, (g - 0.33) * 3.0);
    else return mix(c3, c4, (g - 0.66) * 3.0);
}

vec2 hash2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)))) * 43758.5453);
}

float noise2D(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(
        mix(dot(hash2(i+vec2(0,0)), f-vec2(0,0)), dot(hash2(i+vec2(1,0)), f-vec2(1,0)), u.x),
        mix(dot(hash2(i+vec2(0,1)), f-vec2(0,1)), dot(hash2(i+vec2(1,1)), f-vec2(1,1)), u.x), u.y);
    return 0.5 + 0.5 * n;
}

float sharpRing(vec3 d, float t) {
    float noise = mix(noise2D(vec2(d.x,t)*5.0), noise2D(vec2(d.y,t)*5.0), d.z);
    return 1.0 + (noise - 0.5) * 2.5 * 0.3 * 1.5;
}

float smoothRing(vec3 d, float t) {
    float noise = mix(noise2D(vec2(d.x,t)*6.0), noise2D(vec2(d.y,t)*6.0), d.z);
    return 0.9 + (noise - 0.5) * 5.0 * 0.2;
}

float flow(vec3 d, float t) {
    return mix(texture2D(uPerlinTexture, vec2(t, d.x/2.0)).r,
               texture2D(uPerlinTexture, vec2(t, d.y/2.0)).r, d.z);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float radius = length(uv);
    float theta = atan(uv.y, uv.x);
    if (theta < 0.0) theta += 2.0 * PI;

    // Soft circular mask
    float mask = 1.0 - smoothstep(0.95, 0.99, radius);
    if (mask <= 0.0) { gl_FragColor = vec4(0.0); return; }

    vec3 decomposed = vec3(
        theta / (2.0 * PI),
        mod(theta / (2.0 * PI) + 0.5, 1.0) + 1.0,
        abs(theta / PI - 1.0)
    );

    float n = flow(decomposed, radius * 0.03 - uAnimation * 0.2) - 0.5;
    float distortVol = max(uInputVolume, uOutputVolume);
    theta += n * mix(0.08, 0.45, distortVol);

    vec4 color = vec4(1.0);
    float oCenters[7];
    oCenters[0] = 0.0;
    oCenters[1] = 0.5 * PI;
    oCenters[2] = 1.0 * PI;
    oCenters[3] = 1.5 * PI;
    oCenters[4] = 2.0 * PI;
    oCenters[5] = 2.5 * PI;
    oCenters[6] = 3.0 * PI;

    float centers[7];
    for (int i = 0; i < 7; i++) {
        centers[i] = oCenters[i] + 0.5 * sin(uTime / 20.0 + uOffsets[i]);
    }

    vec4 ovalColor;
    for (int i = 0; i < 7; i++) {
        float nc = texture2D(uPerlinTexture, vec2(mod(centers[i] + uTime * 0.05, 1.0), 0.5)).r;
        float a = 0.5 + nc * mix(0.3, 0.65, uInputVolume);
        float b = nc * mix(3.5, 0.8, uInputVolume);
        bool rev = (i == 1 || i == 3 || i == 5);
        float dTheta = min(abs(theta-centers[i]), min(abs(theta+2.0*PI-centers[i]), abs(theta-2.0*PI-centers[i])));
        float soft = 0.6;
        if (drawOval(vec2(dTheta, radius), vec2(0.0), a, b, rev, soft, ovalColor)) {
            color.rgb = mix(color.rgb, ovalColor.rgb, ovalColor.a);
            color.a = max(color.a, ovalColor.a);
        }
    }

    float rr1 = sharpRing(decomposed, uTime * 0.1);
    float rr2 = smoothRing(decomposed, uTime * 0.1);
    float ir1 = radius + uInputVolume * 0.2;
    float ir2 = radius + uInputVolume * 0.15;
    float ra1 = (ir2 >= rr1) ? mix(0.02, 0.85, uInputVolume) : 0.0;
    float ra2 = smoothstep(rr2 - 0.05, rr2 + 0.05, ir1) * mix(0.02, 0.7, uInputVolume);
    float totalRing = max(ra1, ra2);
    color.rgb = 1.0 - (1.0 - color.rgb) * (1.0 - totalRing);

    float lum = mix(color.r, 1.0 - color.r, uInverted);
    color.rgb = colorRamp(lum, vec3(0.0), uColor1, uColor2, vec3(1.0));
    color.a *= uOpacity * mask;

    gl_FragColor = vec4(color.rgb * color.a, color.a);
}
`;

type OrbState = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "error";

/** 常态青绿 / 连接中灰（与原实现一致） */
const ORB_COLORS: [string, string] = ["#78DCC8", "#B8EDE3"];
const ORB_COLORS_CONNECTING: [string, string] = ["#9E9E9E", "#BDBDBD"];

function hexToRgb01(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** 256×256 Perlin 噪声纹理（与原实现同一套梯度噪声 + 随机排列表） */
function createPerlinTexture(gl: WebGLRenderingContext) {
  const data = new Uint8Array(262144);
  const fade = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);
  const lerp = (x: number, p: number, s: number) => x + s * (p - x);
  const grads = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const grad = (x: number, p: number, s: number) => {
    const [v, w] = grads[x & 7];
    return v * p + w * s;
  };
  const perm = new Uint8Array(512);
  for (let x = 0; x < 256; x++) perm[x] = x;
  for (let x = 255; x > 0; x--) {
    const p = Math.floor(Math.random() * (x + 1));
    [perm[x], perm[p]] = [perm[p], perm[x]];
  }
  for (let x = 0; x < 256; x++) perm[256 + x] = perm[x];
  const noise = (x: number, p: number) => {
    const S = Math.floor(x) & 255;
    const v = Math.floor(p) & 255;
    x -= Math.floor(x);
    p -= Math.floor(p);
    const w = fade(x);
    const g = fade(p);
    const O = perm[S] + v;
    const F = perm[S + 1] + v;
    return lerp(
      lerp(grad(perm[O], x, p), grad(perm[F], x - 1, p), w),
      lerp(grad(perm[O + 1], x, p - 1), grad(perm[F + 1], x - 1, p - 1), w),
      g,
    );
  };
  for (let x = 0; x < 256; x++) {
    for (let p = 0; p < 256; p++) {
      const S = (noise(p / 32, x / 32) * 0.5 + 0.5) * 255;
      const v = (x * 256 + p) * 4;
      data[v] = data[v + 1] = data[v + 2] = S;
      data[v + 3] = 255;
    }
  }
  const texture = gl.createTexture();
  if (!texture) return null;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * 演示用的拟人音量曲线：线上环境音量来自麦克风 / AI 语音流，
 * 这里用几组正弦叠加模拟说话时的起伏节奏。
 */
function simulatedVolume(t: number) {
  const raw =
    0.55 +
    0.25 * Math.sin(t * 2.1) +
    0.2 * Math.sin(t * 5.7 + 1.3) +
    0.12 * Math.sin(t * 13.1 + 4.0);
  return clamp01(raw - 0.12);
}

/**
 * 语音光球。状态机公式与原实现一致：
 * C 为累计时间（dt 累乘 0.5 后再 ×2），listening/speaking 由音量驱动。
 */
function VoiceOrb({ state, size = 211 }: { state: OrbState; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    if (!gl) return;

    const px = (canvas.clientWidth || 211) * 2;
    canvas.width = px;
    canvas.height = px;

    const vs = compileShader(gl, gl.VERTEX_SHADER, ORB_VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, ORB_FRAGMENT_SHADER);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const u = {
      uTime: gl.getUniformLocation(program, "uTime"),
      uAnimation: gl.getUniformLocation(program, "uAnimation"),
      uInverted: gl.getUniformLocation(program, "uInverted"),
      uInputVolume: gl.getUniformLocation(program, "uInputVolume"),
      uOutputVolume: gl.getUniformLocation(program, "uOutputVolume"),
      uOpacity: gl.getUniformLocation(program, "uOpacity"),
      uColor1: gl.getUniformLocation(program, "uColor1"),
      uColor2: gl.getUniformLocation(program, "uColor2"),
      uOffsets: gl.getUniformLocation(program, "uOffsets"),
      uPerlinTexture: gl.getUniformLocation(program, "uPerlinTexture"),
    };
    const offsets = new Float32Array(7).map(() => Math.random() * Math.PI * 2);
    gl.uniform1fv(u.uOffsets, offsets);
    gl.uniform1i(u.uPerlinTexture, 0);
    gl.uniform1f(u.uInverted, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.viewport(0, 0, px, px);

    const perlin = createPerlinTexture(gl);
    if (!perlin) return;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, perlin);

    // 渲染循环状态（初值与原实现一致）
    let time = 0;
    let animation = 0.1;
    let opacity = 0;
    let inputVol = 0;
    let outputVol = 0;
    let flowSpeed = 0.1;
    let last = 0;
    const cur1 = [...hexToRgb01(ORB_COLORS[0])] as [number, number, number];
    const cur2 = [...hexToRgb01(ORB_COLORS[1])] as [number, number, number];

    let raf = 0;
    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      time += dt * 0.5;
      const C = time * 2;

      // 状态机：计算目标 input/output 音量与不透明度
      const st = stateRef.current;
      const vol = simulatedVolume(C);
      let input = 0;
      let output = 0.3;
      let opacityTarget = 1;
      switch (st) {
        case "idle":
        case "connecting":
          input = 0;
          output = 0.3;
          break;
        case "thinking":
          input = clamp01(
            0.38 + 0.07 * Math.sin(C * 0.7) + 0.05 * Math.sin(C * 2.1) * Math.sin(C * 0.37 + 1.2),
          );
          output = clamp01(0.48 + 0.12 * Math.sin(C * 1.05 + 0.6));
          break;
        case "listening":
          input = Math.min(1, Math.max(vol * 3.5, 0.12 + Math.sin(C * 1.6) * 0.08));
          output = 0.45;
          break;
        case "speaking":
          input = clamp01(0.65 + Math.sin(C * 4.8) * 0.22);
          output = clamp01(Math.max(vol * 2 + 0.3, 0.75 + Math.sin(C * 3.6) * 0.22));
          break;
        case "error":
          input = 0;
          output = 0.15;
          opacityTarget = 0.5 + 0.5 * Math.sin(C * 1.5);
          break;
      }

      // 平滑（系数与原实现一致）
      opacity += (opacityTarget - opacity) * Math.min(1, dt * 4);
      inputVol += (input - inputVol) * 0.2;
      outputVol += (output - outputVol) * 0.2;
      const distort = Math.max(inputVol, outputVol);
      const targetSpeed = 0.1 + (1 - Math.pow(distort - 1, 2)) * 0.9;
      flowSpeed += (targetSpeed - flowSpeed) * 0.12;
      animation += dt * flowSpeed;

      // 颜色随状态渐变（connecting 灰 ↔ 青绿）
      const [tc1, tc2] = st === "connecting" ? ORB_COLORS_CONNECTING : ORB_COLORS;
      const rgb1 = hexToRgb01(tc1);
      const rgb2 = hexToRgb01(tc2);
      for (let i = 0; i < 3; i++) {
        cur1[i] += (rgb1[i] - cur1[i]) * 0.06;
        cur2[i] += (rgb2[i] - cur2[i]) * 0.06;
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uAnimation, animation);
      gl.uniform1f(u.uInputVolume, inputVol);
      gl.uniform1f(u.uOutputVolume, outputVol);
      gl.uniform1f(u.uOpacity, opacity);
      gl.uniform3fv(u.uColor1, cur1);
      gl.uniform3fv(u.uColor2, cur2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      gl.deleteTexture(perlin);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: size, height: size }} aria-hidden />;
}

/* ==================== 访谈演示框（状态轮播 + 手动切换） ==================== */

const DEMO_STATES = ["connecting", "listening", "thinking", "speaking"] as const;
type DemoState = (typeof DEMO_STATES)[number];

/** 自动轮播节奏：模拟一段「连接 → 用户说 → AI 想 → AI 说 → 用户接着说」的对话 */
const AUTO_SEQUENCE: { state: DemoState; duration: number }[] = [
  { state: "connecting", duration: 2200 },
  { state: "listening", duration: 4200 },
  { state: "thinking", duration: 2600 },
  { state: "speaking", duration: 4200 },
  { state: "listening", duration: 3200 },
];

const STATE_LABEL: Record<DemoState, { zh: string; en: string }> = {
  connecting: { zh: "连接中", en: "Connecting" },
  listening: { zh: "正在听", en: "Listening" },
  thinking: { zh: "正在思考", en: "Thinking" },
  speaking: { zh: "对方说话中", en: "Agent speaking" },
};

/** pill 上的短标签（英文比状态文案短，保证一排放得下） */
const STATE_PILL_LABEL: Record<DemoState, { zh: string; en: string }> = {
  connecting: { zh: "连接中", en: "Connecting" },
  listening: { zh: "正在听", en: "Listening" },
  thinking: { zh: "正在思考", en: "Thinking" },
  speaking: { zh: "对方说话中", en: "Speaking" },
};

function VoiceInterviewDemo({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  const [mode, setMode] = useState<"auto" | DemoState>("auto");
  const [autoState, setAutoState] = useState<DemoState>("connecting");

  useEffect(() => {
    if (mode !== "auto") return;
    let i = 0;
    let timer = 0;
    const step = () => {
      setAutoState(AUTO_SEQUENCE[i].state);
      timer = window.setTimeout(step, AUTO_SEQUENCE[i].duration);
      i = (i + 1) % AUTO_SEQUENCE.length;
    };
    step();
    return () => window.clearTimeout(timer);
  }, [mode]);

  const orbState: OrbState = mode === "auto" ? autoState : mode;

  return (
    <div className="flex w-full max-w-[460px] flex-col items-center">
      {/* 光球 + 状态文字 */}
      <VoiceOrb state={orbState} />
      <p className="mt-5 text-[13px] font-medium text-[#7B828E]">
        {STATE_LABEL[orbState as DemoState][locale]}
      </p>

      {/* 状态切换 pills（一排） */}
      <div className="mt-4 flex items-center justify-center gap-1.5 whitespace-nowrap">
        <button
          type="button"
          onClick={() => setMode("auto")}
          className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
            mode === "auto" ? "bg-[#171718] text-white" : "bg-black/5 text-[#494949] hover:bg-black/10"
          }`}
        >
          {isZh ? "自动轮播" : "Auto"}
        </button>
        {DEMO_STATES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setMode(s)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
              mode === s ? "bg-[#171718] text-white" : "bg-black/5 text-[#494949] hover:bg-black/10"
            }`}
          >
            {STATE_PILL_LABEL[s][locale]}
          </button>
        ))}
      </div>
      <p className="mt-2 text-center font-mono text-xs text-muted">
        {isZh
          ? "光球 1:1 复刻自 App 语音访谈 · 各状态可单独查看"
          : "Orb 1:1 recreated from the app · inspect each state"}
      </p>
    </div>
  );
}

/* ==================== 便利贴洞察报告 ==================== */

/** 胶带 SVG（原样 data URI，来自 App 洞察卡片） */
const TAPE_GREEN =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20width='100%25'%20height='100%25'%20overflow='visible'%20style='display:%20block;'%20viewBox='0%200%20100.11%2029.36'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Group'%20opacity='0.8'%3e%3cpath%20id='Vector'%20opacity='0.8'%20d='M96.28%2021.967C97.29%2020.0789%2097.74%2018.1273%2098.7%2016.2339C99.05%2015.5551%2099.43%2014.6323%20100.11%2013.9534L7.70999%200C7.83999%201.5274%206.05998%203.73894%205.50998%204.85798C3.75998%208.40069%202%2011.9487%200%2015.4543L92.08%2029.36C92.68%2026.8409%2094.96%2024.4437%2096.28%2021.967Z'%20fill='var(--fill-0,%20%23BAEECD)'/%3e%3c/g%3e%3c/svg%3e";
const TAPE_BLUE =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20width='100%25'%20height='100%25'%20overflow='visible'%20style='display:%20block;'%20viewBox='0%200%2097%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20id='Vector'%20opacity='0.8'%20d='M96.7894%2011.4763C96.9398%209.31459%2096.5185%207.1529%2096.6288%204.99121C96.669%204.21207%2096.6288%203.17516%2097%202.34915L0.702257%200C1.50482%201.62273%200.742385%204.24136%200.702257%205.52431C0.561808%209.57235%200.411315%2013.6204%200%2017.6567L95.9566%2020C95.4249%2017.2115%2096.5988%2014.3292%2096.7894%2011.4821V11.4763Z'%20fill='var(--fill-0,%20%23A7DDEE)'/%3e%3c/svg%3e";
const TAPE_YELLOW =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20width='100%25'%20height='100%25'%20overflow='visible'%20style='display:%20block;'%20viewBox='0%200%2084.95%2030.87'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Group'%20opacity='0.8'%3e%3cpath%20id='Vector'%20opacity='0.8'%20d='M81.25%206.21342C81.05%205.85455%2080.73%205.52381%2080.51%205.17198C80.21%204.69348%2080.08%204.17277%2079.95%203.65909C79.37%201.39327%2079.52%202.93431%2079.23%200.640342C79.19%200.358874%2079.19%200.161844%2079.23%200L0.03%2010.0484C0.01%2010.1188%200%2010.1892%200%2010.2595C0.04%2010.8647%200.45%2011.505%200.66%2012.0891C1.59%2014.6364%202.22%2017.2329%202.54%2019.8505C2.62%2020.519%202.69%2021.2016%203.04%2021.8208C3.25%2022.1797%203.54%2022.5104%203.76%2022.8693C4.07%2023.39%204.2%2023.9529%204.33%2024.5159C4.8%2026.6339%205.28%2028.7519%205.75%2030.87L84.95%2020.8216C83.8%2017.8591%2081.99%2010.9491%2081.66%207.88816C81.6%207.31818%2081.55%206.74117%2081.25%206.21342Z'%20fill='var(--fill-0,%20%23F7E791)'/%3e%3c/g%3e%3c/svg%3e";

/** 标题行小图标（原样 data URI） */
const ICON_GREEN =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20width='100%25'%20height='100%25'%20overflow='visible'%20style='display:%20block;'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M3.33446%2015.0019H7.9178V16.0436C7.9178%2017.3091%206.89178%2018.3352%205.62613%2018.3352C4.36048%2018.3352%203.33446%2017.3091%203.33446%2016.0436V15.0019ZM6.6678%205.10237C8.33446%205.10237%209.1678%207.50186%209.1678%209.16856C9.1678%2010.0019%208.75113%2010.8352%208.33446%2012.0852L7.9178%2013.3352H3.33446C3.33446%2012.5019%202.9178%2011.2519%202.9178%209.16856C2.9178%207.08519%204.58265%205.10237%206.6678%205.10237ZM16.7128%2011.7505L16.5319%2012.7763C16.3121%2014.0227%2015.1235%2014.855%2013.877%2014.6352C12.6306%2014.4155%2011.7984%2013.2268%2012.0182%2011.9804L12.199%2010.9546L16.7128%2011.7505ZM15.1491%201.42254C17.2025%201.78462%2018.4978%204.02643%2018.136%206.07811C17.7743%208.12979%2017.1469%209.28848%2017.0022%2010.1091L12.4885%209.31322L12.2952%208.00987C12.1019%206.70651%2011.8363%205.81347%2011.981%204.99281C12.2704%203.35146%2013.5077%201.13313%2015.1491%201.42254Z'%20fill='var(--fill-0,%20%23325339)'/%3e%3c/g%3e%3c/svg%3e";
const ICON_BLUE =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20width='100%25'%20height='100%25'%20overflow='visible'%20style='display:%20block;'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M12.9086%202.77378C14.6865%202.29778%2016.5141%203.35357%2016.9906%205.13135L19.0398%2012.7778C19.5755%2014.778%2018.3884%2016.8346%2016.3884%2017.3709C14.388%2017.9069%2012.3315%2016.719%2011.7953%2014.7187C11.7242%2014.453%2011.684%2014.1854%2011.6716%2013.9212C11.142%2014.0793%2010.5811%2014.1653%2010.0008%2014.1653C9.42042%2014.1653%208.85909%2014.0794%208.32932%2013.9212C8.31692%2014.1854%208.27756%2014.4531%208.20644%2014.7187C7.67029%2016.7189%205.61365%2017.9067%203.61334%2017.3709C1.61304%2016.8348%200.426171%2014.7781%200.961968%2012.7778L3.01113%205.13135C3.48774%203.35346%205.31514%202.29752%207.09315%202.77378C8.53609%203.16053%209.50283%204.43785%209.56142%205.85564C9.70583%205.84046%209.85259%205.83204%2010.0008%205.83204C10.1488%205.83205%2010.2953%205.84051%2010.4395%205.85564C10.4981%204.43776%2011.4655%203.16045%2012.9086%202.77378ZM4.5842%2011.6653C3.43363%2011.6653%202.50089%2012.5981%202.50087%2013.7486C2.50087%2014.8992%203.43361%2015.832%204.5842%2015.832C5.73462%2015.8318%206.66754%2014.8991%206.66754%2013.7486C6.66752%2012.5982%205.7346%2011.6656%204.5842%2011.6653ZM15.4175%2011.6653C14.2669%2011.6653%2013.3343%2012.5981%2013.3342%2013.7486C13.3342%2014.8992%2014.2669%2015.832%2015.4175%2015.832C16.5679%2015.8318%2017.5008%2014.8991%2017.5008%2013.7486C17.5008%2012.5982%2016.5679%2011.6656%2015.4175%2011.6653Z'%20fill='var(--fill-0,%20%233F7485)'/%3e%3c/g%3e%3c/svg%3e";
const ICON_YELLOW =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20width='100%25'%20height='100%25'%20overflow='visible'%20style='display:%20block;'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M10.0004%204.16923V1.66923H8.3337V4.16923H3.3337C2.87347%204.16923%202.50037%204.54233%202.50037%205.00257V11.6692C2.50037%2012.1295%202.87347%2012.5026%203.3337%2012.5026H14.5122L18.0896%208.92515C18.415%208.59973%2018.415%208.07208%2018.0896%207.74664L14.5122%204.16923H10.0004ZM10.0004%2014.1692H8.3337V18.3359H10.0004V14.1692Z'%20fill='var(--fill-0,%20%2384653F)'/%3e%3c/g%3e%3c/svg%3e";

/** 三张便利贴的配色 / 旋转 / 胶带 / 阴影参数（与原实现一致） */
const NOTE_CONFIGS = [
  {
    bg: "#D8F8DE",
    textColor: "rgba(50,83,57,0.8)",
    titleColor: "#325339",
    rotate: -2,
    innerRotate: 0.5,
    tape: TAPE_GREEN,
    tapeWidth: "100.11px",
    tapeHeight: "29.36px",
    tapeLeft: "33.94%",
    icon: ICON_GREEN,
    shadowRotate: -1.63,
    shadowSkewX: 3.9,
    shadowOffsetLeft: "2.32px",
  },
  {
    bg: "#C8F2FF",
    textColor: "rgba(63,116,133,0.8)",
    titleColor: "#3f7485",
    rotate: 2,
    innerRotate: -0.5,
    tape: TAPE_BLUE,
    tapeWidth: "97px",
    tapeHeight: "20px",
    tapeLeft: "109.92px",
    icon: ICON_BLUE,
    shadowRotate: 1.63,
    shadowSkewX: -3.9,
    shadowOffsetLeft: "9.18px",
  },
  {
    bg: "#FFF6C8",
    textColor: "rgba(132,101,63,0.8)",
    titleColor: "#84653f",
    rotate: -2,
    innerRotate: 0.5,
    tape: TAPE_YELLOW,
    tapeWidth: "84.95px",
    tapeHeight: "30.87px",
    tapeLeft: "36.45%",
    icon: ICON_YELLOW,
    shadowRotate: -1.63,
    shadowSkewX: 3.9,
    shadowOffsetLeft: "2.32px",
  },
];

type InsightNote = { title: string; text: string; highlights: string[] };

const INSIGHT_NOTES: Record<Locale, InsightNote[]> = {
  zh: [
    {
      title: "核心优势",
      text: "5 年 C 端产品经验，擅长把复杂的 AI 能力翻译成普通用户听得懂的体验，主导过两款千万级 DAU 产品的核心链路。",
      highlights: ["C 端产品", "AI 能力", "千万级 DAU"],
    },
    {
      title: "表达风格",
      text: "习惯先讲结论再展开细节，聊到数据和方法论时明显更投入——一个用结果说话的人。",
      highlights: ["先讲结论", "用结果说话"],
    },
    {
      title: "求职方向",
      text: "更适合 AI 产品的资深产品岗：既贴近模型能力边界做设计，也能把技术价值讲成用户价值。",
      highlights: ["AI 产品", "资深产品岗"],
    },
  ],
  en: [
    {
      title: "Core strengths",
      text: "5 years in consumer products, skilled at translating complex AI capabilities into experiences anyone can understand; led core flows of two apps with 10M+ DAU.",
      highlights: ["consumer products", "AI capabilities", "10M+ DAU"],
    },
    {
      title: "Communication style",
      text: "Leads with the conclusion, then unpacks the details; noticeably more engaged around data and methodology — someone who lets results speak.",
      highlights: ["conclusion first", "results speak"],
    },
    {
      title: "Where you fit",
      text: "A senior product role in AI products fits best: designing close to the model's edge while turning technical value into user value.",
      highlights: ["AI products", "senior product role"],
    },
  ],
};

/** 正文中的关键词加粗（与原实现同一思路：按长度降序切分后包 font-semibold） */
function renderHighlighted(text: string, highlights: string[]) {
  const keys = [...new Set(highlights.map((h) => h.trim()).filter(Boolean))].sort(
    (a, b) => b.length - a.length,
  );
  if (keys.length === 0) return text;
  const escaped = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");
  const matched = new Set(keys);
  return text.split(re).map((part, i) =>
    part && matched.has(part) ? (
      <span key={`${part}-${i}`} className="font-semibold">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** 单张便利贴：tape + 正文 + 标题行 + 底部模糊阴影，结构与原实现一致 */
function StickyNote({
  note,
  config,
  index,
}: {
  note: InsightNote;
  config: (typeof NOTE_CONFIGS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: config.rotate - 5 }}
      animate={{ opacity: 1, scale: 1, rotate: config.rotate }}
      transition={{ delay: 0.15 + index * 0.4, type: "spring", stiffness: 200, damping: 18 }}
      className="flex items-center justify-center"
    >
      <div
        className="inline-grid"
        style={{ gridTemplateColumns: "max-content", gridTemplateRows: "max-content" }}
      >
        <div
          className="col-start-1 row-start-1 flex items-center justify-center"
          style={{ marginTop: config.tape === TAPE_BLUE ? "9.98px" : "15px" }}
        >
          <div style={{ transform: `rotate(${config.innerRotate}deg)` }}>
            <div className="flex flex-col items-center">
              <div
                className="overflow-hidden px-[24px] pb-[12px] pt-[16px]"
                style={{ backgroundColor: config.bg }}
              >
                <p
                  className="w-[270px] text-[14px] leading-[21px]"
                  style={{ color: config.textColor }}
                >
                  {renderHighlighted(note.text, note.highlights)}
                </p>
              </div>
              <div
                className="flex w-[318px] items-center gap-[9.143px] px-[24px]"
                style={{ backgroundColor: config.bg }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={config.icon} alt="" className="h-[20px] w-[20px] shrink-0" />
                <p
                  className="leading-[21px]"
                  style={{ color: config.titleColor, fontSize: "16px", fontWeight: 600 }}
                >
                  {note.title}
                </p>
              </div>
              <div
                className="inline-grid"
                style={{
                  gridTemplateColumns: "max-content",
                  gridTemplateRows: "max-content",
                  lineHeight: 0,
                }}
              >
                <div
                  className="col-start-1 row-start-1 flex h-[13.498px] w-[301.779px] items-center justify-center"
                  style={{ marginLeft: config.shadowOffsetLeft, marginTop: "6.5px" }}
                >
                  <div
                    style={{
                      transform: `rotate(${config.shadowRotate}deg) skewX(${config.shadowSkewX}deg)`,
                    }}
                  >
                    <div
                      className="bg-[rgba(0,0,0,0.1)]"
                      style={{ filter: "blur(4.571px)", width: "301.422px", height: "4.969px" }}
                    />
                  </div>
                </div>
                <div
                  className="col-start-1 row-start-1 h-[14.857px] w-[318px]"
                  style={{ backgroundColor: config.bg }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-start-1 row-start-1 relative z-10"
          style={{
            width: config.tapeWidth,
            height: config.tapeHeight,
            marginLeft: config.tapeLeft,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={config.tape} alt="" className="absolute block h-full w-full" />
        </div>
      </div>
    </motion.div>
  );
}

function InsightReportDemo({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  const notes = INSIGHT_NOTES[locale];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [playKey, setPlayKey] = useState(0);

  return (
    <div className="w-full max-w-[380px]">
      {/* 便利贴：滚入视口后一张张贴上去 */}
      <div ref={ref} className="flex flex-col items-center gap-[12px]">
        {inView
          ? notes.map((note, i) => (
              <StickyNote
                key={`${playKey}-${note.title}`}
                note={note}
                config={NOTE_CONFIGS[i % NOTE_CONFIGS.length]}
                index={i}
              />
            ))
          : // 占位保持高度，避免滚入时布局跳动
            notes.map((note) => (
              <div key={note.title} className="w-[318px]" style={{ height: 150 }} aria-hidden />
            ))}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="font-mono text-xs text-muted">
          {isZh
            ? "便利贴样式复刻自 App 洞察报告 · 滚入时逐张贴上"
            : "Sticky notes recreated from the app · posted on scroll"}
        </p>
        <button
          type="button"
          onClick={() => setPlayKey((k) => k + 1)}
          className="font-mono text-xs text-muted underline underline-offset-4 transition-colors hover:text-fg"
        >
          {isZh ? "重新贴上" : "Replay"}
        </button>
      </div>
    </div>
  );
}

/* ==================== 导出：语音访谈 + 洞察报告两个区块 ==================== */

export function AgentVoiceShowcase({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  return (
    <>
      {/* 区块一：语音光球全状态展示 */}
      <section data-nav-theme="light" className="theme-light bg-transparent">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-16">
            <div className="order-last flex min-w-0 justify-center lg:order-none lg:justify-start">
              <VoiceInterviewDemo locale={locale} />
            </div>
            <div className="max-w-xl lg:justify-self-end">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                {isZh ? "语音访谈" : "Voice interview"}
              </span>
              <motion.h2
                data-journey-anchor
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="display mt-4 text-3xl leading-[1.15] sm:text-5xl"
              >
                {isZh ? "语音对话，状态看得见" : "Voice states you can see"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 text-sm leading-relaxed text-muted sm:text-base"
              >
                {isZh
                  ? "访谈的核心是一颗实时渲染的语音光球：连接时安静呼吸，倾听时随你的音量起伏，思考时放缓游走，回应时饱满律动——不用一行文字，对话的状态就能被感知。"
                  : "At the heart of the interview is a voice orb rendered in real time: calm while connecting, rippling with your volume as it listens, drifting slowly while thinking, and pulsing richly when it responds — no labels needed, you feel the state of the conversation."}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* 区块二：便利贴洞察报告 */}
      <section data-nav-theme="light" className="theme-light bg-transparent">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
            <div className="max-w-xl">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                {isZh ? "洞察报告" : "Insight report"}
              </span>
              <motion.h2
                data-journey-anchor
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="display mt-4 text-3xl leading-[1.15] sm:text-5xl"
              >
                {isZh ? "聊完，便利贴一张张贴上墙" : "Sticky notes, straight from the chat"}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 space-y-3 text-sm leading-relaxed text-muted sm:text-base"
              >
                <p>
                  {isZh
                    ? "访谈一结束，AI 就把对话凝练成一组便利贴式的职场洞察：核心优势、表达风格、求职方向，逐张贴上。"
                    : "The moment the conversation ends, the AI condenses it into sticky-note insights: core strengths, communication style, and where you fit — posted one by one."}
                </p>
                <p>
                  {isZh
                    ? "它让用户更了解自己，也让平台更懂他的需求——画像越清晰，岗位推荐就越准。"
                    : "It helps users understand themselves, and helps the platform understand their needs: the clearer the profile, the sharper the job matches."}
                </p>
                <p>
                  {isZh
                    ? "同一套语音对话能力也用在了 onboarding：新用户口述完成整个引导对话，回答自动填入表单，几分钟就走完过去一长串的注册流程。"
                    : "The same voice flow also powers onboarding — new users simply talk through the whole setup, answers fill the form automatically, and what used to be a long sign-up takes minutes."}
                </p>
              </motion.div>
            </div>
            <div className="flex min-w-0 justify-center lg:justify-end">
              <InsightReportDemo locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
