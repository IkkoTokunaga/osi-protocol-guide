"use client";

import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import {
  Antenna,
  Cable,
  ChevronsLeft,
  ChevronsRight,
  Layers3,
  Lock,
  Menu,
  Monitor,
  Router,
  Waves,
  X,
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
  glow: string;
  chipBg: string;
  memoBg: string;
};

const titleFont = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["700", "900"],
});

const themeById: Record<OsiLayer["id"], Theme> = {
  L7: {
    border: "border-red-400/40",
    activeBg: "bg-red-500/15",
    inactiveBg: "bg-white/5",
    hoverBg: "hover:bg-red-500/10",
    icon: "text-red-300",
    glow: "shadow-[0_0_0_1px_rgba(248,113,113,0.25),0_0_34px_rgba(248,113,113,0.18)]",
    chipBg: "bg-red-500/10",
    memoBg: "bg-red-500/5",
  },
  L6: {
    border: "border-violet-400/40",
    activeBg: "bg-violet-500/15",
    inactiveBg: "bg-white/5",
    hoverBg: "hover:bg-violet-500/10",
    icon: "text-violet-300",
    glow: "shadow-[0_0_0_1px_rgba(196,181,253,0.22),0_0_34px_rgba(139,92,246,0.18)]",
    chipBg: "bg-violet-500/10",
    memoBg: "bg-violet-500/5",
  },
  L5: {
    border: "border-cyan-400/35",
    activeBg: "bg-cyan-500/15",
    inactiveBg: "bg-white/5",
    hoverBg: "hover:bg-cyan-500/10",
    icon: "text-cyan-300",
    glow: "shadow-[0_0_0_1px_rgba(103,232,249,0.2),0_0_34px_rgba(34,211,238,0.18)]",
    chipBg: "bg-cyan-500/10",
    memoBg: "bg-cyan-500/5",
  },
  L4: {
    border: "border-blue-400/40",
    activeBg: "bg-blue-500/15",
    inactiveBg: "bg-white/5",
    hoverBg: "hover:bg-blue-500/10",
    icon: "text-blue-300",
    glow: "shadow-[0_0_0_1px_rgba(147,197,253,0.22),0_0_34px_rgba(59,130,246,0.18)]",
    chipBg: "bg-blue-500/10",
    memoBg: "bg-blue-500/5",
  },
  L3: {
    border: "border-emerald-400/40",
    activeBg: "bg-emerald-500/15",
    inactiveBg: "bg-white/5",
    hoverBg: "hover:bg-emerald-500/10",
    icon: "text-emerald-300",
    glow: "shadow-[0_0_0_1px_rgba(52,211,153,0.22),0_0_34px_rgba(16,185,129,0.18)]",
    chipBg: "bg-emerald-500/10",
    memoBg: "bg-emerald-500/5",
  },
  L2: {
    border: "border-amber-400/40",
    activeBg: "bg-amber-500/15",
    inactiveBg: "bg-white/5",
    hoverBg: "hover:bg-amber-500/10",
    icon: "text-amber-300",
    glow: "shadow-[0_0_0_1px_rgba(251,191,36,0.22),0_0_34px_rgba(245,158,11,0.18)]",
    chipBg: "bg-amber-500/10",
    memoBg: "bg-amber-500/5",
  },
  L1: {
    border: "border-zinc-300/45",
    activeBg: "bg-zinc-500/10",
    inactiveBg: "bg-white/5",
    hoverBg: "hover:bg-zinc-400/10",
    icon: "text-zinc-300",
    glow: "shadow-[0_0_0_1px_rgba(161,161,170,0.25),0_0_34px_rgba(82,82,91,0.18)]",
    chipBg: "bg-zinc-500/10",
    memoBg: "bg-zinc-500/5",
  },
};

export default function OsiExplorer({ layers }: { layers: OsiLayer[] }) {
  const layersById = useMemo(() => {
    const m = new Map<OsiLayer["id"], OsiLayer>();
    layers.forEach((l) => m.set(l.id, l));
    return m;
  }, [layers]);

  const [activeId, setActiveId] = useState<OsiLayer["id"]>(layers[0]?.id ?? "L7");
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const active = layersById.get(activeId) ?? layers[0];

  const theme = active ? themeById[active.id] : themeById.L7;
  const Icon = active ? iconById[active.id] : Monitor;
  const desktopSidebarWidthClass = desktopSidebarOpen ? "lg:pl-[22rem]" : "lg:pl-[6.5rem]";

  return (
    <main
      className={[
        "min-h-screen bg-[radial-gradient(circle_at_top,_#08152a,_#020617_60%)] px-4 py-8 text-slate-100 transition-[padding] sm:px-8",
        desktopSidebarWidthClass,
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => setMobileMenuOpen(true)}
        className="fixed left-3 top-3 z-50 rounded-xl border border-white/10 bg-slate-900/90 p-2.5 text-slate-100 shadow-lg backdrop-blur lg:hidden"
        aria-label="メニューを開く"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside
        className={[
          "fixed bottom-0 left-0 top-0 z-40 hidden border-r border-white/10 bg-slate-950/95 p-3 backdrop-blur lg:block",
          desktopSidebarOpen ? "w-80" : "w-20",
        ].join(" ")}
      >
        <div className="mb-3 flex items-center justify-between">
          {desktopSidebarOpen ? (
            <p className="pl-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200/90">
              Layers
            </p>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => setDesktopSidebarOpen((v) => !v)}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10"
            aria-label={desktopSidebarOpen ? "サイドバーを閉じる" : "サイドバーを開く"}
          >
            {desktopSidebarOpen ? (
              <ChevronsLeft className="h-4 w-4" />
            ) : (
              <ChevronsRight className="h-4 w-4" />
            )}
          </button>
        </div>
        <nav className="space-y-2">
          {layers.map((layer) => {
            const t = themeById[layer.id];
            const isActive = layer.id === activeId;
            const Ico = iconById[layer.id];
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveId(layer.id)}
                className={[
                  "group flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition",
                  isActive ? `${t.border} ${t.activeBg} ${t.glow}` : "border-white/10 bg-white/5",
                  !isActive ? t.hoverBg : "",
                  !desktopSidebarOpen ? "justify-center px-2" : "",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
                aria-label={`${layer.id} ${layer.title}`}
              >
                <Ico className={["mt-0.5 h-5 w-5", t.icon].join(" ")} />
                {desktopSidebarOpen ? (
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-bold tracking-wide">{layer.id}</p>
                      <p className="text-xs text-slate-400 group-hover:text-slate-300">
                        {layer.protocols.length} protos
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-slate-200">{layer.title}</p>
                  </div>
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="メニューを閉じる"
          />
          <aside className="absolute left-0 top-0 h-full w-80 max-w-[88vw] border-r border-white/10 bg-slate-950 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200/90">
                Layers
              </p>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300"
                aria-label="メニューを閉じる"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="space-y-2">
              {layers.map((layer) => {
                const t = themeById[layer.id];
                const isActive = layer.id === activeId;
                const Ico = iconById[layer.id];
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => {
                      setActiveId(layer.id);
                      setMobileMenuOpen(false);
                    }}
                    className={[
                      "group flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition",
                      isActive ? `${t.border} ${t.activeBg} ${t.glow}` : "border-white/10 bg-white/5",
                      !isActive ? t.hoverBg : "",
                    ].join(" ")}
                  >
                    <Ico className={["mt-0.5 h-5 w-5", t.icon].join(" ")} />
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm font-bold tracking-wide">{layer.id}</p>
                        <p className="text-xs text-slate-400 group-hover:text-slate-300">
                          {layer.protocols.length} protos
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-slate-200">{layer.title}</p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/90">
                OSI AT A GLANCE
              </p>
              <h1
                className={[
                  titleFont.className,
                  "mt-2 bg-gradient-to-r from-cyan-200 via-sky-300 to-violet-300 bg-clip-text text-3xl font-black tracking-[0.06em] text-transparent drop-shadow-[0_0_24px_rgba(34,211,238,0.28)] sm:text-5xl",
                ].join(" ")}
              >
                OSI参照モデル 図鑑
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
                左のレイヤーを選択すると、プロトコル/コマンド/メモを右側に表示します。
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-xs text-slate-300">
              Click a layer, debug faster.
            </div>
          </div>
        </header>

        <div className="grid gap-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:p-6">
            {active ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "flex h-12 w-12 items-center justify-center rounded-2xl border",
                        theme.border,
                        "bg-black/20",
                      ].join(" ")}
                    >
                      <Icon className={["h-6 w-6", theme.icon].join(" ")} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                        Selected Layer
                      </p>
                      <h2 className="text-2xl font-black tracking-tight">
                        {active.id}: {active.title}
                      </h2>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-300">
                    Debug color:{" "}
                    <span className="font-semibold text-slate-100">{active.id}</span>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
                  <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                    <h3 className="text-sm font-bold text-slate-200">プロトコル一覧</h3>
                    <p className="mt-2 text-xs text-slate-400">
                      {active.protocols.length} protocols
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {active.protocols.map((p) => (
                        <span
                          key={p}
                          className={[
                            "rounded-full border border-white/10 px-3 py-1 text-xs font-semibold",
                            theme.chipBg,
                          ].join(" ")}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                    <h3 className="text-sm font-bold text-slate-200">確認用コマンド</h3>
                    {active.commands.length > 0 ? (
                      <ul className="mt-3 space-y-2">
                        {active.commands.map((cmd) => (
                          <li key={cmd} className="text-sm text-slate-200">
                            <code className="rounded-md border border-white/10 bg-black/20 px-2 py-1 font-mono text-xs text-slate-100">
                              {cmd}
                            </code>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400">未設定</p>
                    )}
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-white/10 bg-black/15 p-4">
                  <h3 className="text-sm font-bold text-slate-200">
                    プロトコル詳細（アコーディオン）
                  </h3>
                  <div className="mt-3 space-y-2">
                    {active.protocolDetails.length > 0 ? (
                      active.protocolDetails.map((protocol) => (
                        <details
                          key={protocol.name}
                          className="group rounded-xl border border-white/10 bg-white/5 open:bg-white/10"
                        >
                          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-100 marker:content-none">
                            <span className="inline-flex items-center gap-2">
                              <span
                                className={["h-2.5 w-2.5 rounded-full", theme.chipBg].join(" ")}
                              />
                              {protocol.name}
                            </span>
                          </summary>
                          <div
                            className="osiMemo border-t border-white/10 px-4 py-3 text-sm text-slate-200"
                            dangerouslySetInnerHTML={{ __html: protocol.detailHtml }}
                          />
                        </details>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">
                        プロトコル詳細がまだありません。
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-white/10 bg-black/15 p-4">
                  <h3 className="text-sm font-bold text-slate-200">メモ</h3>
                  {active.memoHtml ? (
                    <div
                      className={[
                        "osiMemo mt-3 rounded-xl border border-white/10 p-4",
                        theme.memoBg,
                      ].join(" ")}
                      dangerouslySetInnerHTML={{ __html: active.memoHtml }}
                    />
                  ) : (
                    <p className="mt-3 text-sm text-slate-400">メモは未設定です。</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-slate-300">レイヤーを読み込み中です...</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

