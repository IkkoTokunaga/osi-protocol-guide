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
  { gradient: string; subtitle: string }
> = {
  L7: {
    gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
    subtitle: "アプリケーションサービス",
  },
  L6: {
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    subtitle: "データの表現、暗号化",
  },
  L5: {
    gradient: "from-sky-500 via-blue-500 to-cyan-500",
    subtitle: "セッション管理",
  },
  L4: {
    gradient: "from-lime-500 via-green-500 to-emerald-500",
    subtitle: "信頼性の高い通信",
  },
  L3: {
    gradient: "from-amber-400 via-yellow-400 to-orange-400",
    subtitle: "ルーティング、経路選択",
  },
  L2: {
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    subtitle: "隣接ノード間の通信",
  },
  L1: {
    gradient: "from-rose-500 via-red-500 to-orange-500",
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff,_#f8fafc_50%,_#eef2ff)] px-4 py-8 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-700/80">
                OSI AT A GLANCE
              </p>
              <h1
                className={[
                  titleFont.className,
                  "mt-2 bg-gradient-to-r from-sky-600 via-blue-600 to-violet-600 bg-clip-text text-3xl font-black tracking-[0.06em] text-transparent sm:text-5xl",
                ].join(" ")}
              >
                OSI参照モデル 図鑑
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
                レイヤーを選択すると、下にプロトコル/コマンド/メモを表示します。
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
              Click a layer, learn faster.
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6">
            <div className="mx-auto w-full max-w-4xl">
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
                      className="rounded-xl border border-slate-200 bg-white"
                    >
                      <summary className="list-none p-0 marker:content-none">
                        <button
                          type="button"
                          onClick={() => toggleLayer(layer.id)}
                          aria-label={`${layer.id} ${layer.title}`}
                          className={[
                            "group flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-white transition sm:px-6",
                            "bg-gradient-to-r",
                            visual.gradient,
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
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
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

                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h3 className="text-sm font-bold text-slate-700">確認用コマンド</h3>
                            {layer.commands.length > 0 ? (
                              <ul className="mt-3 space-y-2">
                                {layer.commands.map((cmd) => (
                                  <li key={cmd} className="text-sm text-slate-700">
                                    <code className="rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-800">
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

                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <h3 className="text-sm font-bold text-slate-700">プロトコル詳細（アコーディオン）</h3>
                          <div className="mt-3 space-y-2">
                            {layer.protocolDetails.length > 0 ? (
                              layer.protocolDetails.map((protocol) => (
                                <details
                                  key={protocol.name}
                                  className="group rounded-xl border border-slate-200 bg-white open:bg-slate-50"
                                >
                                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-700 marker:content-none">
                                    <span className="inline-flex items-center gap-2">
                                      <span
                                        className={[
                                          "h-2.5 w-2.5 rounded-full",
                                          layerTheme.chipBg,
                                        ].join(" ")}
                                      />
                                      {protocol.name}
                                    </span>
                                  </summary>
                                  <div
                                    className="osiMemo border-t border-slate-200 px-4 py-3 text-sm text-slate-700"
                                    dangerouslySetInnerHTML={{ __html: protocol.detailHtml }}
                                  />
                                </details>
                              ))
                            ) : (
                              <p className="text-sm text-slate-500">プロトコル詳細がまだありません。</p>
                            )}
                          </div>
                        </div>

                          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h3 className="text-sm font-bold text-slate-700">メモ</h3>
                            {layer.memoHtml ? (
                              <div
                                className={[
                                  "osiMemo mt-3 rounded-xl border border-slate-200 p-4 text-slate-700",
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
          </div>
        </header>
      </div>
    </main>
  );
}

