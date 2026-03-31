import Link from "next/link";
import { notFound } from "next/navigation";

import { findProtocolBySlug, loadOsiLayers, type OsiLayerId } from "@/lib/osiContent";

function ccnaByLayer(layerId: OsiLayerId): string[] {
  const base: Record<OsiLayerId, string[]> = {
    L7: [
      "アプリ障害時は DNS -> HTTP/HTTPS -> 認証の順で切り分ける。",
      "HTTPステータスコードと原因を結び付けて覚える（4xx=クライアント、5xx=サーバー）。",
    ],
    L6: [
      "TLSハンドシェイク失敗時は証明書有効期限・SAN・SNIを必ず確認する。",
      "暗号化の成否はアプリより下位で起きるため、L4疎通成功でも通信失敗は起きうる。",
    ],
    L5: [
      "セッション確立・維持・再接続の3フェーズで障害を分類する。",
      "VoIPやRPCではタイムアウト・再送挙動の理解が設計/運用に直結する。",
    ],
    L4: [
      "TCPの3-way handshakeと再送の見方はCCNA頻出かつ実務でも必須。",
      "UDP系トラフィックはアプリ実装依存なので、到達確認と再送制御を分けて考える。",
    ],
    L3: [
      "経路選択は Longest Prefix Match -> AD -> Metric の順で判断する。",
      "疎通障害はホスト -> GW -> 宛先の順に調査する。",
    ],
    L2: [
      "Access/Trunk、VLAN、STP の関係を図で説明できる状態にする。",
      "L2ループ時の症状（ブロードキャストストーム）と防止策（STP）をセットで押さえる。",
    ],
    L1: [
      "物理リンク障害は上位層を偽装するため、最初にリンク状態とエラーカウンタを確認する。",
      "speed/duplex ミスマッチとケーブル品質不良は典型トラブルとして覚える。",
    ],
  };
  return base[layerId];
}

type Choice = { key: "A" | "B" | "C" | "D"; text: string };
type ChoiceQuiz = {
  level: "基礎" | "実務" | "試験頻出";
  question: string;
  choices: Choice[];
  answer: "A" | "B" | "C" | "D";
  explanation: string;
};

function makeQuiz(
  protocolName: string,
  role: string,
  checkPoint: string,
  practicalUse: string,
): ChoiceQuiz[] {
  const fallbackRole = role || "通信の確立・転送・保護の成立";
  const fallbackCheck = checkPoint || "基本ステータス（到達性・状態・エラー）";
  const fallbackUse = practicalUse || "障害時のログと統計の相関確認";

  return [
    {
      level: "基礎",
      question: `${protocolName} の確認で最初に見るべきポイントとして最も適切なのはどれ？`,
      choices: [
        { key: "A", text: fallbackCheck },
        { key: "B", text: "まずアプリのUI配色を確認する" },
        { key: "C", text: "最初に物理配線を全交換する" },
        { key: "D", text: "ログを見ずに再起動する" },
      ],
      answer: "A",
      explanation: "最初は役割に直結する観測点（状態/エラー/統計）から確認するのが最短です。",
    },
    {
      level: "基礎",
      question: `${protocolName} が原因かを切り分けるとき、優先すべき観点はどれ？`,
      choices: [
        { key: "A", text: "端末名のアルファベット順" },
        { key: "B", text: "障害報告の時刻順のみ" },
        { key: "C", text: `「${fallbackRole}」が成立しているか` },
        { key: "D", text: "機器の購入価格順" },
      ],
      answer: "C",
      explanation: "プロトコルの役割が満たせているかを基準にすると切り分けが安定します。",
    },
    {
      level: "実務",
      question: `${protocolName} の実戦運用で有効な初動はどれ？`,
      choices: [
        { key: "A", text: "設定変更を先に大量投入する" },
        { key: "B", text: fallbackUse },
        { key: "C", text: "監視アラートを無効化する" },
        { key: "D", text: "関連しない層だけ確認する" },
      ],
      answer: "B",
      explanation: "兆候と関連ログを結びつけ、再現条件を狭める初動が有効です。",
    },
    {
      level: "試験頻出",
      question: `CCNA対策として ${protocolName} を学ぶ際、効果的な進め方はどれ？`,
      choices: [
        { key: "A", text: "用語だけ暗記して挙動は見ない" },
        { key: "B", text: "コマンド出力を見ずに丸暗記する" },
        { key: "C", text: "問題演習のみを繰り返す" },
        { key: "D", text: "役割・確認コマンド・障害時の症状をセットで覚える" },
      ],
      answer: "D",
      explanation: "試験と実務の両方に効くのは、役割と観測ポイントを紐づけた理解です。",
    },
  ];
}

export async function generateStaticParams() {
  const layers = await loadOsiLayers();
  return layers.flatMap((layer) => layer.protocolDetails.map((p) => ({ slug: p.slug })));
}

export default async function ProtocolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await findProtocolBySlug(slug);
  if (!found) {
    notFound();
  }

  const { layer, protocol } = found;
  const ccnaPoints = [
    ...ccnaByLayer(layer.id),
    ...(protocol.ccnaFocus ? [`${protocol.name}: ${protocol.ccnaFocus}`] : []),
  ];
  const quizzes = makeQuiz(
    protocol.name,
    protocol.role,
    protocol.checkPoint,
    protocol.practicalUse,
  );
  const accentByLayer: Record<
    OsiLayerId,
    {
      solid: string;
      heroGlow: string;
      chip: string;
      cardRing: string;
      quizSoft: string;
      title: string;
    }
  > = {
    L7: {
      solid: "bg-rose-500",
      heroGlow: "shadow-rose-500/25",
      chip: "bg-rose-500/20 text-rose-200 border-rose-300/40",
      cardRing: "border-rose-300/30",
      quizSoft: "bg-rose-500/10",
      title: "text-rose-200",
    },
    L6: {
      solid: "bg-violet-500",
      heroGlow: "shadow-violet-500/25",
      chip: "bg-violet-500/20 text-violet-200 border-violet-300/40",
      cardRing: "border-violet-300/30",
      quizSoft: "bg-violet-500/10",
      title: "text-violet-200",
    },
    L5: {
      solid: "bg-cyan-500",
      heroGlow: "shadow-cyan-500/25",
      chip: "bg-cyan-500/20 text-cyan-200 border-cyan-300/40",
      cardRing: "border-cyan-300/30",
      quizSoft: "bg-cyan-500/10",
      title: "text-cyan-200",
    },
    L4: {
      solid: "bg-emerald-500",
      heroGlow: "shadow-emerald-500/25",
      chip: "bg-emerald-500/20 text-emerald-200 border-emerald-300/40",
      cardRing: "border-emerald-300/30",
      quizSoft: "bg-emerald-500/10",
      title: "text-emerald-200",
    },
    L3: {
      solid: "bg-amber-500",
      heroGlow: "shadow-amber-500/25",
      chip: "bg-amber-500/20 text-amber-100 border-amber-300/40",
      cardRing: "border-amber-300/30",
      quizSoft: "bg-amber-500/10",
      title: "text-amber-100",
    },
    L2: {
      solid: "bg-orange-500",
      heroGlow: "shadow-orange-500/25",
      chip: "bg-orange-500/20 text-orange-100 border-orange-300/40",
      cardRing: "border-orange-300/30",
      quizSoft: "bg-orange-500/10",
      title: "text-orange-100",
    },
    L1: {
      solid: "bg-red-500",
      heroGlow: "shadow-zinc-500/25",
      chip: "bg-zinc-500/20 text-zinc-100 border-zinc-300/40",
      cardRing: "border-zinc-300/30",
      quizSoft: "bg-zinc-500/10",
      title: "text-zinc-100",
    },
  };
  const accent = accentByLayer[layer.id];
  const levelTone: Record<ChoiceQuiz["level"], string> = {
    基礎: "border-sky-300/40 bg-sky-500/10 text-sky-200",
    実務: "border-emerald-300/40 bg-emerald-500/10 text-emerald-200",
    試験頻出: "border-fuchsia-300/40 bg-fuchsia-500/10 text-fuchsia-200",
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,_#1e293b_0%,_#0b1220_45%,_#060b16_100%)] px-2 py-8 text-slate-100 sm:px-8">
      <div aria-hidden="true" className="packetField">
        <svg className="packetSvg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="packetOrbDetail" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </radialGradient>
          </defs>
          <path id="detailTraceA" className="packetLine" d="M0 124 H180 V64 H320 V0" />
          <path id="detailTraceB" className="packetLine" d="M1200 226 H980 V202 H790 V320 H610" />
          <path id="detailTraceC" className="packetLine" d="M0 470 H130 V520 H360 V700 H560" />
          <path id="detailTraceD" className="packetLine" d="M1200 560 H1080 V600 H900 V780 H680" />
          <circle className="packetRunner" r="6" fill="url(#packetOrbDetail)">
            <animateMotion dur="20s" begin="-4.2s" repeatCount="indefinite">
              <mpath href="#detailTraceA" />
            </animateMotion>
          </circle>
          <circle className="packetRunner" r="6" fill="url(#packetOrbDetail)">
            <animateMotion dur="24s" begin="-10.7s" repeatCount="indefinite">
              <mpath href="#detailTraceB" />
            </animateMotion>
          </circle>
          <circle className="packetRunner" r="6" fill="url(#packetOrbDetail)">
            <animateMotion dur="22s" begin="-8.1s" repeatCount="indefinite">
              <mpath href="#detailTraceC" />
            </animateMotion>
          </circle>
        </svg>
      </div>
      <div className="mx-auto max-w-6xl space-y-6">
        <div
          className={[
            "rounded-2xl border border-white/25 px-3 py-2.5 text-white shadow-lg sm:px-5 sm:py-3",
            accent.solid,
          ].join(" ")}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">
            Current OSI Layer
          </p>
          <p className="mt-1 text-xl font-black tracking-wide sm:text-2xl">
            {layer.id}: {layer.title}
          </p>
        </div>

        <header
          className={[
            "overflow-hidden rounded-3xl border border-white/20 bg-slate-900/70 backdrop-blur-md shadow-2xl",
            accent.heroGlow,
          ].join(" ")}
        >
          <div className={["h-1.5 w-full", accent.solid].join(" ")} />
          <div className="p-4 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/90">
              OSI AT A GLANCE
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={["rounded-full border px-2.5 py-1 text-xs font-semibold", accent.chip].join(" ")}>
                {layer.id}
              </span>
              <span className="rounded-full border border-slate-600 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300">
                {layer.title}
              </span>
            </div>
            <h1 className={["mt-4 text-3xl font-black tracking-[0.06em] sm:text-5xl", accent.title].join(" ")}>
              {protocol.name}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
              CCNA対策と実務トラブルシュートを一画面で往復できるように、要点・運用・演習を再構成しています。
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex rounded-lg border border-slate-500 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:bg-slate-700"
            >
              一覧へ戻る
            </Link>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <section className={["rounded-2xl border bg-slate-900/75 p-3.5 backdrop-blur-sm sm:p-5", accent.cardRing].join(" ")}>
              <h2 className="text-lg font-bold text-slate-100">概要</h2>
              <div className="osiMemo mt-3 text-sm text-slate-200" dangerouslySetInnerHTML={{ __html: protocol.detailHtml }} />
            </section>

            <section className={["rounded-2xl border bg-slate-900/75 p-3.5 backdrop-blur-sm sm:p-5", accent.cardRing].join(" ")}>
              <h2 className="text-lg font-bold text-slate-100">CCNA対策ポイント</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                {ccnaPoints.map((point) => (
                  <li key={point} className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2">
                    {point}
                  </li>
                ))}
              </ul>
            </section>

            <section className={["rounded-2xl border bg-slate-900/75 p-3.5 backdrop-blur-sm sm:p-5", accent.cardRing].join(" ")}>
              <h2 className="text-lg font-bold text-slate-100">実戦での使い方</h2>
              <div className="mt-3 space-y-3 text-sm text-slate-200">
                <p>
                  <span className="font-semibold text-white">障害兆候:</span>{" "}
                  {protocol.practicalUse || "セッション異常・遅延・到達性の低下を観測したら、対象プロトコルの状態を優先的に確認します。"}
                </p>
                <p>
                  <span className="font-semibold text-white">確認ポイント:</span>{" "}
                  {protocol.checkPoint || "状態・ログ・統計を1つずつ確認し、再現条件を狭めます。"}
                </p>
                <div>
                  <p className="font-semibold text-white">関連コマンド</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {layer.commands.map((cmd) => (
                      <li key={cmd} className="rounded border border-slate-600 bg-slate-800 px-2 py-1 font-mono text-xs text-slate-200">
                        {cmd}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <section className={["rounded-2xl border bg-slate-900/75 p-3.5 backdrop-blur-sm sm:p-5", accent.cardRing].join(" ")}>
            <h2 className="text-lg font-bold text-slate-100">理解度チェック</h2>
            <p className="mt-1 text-xs text-slate-400">問題を開いて選択肢を確認し、答えは「答えを見る」で表示します。</p>
            <div className="mt-3 space-y-3">
              {quizzes.map((quiz, idx) => (
                <details
                  key={quiz.question}
                  className={[
                    "rounded-xl border border-slate-600/80 p-4 shadow-sm",
                    accent.quizSoft,
                  ].join(" ")}
                >
                  <summary className="cursor-pointer text-sm font-semibold text-slate-100">
                    <span
                      className={[
                        "mr-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                        levelTone[quiz.level],
                      ].join(" ")}
                    >
                      {quiz.level}
                    </span>
                    Q{idx + 1}. {quiz.question}
                  </summary>
                  <ul className="mt-2 space-y-1 text-sm text-slate-200">
                    {quiz.choices.map((choice) => (
                      <li key={choice.key}>
                        {choice.key}. {choice.text}
                      </li>
                    ))}
                  </ul>
                  <details className="mt-3 rounded-md border border-slate-500 bg-slate-900/70 px-3 py-2">
                    <summary className="cursor-pointer text-xs font-semibold text-slate-200">
                      答えを見る
                    </summary>
                    <p className="mt-2 text-sm font-semibold text-emerald-300">答え: {quiz.answer}</p>
                    <p className="mt-1 text-sm text-slate-300">{quiz.explanation}</p>
                  </details>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
