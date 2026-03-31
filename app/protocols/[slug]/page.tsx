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
  const accentByLayer: Record<OsiLayerId, { soft: string; strong: string; title: string }> = {
    L7: { soft: "bg-rose-100", strong: "from-rose-500 to-pink-500", title: "text-rose-300" },
    L6: { soft: "bg-violet-100", strong: "from-violet-500 to-fuchsia-500", title: "text-violet-300" },
    L5: { soft: "bg-cyan-100", strong: "from-cyan-500 to-sky-500", title: "text-cyan-300" },
    L4: { soft: "bg-emerald-100", strong: "from-emerald-500 to-teal-500", title: "text-emerald-300" },
    L3: { soft: "bg-amber-100", strong: "from-amber-500 to-orange-500", title: "text-amber-300" },
    L2: { soft: "bg-orange-100", strong: "from-orange-500 to-red-500", title: "text-orange-300" },
    L1: { soft: "bg-zinc-200", strong: "from-zinc-500 to-slate-600", title: "text-zinc-200" },
  };
  const accent = accentByLayer[layer.id];
  const levelTone: Record<ChoiceQuiz["level"], string> = {
    基礎: "border-sky-300/40 bg-sky-500/10 text-sky-200",
    実務: "border-emerald-300/40 bg-emerald-500/10 text-emerald-200",
    試験頻出: "border-fuchsia-300/40 bg-fuchsia-500/10 text-fuchsia-200",
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,_#1e293b_0%,_#0b1220_45%,_#060b16_100%)] px-4 py-8 text-slate-100 sm:px-8">
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
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white/90 shadow-xl shadow-slate-950/20">
          <div className={["h-2 w-full bg-gradient-to-r", accent.strong].join(" ")} />
          <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600/90">
            OSI AT A GLANCE
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
            {layer.id} / {layer.title}
          </p>
          <h1 className={["mt-2 text-3xl font-black tracking-[0.06em] sm:text-4xl", accent.title].join(" ")}>
            {protocol.name} 深掘りガイド
          </h1>
          <p className="mt-3 text-sm text-slate-700">
            CCNA対策の観点と実運用での使い方をセットで確認し、試験と現場の両方で使える知識にします。
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-md border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            一覧へ戻る
          </Link>
        </div>
        </div>

        <section className="rounded-2xl border-2 border-slate-300 bg-white/90 p-6">
          <h2 className="text-lg font-bold text-slate-800">概要</h2>
          <div className="osiMemo mt-3 text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: protocol.detailHtml }} />
        </section>

        <section className="rounded-2xl border-2 border-slate-300 bg-white/90 p-6">
          <h2 className="text-lg font-bold text-slate-800">CCNA対策ポイント</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {ccnaPoints.map((point) => (
              <li key={point} className="rounded-md border border-slate-300 bg-slate-100/80 px-3 py-2">
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border-2 border-slate-300 bg-white/90 p-6">
          <h2 className="text-lg font-bold text-slate-800">実戦での使い方</h2>
          <div className="mt-3 space-y-3 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">障害兆候:</span>{" "}
              {protocol.practicalUse || "セッション異常・遅延・到達性の低下を観測したら、対象プロトコルの状態を優先的に確認します。"}
            </p>
            <p>
              <span className="font-semibold text-slate-900">確認ポイント:</span>{" "}
              {protocol.checkPoint || "状態・ログ・統計を1つずつ確認し、再現条件を狭めます。"}
            </p>
            <div>
              <p className="font-semibold text-slate-900">関連コマンド</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {layer.commands.map((cmd) => (
                  <li key={cmd} className="rounded border border-slate-300 bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                    {cmd}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border-2 border-slate-300 bg-white/90 p-6">
          <h2 className="text-lg font-bold text-slate-800">理解度チェック</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {quizzes.map((quiz, idx) => (
              <details
                key={quiz.question}
                className={[
                  "rounded-xl border border-slate-300 p-4 shadow-sm",
                  accent.soft,
                ].join(" ")}
              >
                <summary className="cursor-pointer text-sm font-semibold text-slate-800">
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
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {quiz.choices.map((choice) => (
                    <li key={choice.key}>
                      {choice.key}. {choice.text}
                    </li>
                  ))}
                </ul>
                <details className="mt-3 rounded-md border border-slate-300 bg-white/80 px-3 py-2">
                  <summary className="cursor-pointer text-xs font-semibold text-slate-700">
                    答えを見る
                  </summary>
                  <p className="mt-2 text-sm font-semibold text-emerald-700">答え: {quiz.answer}</p>
                  <p className="mt-1 text-sm text-slate-600">{quiz.explanation}</p>
                </details>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
