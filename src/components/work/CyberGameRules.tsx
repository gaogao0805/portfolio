import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { ProjectGameRules } from "@/content/projects";

const roles = {
  company: {
    zh: "公司",
    en: "Company",
    image: "https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-role-company.wj9fiwlfl.webp",
  },
  user: {
    zh: "网民",
    en: "User",
    image: "https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-role-user.2rvu85911f.webp",
  },
  hacker: {
    zh: "黑客",
    en: "Hacker",
    image: "https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-role-hacker.60uy4swinz.webp",
  },
} as const;

const relationships = [
  {
    from: "company",
    to: "user",
    tone: "text-[#d9b8ff]",
    labelZh: "隐瞒泄露或保护信息，获取信任",
    labelEn: "Leak data for trust",
    zh: "公司可以选择偷偷泄露信息且不被发现，以此骗取信任；也可以保护用户信息，正常获取信任。",
    en: "Companies can leak user information to gain trust.",
  },
  {
    from: "user",
    to: "company",
    tone: "text-[#ffb8cb]",
    labelZh: "发现公司违规，举报并追回信息",
    labelEn: "Report and regain data",
    zh: "网民发现公司存在违规行为后，可以发起举报；举报成功即可追回被泄露的信息。",
    en: "Users can report a company and regain an information point after a successful report.",
  },
  {
    from: "company",
    to: "hacker",
    tone: "text-[#ffb8cb]",
    labelZh: "每 4 回合筑起防火墙，也可抽卡获得",
    labelEn: "Build firewall every 4 rounds",
    zh: "公司每四回合可使用一次「建立防火墙」，也可通过抽取技能卡获得该技能。",
    en: "Companies gain Firewall Build every four rounds, or obtain it from a skill card.",
  },
  {
    from: "hacker",
    to: "company",
    tone: "text-[#d9b8ff]",
    labelZh: "每 3 回合攻破防火墙，也可抽卡获得",
    labelEn: "Breach firewall every 3 rounds",
    zh: "黑客每三回合可使用一次「攻破防火墙」，也可通过抽取技能卡获得该技能。",
    en: "Hackers gain Firewall Breach every three rounds, or obtain it from a skill card.",
  },
  {
    from: "hacker",
    to: "user",
    tone: "text-[#ffb8cb]",
    labelZh: "窃取网名，并借投票扰乱判断",
    labelEn: "Steal names and disrupt voting",
    zh: "黑客可以窃取网民的网名信息，并利用投票权混淆网民的判断。",
    en: "Hackers can steal screen-name information and use voting rights to confuse users.",
  },
  {
    from: "user",
    to: "hacker",
    tone: "text-[#d9b8ff]",
    labelZh: "凭小道消息识破伪装并举报",
    labelEn: "Identify and report through Grapevine",
    zh: "网民可使用「小道消息」，推断并举报伪装在人群中的黑客。",
    en: "Users can infer a hidden hacker through Grapevine and report them.",
  },
] as const;

const wins = [
  {
    role: "company",
    zh: ["信任值达到 20 点", "成功保护自己，抵御黑客攻击"],
    en: ["Reach 20 trust points", "Protect the company from hackers"],
  },
  {
    role: "user",
    zh: ["避免 8 条个人信息被窃取", "成功让违规公司退场"],
    en: ["Prevent eight pieces of personal data from being stolen", "Remove a violating company"],
  },
  {
    role: "hacker",
    zh: ["识别并利用窃取、售卖信息的对象", "总信息点大于 6，且高级信息大于 1"],
    en: ["Identify targets that steal and sell information", "Hold over 6 information points and over 1 advanced point"],
  },
] as const;

function RoleFigure({
  role,
  locale,
  className,
}: {
  role: keyof typeof roles;
  locale: Locale;
  className?: string;
}) {
  const item = roles[role];
  return (
    <div className={className}>
      <div className="relative mx-auto h-[calc(100%_-_1.5rem)] aspect-square overflow-hidden">
        <Image
          src={item.image}
          alt={item[locale]}
          fill
          sizes="160px"
          className="object-cover object-top"
        />
      </div>
      <p className="mt-1 text-center text-sm font-semibold text-white">
        {item[locale]}
      </p>
    </div>
  );
}

export function CyberGameRules({
  locale,
  rules,
}: {
  locale: Locale;
  rules: ProjectGameRules;
}) {
  const isZh = locale === "zh";

  return (
    <section data-nav-theme="dark" className="bg-[#2d2d2d] text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-28">
        <div className="max-w-2xl">
          <p className="kicker">{rules.eyebrow[locale]}</p>
          <h2 className="display mt-4 text-3xl leading-none sm:text-5xl">
            {rules.heading[locale]}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/60 sm:mt-6 sm:text-lg">
            {rules.introduction[locale]}
          </p>
        </div>

        <div className="mt-12 grid gap-14 sm:mt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <h3 className="text-xl font-bold italic text-[#fa457c] sm:text-2xl">
              {isZh ? "角色制衡" : "Checks and balances"}
            </h3>

            <div className="mt-6 sm:mt-8">
              <div className="relative mx-auto aspect-[1.2/1] w-full max-w-xl">
                <svg
                  viewBox="0 0 600 500"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                <defs>
                  <marker id="pink-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#fa457c" />
                  </marker>
                  <marker id="purple-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#9752ff" />
                  </marker>
                  <path id="label-left-purple" d="M161 369 L297 177" />
                  <path id="label-left-pink" d="M122 341 L258 149" />
                  <path id="label-right-pink" d="M342 149 L478 341" />
                  <path id="label-right-purple" d="M303 177 L439 369" />
                  <path id="label-bottom-pink" d="M154 378 L446 378" />
                  <path id="label-bottom-purple" d="M154 436 L446 436" />
                </defs>
                <path d="M287 170 L151 362" stroke="#9752ff" strokeWidth="3" markerEnd="url(#purple-arrow)" />
                <path d="M132 348 L268 156" stroke="#fa457c" strokeWidth="3" markerEnd="url(#pink-arrow)" />
                <path d="M332 156 L468 348" stroke="#fa457c" strokeWidth="3" markerEnd="url(#pink-arrow)" />
                <path d="M449 362 L313 170" stroke="#9752ff" strokeWidth="3" markerEnd="url(#purple-arrow)" />
                <path d="M446 389 L154 389" stroke="#fa457c" strokeWidth="3" markerEnd="url(#pink-arrow)" />
                <path d="M154 413 L446 413" stroke="#9752ff" strokeWidth="3" markerEnd="url(#purple-arrow)" />

                <g
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                  style={{ paintOrder: "stroke", stroke: "#2d2d2d", strokeWidth: 5 }}
                >
                  <text fill="#d9b8ff">
                    <textPath href="#label-left-purple" startOffset="50%">
                      {locale === "zh" ? relationships[0].labelZh : relationships[0].labelEn}
                    </textPath>
                  </text>
                  <text fill="#ffb8cb">
                    <textPath href="#label-left-pink" startOffset="50%">
                      {locale === "zh" ? relationships[1].labelZh : relationships[1].labelEn}
                    </textPath>
                  </text>
                  <text fill="#ffb8cb">
                    <textPath href="#label-right-pink" startOffset="50%">
                      {locale === "zh" ? relationships[2].labelZh : relationships[2].labelEn}
                    </textPath>
                  </text>
                  <text fill="#d9b8ff">
                    <textPath href="#label-right-purple" startOffset="50%">
                      {locale === "zh" ? relationships[3].labelZh : relationships[3].labelEn}
                    </textPath>
                  </text>
                  <text fill="#ffb8cb">
                    <textPath href="#label-bottom-pink" startOffset="50%">
                      {locale === "zh" ? relationships[4].labelZh : relationships[4].labelEn}
                    </textPath>
                  </text>
                  <text fill="#d9b8ff">
                    <textPath href="#label-bottom-purple" startOffset="50%">
                      {locale === "zh" ? relationships[5].labelZh : relationships[5].labelEn}
                    </textPath>
                  </text>
                </g>
                </svg>

                <RoleFigure role="company" locale={locale} className="absolute left-1/2 top-0 h-[82px] -translate-x-1/2 sm:h-[116px]" />
                <RoleFigure role="user" locale={locale} className="absolute bottom-0 left-1 h-[92px] sm:left-5 sm:h-[128px]" />
                <RoleFigure role="hacker" locale={locale} className="absolute bottom-0 right-1 h-[92px] sm:right-5 sm:h-[128px]" />
              </div>
            </div>

          </div>

          <div>
            <h3 className="text-xl font-bold italic text-[#fa457c] sm:text-2xl">
              {isZh ? "胜利条件" : "Winning conditions"}
            </h3>
            <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {wins.map((item) => (
                <div
                  key={item.role}
                  className="grid grid-cols-[76px_1fr] items-center gap-4 py-5 sm:grid-cols-[112px_1fr] sm:gap-5 sm:py-6"
                >
                  <RoleFigure role={item.role} locale={locale} className="h-24 sm:h-32" />
                  <div>
                    <h4 className="text-base font-bold sm:text-lg">{roles[item.role][locale]}</h4>
                    <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-white/70 sm:mt-3 sm:space-y-2 sm:text-base">
                      {item[locale].map((line) => (
                        <li key={line} className="flex gap-2">
                          <span className="text-[#fa457c]">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-14 sm:mt-32 sm:pt-20">
          <h3 className="text-xl font-bold italic text-[#fa457c] sm:text-2xl">
            {isZh ? "玩法介绍" : "Gameplay setup"}
          </h3>

          <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-[1.7fr_0.78fr_0.78fr] lg:items-stretch">
            <section className="flex min-w-0 flex-col border border-white/15 p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <p className="font-semibold">
                  {isZh ? "人群阵营" : "Populace"}
                </p>
                <span className="font-mono text-xs text-white/35">01</span>
              </div>

              <div className="mt-5 grid flex-1 gap-5 md:mt-6 md:grid-cols-[1fr_auto_170px] md:items-center md:gap-6">
                <div>
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="min-w-0 overflow-hidden border border-[#f7aa3a]/70 p-2 sm:p-3">
                      <div className="relative mx-auto h-36 w-[103px] max-w-full sm:h-44 sm:w-[126px]">
                        <Image src="https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-card-user.92qu5zy035.webp" alt={isZh ? "网民身份卡" : "User role card"} fill sizes="(max-width: 639px) 103px, 126px" className="object-contain" />
                      </div>
                      <p className="mt-2 text-center text-xs sm:mt-3 sm:text-sm">{isZh ? "网民 2–3 人" : "Users, 2–3 players"}</p>
                    </div>
                    <div className="min-w-0 overflow-hidden border border-[#f7aa3a]/70 p-2 sm:p-3">
                      <div className="relative mx-auto h-36 w-[103px] max-w-full sm:h-44 sm:w-[126px]">
                        <Image src="https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-card-hacker.5flaih27lf.webp" alt={isZh ? "黑客身份卡" : "Hacker role card"} fill sizes="(max-width: 639px) 103px, 126px" className="object-contain" />
                      </div>
                      <p className="mt-2 text-center text-xs sm:mt-3 sm:text-sm">{isZh ? "黑客 1–2 人" : "Hackers, 1–2 players"}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-center text-xs leading-relaxed text-white/40">
                    {isZh ? "黑客以人群身份隐藏在游戏中" : "Hackers remain hidden among the populace"}
                  </p>
                </div>

                <div className="hidden text-3xl text-white/50 md:block">→</div>
                <div className="text-center text-2xl text-white/40 md:hidden">↓</div>

                <div className="mx-auto w-fit md:mx-0">
                  <p className="text-center text-xs text-white/50">
                    {isZh ? "初始信息块" : "Initial information"}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4">
                    <Token src="https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-token-user.96ag3qrh1m.webp" count="×9" alt={isZh ? "网民普通信息块" : "User information token"} />
                    <Token src="https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-token-user.96ag3qrh1m.webp" count="×3" alt={isZh ? "网民高级信息块" : "Advanced user information token"} outlined />
                    <Token src="https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-token-hacker.1hsx1trl6y.webp" count="×9" alt={isZh ? "黑客普通信息块" : "Hacker information token"} />
                    <Token src="https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-token-hacker.1hsx1trl6y.webp" count="×3" alt={isZh ? "黑客高级信息块" : "Advanced hacker information token"} outlined />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-x-5 text-center text-[11px] leading-tight text-white/45">
                    <span>{isZh ? "普通信息块" : "Standard"}</span>
                    <span>{isZh ? "高级信息块" : "Advanced"}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex min-w-0 flex-col border border-white/15 p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <p className="font-semibold">
                  {isZh ? "公司阵营" : "Company"}
                </p>
                <span className="font-mono text-xs text-white/35">02</span>
              </div>

              <div className="grid flex-1 grid-rows-[168px_44px_1fr] pt-5 sm:grid-rows-[196px_52px_1fr] sm:pt-6">
                <div className="flex items-start justify-center">
                  <div className="relative h-40 w-[114px] max-w-full sm:h-44 sm:w-[126px]">
                    <Image src="https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-card-company.491z9vdb05.webp" alt={isZh ? "公司身份卡" : "Company role card"} fill sizes="(max-width: 639px) 114px, 126px" className="object-contain" />
                  </div>
                </div>
                <p className="flex items-center justify-center text-center text-sm">
                  {isZh ? "公司 2–3 人" : "Companies, 2–3 players"}
                </p>

                <div className="border-t border-white/10 pt-5 text-center">
                  <p className="font-mono text-xs uppercase tracking-wider text-[#fa457c]">
                    {isZh ? "接收信息" : "Information intake"}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    {isZh ? "每回合接收人群阵营提交的一个信息块" : "Receive one information block from the populace each turn"}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-white/40">
                    {isZh
                      ? "类别由抽取的「隐私协议卡」决定"
                      : "The Privacy Agreement card determines its category"}
                  </p>
                </div>
              </div>
            </section>

            <section className="flex min-w-0 flex-col border border-white/15 p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <p className="font-semibold">
                  {isZh ? "局外人" : "Outsider"}
                </p>
                <span className="font-mono text-xs text-white/35">03</span>
              </div>

              <div className="grid flex-1 grid-rows-[168px_44px_1fr] pt-5 sm:grid-rows-[196px_52px_1fr] sm:pt-6">
                <div className="flex items-start justify-center">
                  <div className="relative h-40 w-[114px] max-w-full sm:h-44 sm:w-[126px]">
                    <Image src="https://github.com/gaogao0805/picx-images-hosting/raw/master/cyber-card-moderator.1lcizik9o2.webp" alt={isZh ? "智慧大脑主持人身份卡" : "Moderator role card"} fill sizes="(max-width: 639px) 114px, 126px" className="object-contain" />
                  </div>
                </div>
                <p className="flex items-center justify-center text-center text-sm">
                  {isZh ? "智慧大脑（主持人）" : "Wisdom Brain (moderator)"}
                </p>

                <div className="border-t border-white/10 pt-5 text-center">
                  <p className="font-mono text-xs uppercase tracking-wider text-[#fa457c]">
                    {isZh ? "主持与计分" : "Moderation & scoring"}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    {isZh
                      ? "不加入任何阵营，负责推进游戏流程并记录双方得分。"
                      : "Joins neither side, runs the game, and records both sides' scores."}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

function Token({
  src,
  count,
  alt,
  outlined = false,
}: {
  src: string;
  count: string;
  alt: string;
  outlined?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={src}
        alt={alt}
        width={166}
        height={168}
        className={`h-14 w-14 rounded-full ${outlined ? "ring-2 ring-black" : ""}`}
      />
      <span className="text-sm text-white/80">{count}</span>
    </div>
  );
}
