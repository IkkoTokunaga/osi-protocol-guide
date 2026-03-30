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

### VLAN (IEEE 802.1Q)
- **役割**: 論理的にL2セグメントを分離するタグ方式。
- **実務での見どころ**: native VLAN 不一致、trunk 許可VLAN漏れ。
- **確認ポイント**: タグ有無、tagged/untagged の設計一致。

### STP / RSTP
- **役割**: L2ループを防ぐために冗長リンクを制御。
- **実務での見どころ**: ルートブリッジ意図せぬ変更、収束遅延。
- **確認ポイント**: BPDU受信状況、ポートロール（Root/Designated/Blocked）。

### LACP (802.3ad)
- **役割**: 複数リンクを束ねて冗長化/帯域拡張（EtherChannel）。
- **実務での見どころ**: 片側 active/passive 不一致、ハッシュ偏り。
- **確認ポイント**: メンバーリンク状態、LACPDU交換。

### PPP
- **役割**: Point-to-Point 回線でのカプセル化・認証制御。
- **実務での見どころ**: 認証方式不一致（PAP/CHAP）、MTU問題。
- **確認ポイント**: セッション確立ログ、再ネゴシエーション頻度。

## メモ
L2障害は「つながっているようでつながらない」症状になりやすいです。
まず VLAN と STP 状態を確認し、その後に MAC 学習やLACPの整合性を確認すると効率的です。
