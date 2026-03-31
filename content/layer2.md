---
layer: 2
title: データリンク層
layerId: L2
protocols:
  - Ethernet II
  - VLAN (802.1Q)
  - STP/RSTP
  - LACP (802.3ad)
  - PPP
commands:
  - ip -d link show <iface>
  - bridge link show
  - bridge vlan show
  - tcpdump -e -i <iface>
---

## 主要プロトコル詳細

### Ethernet II
- **役割**: L2フレームの基本フォーマット（Dst MAC/Src MAC/EtherType/Payload）。
- **実務での見どころ**: MAC重複、未知ユニキャスト増加、ブロードキャスト過多。
- **確認ポイント**: `tcpdump -e` で MAC と EtherType を直接確認。
- **CCNA頻出**: EtherType の意味（`0x0800=IPv4`, `0x86dd=IPv6`, `0x0806=ARP`）。

### VLAN (IEEE 802.1Q)
- **役割**: 論理的にL2セグメントを分離するタグ方式。
- **実務での見どころ**: native VLAN 不一致、trunk 許可VLAN漏れ。
- **確認ポイント**: タグ有無、tagged/untagged の設計一致。
- **CCNA頻出**: Access/Trunkの違い、native VLANの扱い、Inter-VLAN Routingの前提。

### STP / RSTP
- **役割**: L2ループを防ぐために冗長リンクを制御。
- **実務での見どころ**: ルートブリッジ意図せぬ変更、収束遅延。
- **確認ポイント**: BPDU受信状況、ポートロール（Root/Designated/Blocked）。
- **CCNA頻出**: Root Bridge選出、PortFast/BPDU Guardの用途、RSTPによる収束改善。

### LACP (802.3ad)
- **役割**: 複数リンクを束ねて冗長化/帯域拡張（EtherChannel）。
- **実務での見どころ**: 片側 active/passive 不一致、ハッシュ偏り。
- **確認ポイント**: メンバーリンク状態、LACPDU交換。
- **CCNA頻出**: PAgPとの違い、チャネル不整合時の症状（片方向通信/不安定化）。

### PPP
- **役割**: Point-to-Point 回線でのカプセル化・認証制御。
- **実務での見どころ**: 認証方式不一致（PAP/CHAP）、MTU問題。
- **確認ポイント**: セッション確立ログ、再ネゴシエーション頻度。
- **CCNA頻出**: PAP/CHAPの違い（平文かチャレンジ応答か）。

## CCNA向け要点（L2）
- **MACアドレス表（CAM）**: 「学習」「転送」「エージング」の流れを説明できること。
- **Floodingされるトラフィック**: ブロードキャスト/未知ユニキャスト/マルチキャストの扱い。
- **ループ時の症状**: CPU高騰、ブロードキャストストーム、断続的疎通。
- **ポート種別**: Access/Trunk、ネゴシエーション不一致時の影響。
- **EtherChannel要件**: speed/duplex、allowed VLAN、native VLAN をそろえる。

## コマンドの見方（試験・実務共通）
- `bridge vlan show`
  - **見る場所**: どのポートにどのVLANが `PVID` / `Egress Untagged` で設定されているか。
  - **異常例**: 想定VLANが trunk ポートに載っていない。
- `bridge link show`
  - **見る場所**: ポート状態（UP/DOWN）と所属ブリッジ。
  - **異常例**: 物理UPでもブリッジ未参加で通信不可。
- `tcpdump -e -i <iface>`
  - **見る場所**: EtherTypeと送受信MAC、VLANタグ有無。
  - **異常例**: ARPしか流れない、または想定VLANタグが見えない。

## 確認問題（L2）
### Q1
同一VLAN内で疎通しないとき、最初に確認すべき組み合わせとして適切なのはどれ？
- A. DNS設定とNTP同期
- B. VLAN割当とSTP状態
- C. OSPFネイバーとBGP経路
- D. HTTPステータスコード

**答え**: B

### Q2
L2ループが発生した際に起きやすい症状として最も適切なのはどれ？
- A. MTUが自動で増加する
- B. ブロードキャストトラフィックが急増する
- C. ARPが不要になる
- D. ルーティングテーブルが空になる

**答え**: B

## メモ
L2障害は「つながっているようでつながらない」症状になりやすいです。
まず VLAN と STP 状態を確認し、その後に MAC 学習やLACPの整合性を確認すると効率的です。
