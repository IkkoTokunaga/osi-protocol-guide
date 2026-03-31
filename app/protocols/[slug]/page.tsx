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

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-sky-300">
            {layer.id} / {layer.title}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">{protocol.name}</h1>
          <p className="mt-3 text-sm text-slate-300">
            CCNA対策の観点と実運用での使い方をセットで確認し、試験と現場の両方で使える知識にします。
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-700"
          >
            一覧へ戻る
          </Link>
        </div>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
          <h2 className="text-lg font-bold text-sky-200">概要</h2>
          <div className="osiMemo mt-3 text-sm text-slate-200" dangerouslySetInnerHTML={{ __html: protocol.detailHtml }} />
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
          <h2 className="text-lg font-bold text-emerald-200">CCNA対策ポイント</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            {ccnaPoints.map((point) => (
              <li key={point} className="rounded-md border border-slate-700 bg-slate-800/70 px-3 py-2">
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
          <h2 className="text-lg font-bold text-amber-200">実戦での使い方</h2>
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

        <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
          <h2 className="text-lg font-bold text-fuchsia-200">理解度チェック</h2>
          <div className="mt-3 space-y-3">
            {quizzes.map((quiz, idx) => (
              <details key={quiz.question} className="rounded-md border border-slate-700 bg-slate-800/70 p-3">
                <summary className="cursor-pointer text-sm font-semibold text-slate-100">
                  Q{idx + 1}. {quiz.question}
                </summary>
                <ul className="mt-2 space-y-1 text-sm text-slate-300">
                  {quiz.choices.map((choice) => (
                    <li key={choice.key}>
                      {choice.key}. {choice.text}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-emerald-300">答え: {quiz.answer}</p>
                <p className="mt-1 text-sm text-slate-300">{quiz.explanation}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
