プロジェクト要件定義書：個人用OSI参照モデル・プロトコル図鑑
プロジェクト概要
OSI参照モデルの各レイヤー（L1〜L7）に対応するプロトコル、Linuxコマンド、および実務上のトラブルシューティング事例を構造化して記録・閲覧するための個人用技術Wiki。学習のアウトプットと実務のリファレンスを兼ねる。
機能要件
2.1 レイヤー別ダッシュボード
階層構造の表示: L1からL7までのレイヤー番号と階層名称を縦に並べたナビゲーション。
L7: アプリケーション層 (Application Layer)
L6: プレゼンテーション層 (Presentation Layer)
L5: セッション層 (Session Layer)
L4: トランスポート層 (Transport Layer)
L3: ネットワーク層 (Network Layer)
L2: データリンク層 (Data Link Layer)
L1: 物理層 (Physical Layer)
詳細表示: 各レイヤーを選択した際、右側のメインエリアに以下の情報を表示する。
代表的なプロトコル: (例: L4ならTCP, UDP, ICMP)
確認用Linuxコマンド: 実務（Amazon Linux等）で使用するコマンド (例: ss, netstat, ip route, tcpdump)。
実務・学習メモ: 自由なMarkdown形式の記述。
2.2 コンテンツ管理
ファイルベース管理: 各レイヤーの内容は個別のMarkdownファイル（またはMDX）で管理し、エージェントやユーザーが直接ファイルを編集することで内容を更新できるようにする。
2.3 検索・フィルタリング
プロトコル名やコマンド名による簡易キーワード検索。
技術スタック
Frontend: Next.js (App Router)
Styling: Tailwind CSS
Icons: Lucide React (ネットワーク関連アイコンの利用)
Content Handling: Gray-matter (Markdownのメタデータ解析), Unified/Remark (Markdownレンダリング)
Deployment: Vercel またはローカルでの実行
UI/UX デザイン方針
2カラムレイアウト: 左側にOSI参照モデルの固定サイドバー、右側にコンテンツ表示エリア。
視覚的フィードバック: 現在学習・確認しているレイヤーが強調表示されること。
レスポンシブ: PCでの閲覧・編集をメインとするが、スマホでも確認可能なレイアウト。
ディレクトリ構成（案）
Plaintext
.
├── app/                # Next.js App Router
├── components/         # 共通UIコンポーネント
├── content/            # 各レイヤーのMarkdownファイル
│   ├── layer1.md
│   ├── layer2.md
│   └── ...
├── public/             # 静的資産
└── types/              # TypeScript型定義