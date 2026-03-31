"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import {
  Antenna,
  Cable,
  ChevronDown,
  Layers3,
  Lock,
  Monitor,
  Router,
  Waves,
} from "lucide-react";

export type OsiLayer = {
  id: "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "L7";
  title: string;
  protocols: string[];
  commands: string[];
  protocolDetails: Array<{
    name: string;
    detailHtml: string;
  }>;
  memoHtml: string;
};

const iconById: Record<
  OsiLayer["id"],
  ComponentType<{ className?: string }>
> = {
    L7: Monitor,
    L6: Lock,
    L5: Layers3,
    L4: Waves,
    L3: Router,
    L2: Cable,
    L1: Antenna,
};

type Theme = {
  border: string;
  activeBg: string;
  inactiveBg: string;
  hoverBg: string;
  icon: string;
  chipBg: string;
  memoBg: string;
};

const titleFont = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const themeById: Record<OsiLayer["id"], Theme> = {
  L7: {
    border: "border-rose-200",
    activeBg: "bg-rose-50",
    inactiveBg: "bg-white",
    hoverBg: "hover:bg-rose-50",
    icon: "text-rose-500",
    chipBg: "bg-rose-100",
    memoBg: "bg-rose-50/70",
  },
  L6: {
    border: "border-violet-200",
    activeBg: "bg-violet-50",
    inactiveBg: "bg-white",
    hoverBg: "hover:bg-violet-50",
    icon: "text-violet-500",
    chipBg: "bg-violet-100",
    memoBg: "bg-violet-50/70",
  },
  L5: {
    border: "border-cyan-200",
    activeBg: "bg-cyan-50",
    inactiveBg: "bg-white",
    hoverBg: "hover:bg-cyan-50",
    icon: "text-cyan-600",
    chipBg: "bg-cyan-100",
    memoBg: "bg-cyan-50/70",
  },
  L4: {
    border: "border-blue-200",
    activeBg: "bg-blue-50",
    inactiveBg: "bg-white",
    hoverBg: "hover:bg-blue-50",
    icon: "text-blue-600",
    chipBg: "bg-blue-100",
    memoBg: "bg-blue-50/70",
  },
  L3: {
    border: "border-emerald-200",
    activeBg: "bg-emerald-50",
    inactiveBg: "bg-white",
    hoverBg: "hover:bg-emerald-50",
    icon: "text-emerald-600",
    chipBg: "bg-emerald-100",
    memoBg: "bg-emerald-50/70",
  },
  L2: {
    border: "border-amber-200",
    activeBg: "bg-amber-50",
    inactiveBg: "bg-white",
    hoverBg: "hover:bg-amber-50",
    icon: "text-amber-600",
    chipBg: "bg-amber-100",
    memoBg: "bg-amber-50/70",
  },
  L1: {
    border: "border-zinc-200",
    activeBg: "bg-zinc-100",
    inactiveBg: "bg-white",
    hoverBg: "hover:bg-zinc-100",
    icon: "text-zinc-600",
    chipBg: "bg-zinc-200",
    memoBg: "bg-zinc-100/70",
  },
};

const layerVisualById: Record<
  OsiLayer["id"],
  { bg: string; subtitle: string }
> = {
  L7: {
    bg: "bg-rose-500",
    subtitle: "アプリケーションサービス",
  },
  L6: {
    bg: "bg-violet-500",
    subtitle: "データの表現、暗号化",
  },
  L5: {
    bg: "bg-cyan-500",
    subtitle: "セッション管理",
  },
  L4: {
    bg: "bg-emerald-500",
    subtitle: "信頼性の高い通信",
  },
  L3: {
    bg: "bg-amber-500",
    subtitle: "ルーティング、経路選択",
  },
  L2: {
    bg: "bg-orange-500",
    subtitle: "隣接ノード間の通信",
  },
  L1: {
    bg: "bg-red-500",
    subtitle: "電気・物理的な接続",
  },
};

export default function OsiExplorer({ layers }: { layers: OsiLayer[] }) {
  const [openLayerIds, setOpenLayerIds] = useState<Set<OsiLayer["id"]>>(new Set());

  const toggleLayer = (id: OsiLayer["id"]) => {
    setOpenLayerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,_#1e293b_0%,_#0b1220_45%,_#060b16_100%)] px-4 py-8 text-slate-100 sm:px-8">
      <div aria-hidden="true" className="packetField">
        <svg className="packetSvg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="packetOrb" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </radialGradient>
          </defs>
          <path id="traceA" className="packetLine" d="M0 84 H150 V52 H260 V0" />
          <path id="traceB" className="packetLine" d="M0 156 H120 V196 H290 V246 H390 V362 H620" />
          <path id="traceC" className="packetLine" d="M1200 116 H1040 V86 H890 V0" />
          <path id="traceD" className="packetLine" d="M1200 236 H1110 V270 H960 V356 H910 V520" />
          <path id="traceE" className="packetLine" d="M0 300 H80 V340 H190 V500 H240 V640 H430" />
          <path id="traceF" className="packetLine" d="M1200 342 H980 V318 H860 V254 H740 V190 H540" />
          <path id="traceG" className="packetLine" d="M0 446 H170 V490 H320 V620 H360 V750 H620" />
          <path id="traceH" className="packetLine" d="M1200 492 H1080 V530 H930 V660 H880 V780 H690" />
          <path id="traceI" className="packetLine" d="M0 586 H60 V544 H160 V476 H220 V410 H300" />
          <path id="traceJ" className="packetLine" d="M1200 628 H1140 V596 H1060 V520 H1000 V430 H900" />
          <path id="traceK" className="packetLine" d="M460 0 V88 H520 V142 H600 V210 H660 V390" />
          <path id="traceL" className="packetLine" d="M580 800 V736 H650 V700 H760 V650 H840 V520" />
          <path id="traceM" className="packetLine" d="M760 0 V56 H820 V110 H910 V160 H1000 V290" />
          <path id="traceN" className="packetLine" d="M260 800 V748 H330 V720 H410 V660 H460 V560" />

          <circle className="packetRunner" r="6" fill="url(#packetOrb)">
            <animateMotion dur="20s" begin="-3.8s" repeatCount="indefinite">
              <mpath href="#traceA" />
            </animateMotion>
          </circle>
          <circle className="packetRunner" r="6" fill="url(#packetOrb)">
            <animateMotion dur="23s" begin="-11.4s" repeatCount="indefinite">
              <mpath href="#traceC" />
            </animateMotion>
          </circle>
          <circle className="packetRunner" r="6" fill="url(#packetOrb)">
            <animateMotion dur="24s" begin="-6.2s" repeatCount="indefinite">
              <mpath href="#traceE" />
            </animateMotion>
          </circle>
          <circle className="packetRunner" r="6" fill="url(#packetOrb)">
            <animateMotion dur="26s" begin="-14.7s" repeatCount="indefinite">
              <mpath href="#traceH" />
            </animateMotion>
          </circle>
          <circle className="packetRunner" r="6" fill="url(#packetOrb)">
            <animateMotion dur="18s" begin="-9.1s" repeatCount="indefinite">
              <mpath href="#traceK" />
            </animateMotion>
          </circle>
          <circle className="packetRunner" r="6" fill="url(#packetOrb)">
            <animateMotion dur="22s" begin="-12.6s" repeatCount="indefinite">
              <mpath href="#traceL" />
            </animateMotion>
          </circle>
        </svg>
      </div>
      <div className="mx-auto max-w-7xl">
        <header className="relative z-10 mb-6 rounded-2xl bg-transparent p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/90">
              OSI AT A GLANCE
            </p>
            <h1
              className={[
                titleFont.className,
                "mt-2 text-3xl font-black tracking-[0.06em] text-slate-100 sm:text-5xl",
              ].join(" ")}
            >
              OSI参照モデル 図鑑
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
              レイヤーを選択すると、下にプロトコル/コマンド/メモを表示します。
            </p>
          </div>

          <div className="mt-6">
            <div className="space-y-3">
              {layers.map((layer) => {
                const visual = layerVisualById[layer.id];
                const selected = openLayerIds.has(layer.id);
                const layerTheme = themeById[layer.id];
                const LayerIcon = iconById[layer.id];
                return (
                  <details
                    key={`hero-${layer.id}`}
                    open={selected}
                    className="rounded-xl border-2 border-slate-300 bg-white/72"
                  >
                    <summary className="list-none p-0 marker:content-none">
                      <button
                        type="button"
                        onClick={() => toggleLayer(layer.id)}
                        aria-label={`${layer.id} ${layer.title}`}
                        className={[
                          "group flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-white transition sm:px-6",
                          visual.bg,
                          selected
                            ? "border-white/80"
                            : "border-white/40",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <LayerIcon className="h-5 w-5 text-white" />
                          <div>
                            <p
                              className={[
                                titleFont.className,
                                "text-xl font-black tracking-wide sm:text-3xl",
                              ].join(" ")}
                            >
                              {layer.title}
                            </p>
                            <p className="text-xs font-semibold tracking-wide text-white/90 sm:text-sm">
                              {visual.subtitle}
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          className={[
                            "h-4.5 w-4.5 rounded-md bg-white/25 p-0.5 text-white transition-transform duration-200 group-hover:bg-white/35",
                            selected ? "rotate-180" : "rotate-0",
                          ].join(" ")}
                          aria-hidden="true"
                        />
                      </button>
                    </summary>

                      {selected ? (
                        <div className="p-4 sm:p-5">
                          <h2 className="text-2xl font-black tracking-tight text-slate-800">
                            {layer.id}: {layer.title}
                          </h2>

                        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
                          <div className="rounded-xl border-2 border-slate-300 bg-slate-50/80 p-4">
                            <h3 className="text-sm font-bold text-slate-700">プロトコル一覧</h3>
                            <p className="mt-2 text-xs text-slate-500">{layer.protocols.length} protocols</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {layer.protocols.map((p) => (
                                <span
                                  key={p}
                                  className={[
                                    "rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700",
                                    layerTheme.chipBg,
                                  ].join(" ")}
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-xl border-2 border-slate-300 bg-slate-50/80 p-4">
                            <h3 className="text-sm font-bold text-slate-700">確認用コマンド</h3>
                            {layer.commands.length > 0 ? (
                              <ul className="mt-3 space-y-2">
                                {layer.commands.map((cmd) => (
                                  <li key={cmd} className="text-sm text-slate-700">
                                    <code className="rounded-md border border-slate-300 bg-white px-2 py-1 font-mono text-xs text-slate-800">
                                      {cmd}
                                    </code>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-slate-500">未設定</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 rounded-xl border-2 border-slate-300 bg-slate-50/80 p-4">
                          <h3 className="text-sm font-bold text-slate-700">プロトコル詳細（アコーディオン）</h3>
                          <div className="mt-3 space-y-2">
                            {layer.protocolDetails.length > 0 ? (
                              layer.protocolDetails.map((protocol) => (
                                <details
                                  key={protocol.name}
                                  className="group rounded-xl border-2 border-slate-300 bg-white/85 open:bg-slate-50/80"
                                >
                                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-700 marker:content-none">
                                    <span className="flex items-center justify-between gap-3">
                                      <span className="inline-flex items-center gap-2">
                                        <span
                                          className={[
                                            "h-2.5 w-2.5 rounded-full",
                                            layerTheme.chipBg,
                                          ].join(" ")}
                                        />
                                        {protocol.name}
                                      </span>
                                      <span
                                        className={[
                                          "inline-flex h-5 w-5 items-center justify-center rounded-md border border-slate-300 bg-white/70 transition-transform duration-200",
                                          "group-open:rotate-180",
                                        ].join(" ")}
                                      >
                                        <ChevronDown className="h-3.5 w-3.5 text-slate-600" />
                                      </span>
                                    </span>
                                  </summary>
                                  <div
                                    className="osiMemo border-t border-slate-300 px-4 py-3 text-sm text-slate-700"
                                    dangerouslySetInnerHTML={{ __html: protocol.detailHtml }}
                                  />
                                </details>
                              ))
                            ) : (
                              <p className="text-sm text-slate-500">プロトコル詳細がまだありません。</p>
                            )}
                          </div>
                        </div>

                          <div className="mt-4 rounded-xl border-2 border-slate-300 bg-slate-50/80 p-4">
                            <h3 className="text-sm font-bold text-slate-700">メモ</h3>
                            {layer.memoHtml ? (
                              <div
                                className={[
                                  "osiMemo mt-3 rounded-xl border-2 border-slate-300 p-4 text-slate-700",
                                  layerTheme.memoBg,
                                ].join(" ")}
                                dangerouslySetInnerHTML={{ __html: layer.memoHtml }}
                              />
                            ) : (
                              <p className="mt-3 text-sm text-slate-500">メモは未設定です。</p>
                            )}
                          </div>
                        </div>
                      ) : null}
                  </details>
                );
              })}
            </div>
          </div>
        </header>
      </div>
    </main>
  );
}

