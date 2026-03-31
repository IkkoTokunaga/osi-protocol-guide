---
layer: 3
title: ネットワーク層
layerId: L3
protocols:
  - IPv4
  - IPv6
  - ICMP
  - ARP
  - OSPF/BGP
commands:
  - ip route show
  - ip route get <ip>
  - ip neigh show
  - ping -c 3 <ip>
---

## 主要プロトコル詳細

### IPv4
- **役割**: 32bitアドレスによるパケット転送。現在も広く利用。
- **実務での見どころ**: サブネット不整合、デフォルトルート漏れ、NAT関連トラブル。
- **確認ポイント**: 経路テーブル、送信元アドレス選択、TTL減衰。
- **CCNA頻出**: 最長一致（Longest Prefix Match）、Administrative Distance、メトリック。

### IPv6
- **役割**: 128bitアドレス空間。RA/SLAACやNDPで自動構成。
- **実務での見どころ**: デュアルスタック時の優先経路、DNS AAAA解決。
- **確認ポイント**: `ip -6 route` と NDP キャッシュ。
- **CCNA頻出**: Link-Localアドレス、EUI-64、NDPとARPの違い。

### ICMP
- **役割**: 到達性確認とエラー通知（Echo, Destination Unreachable など）。
- **実務での見どころ**: ICMP遮断により疎通調査が難航、PMTUD失敗。
- **確認ポイント**: Echo Reply 有無、Fragmentation Needed の有無。
- **CCNA頻出**: `Time Exceeded` と `Destination Unreachable` の意味。

### ARP
- **役割**: IPv4アドレスをMACアドレスに解決。
- **実務での見どころ**: ARPエントリ競合、グラチュイタスARPでの揺れ。
- **確認ポイント**: `ip neigh show` の状態（REACHABLE/STALE/FAILED）。
- **CCNA頻出**: Proxy ARP、同一セグメント外通信でのGW解決フロー。

### OSPF / BGP
- **役割**: 動的ルーティング制御（IGP/EGP）。
- **実務での見どころ**: ネイバー未確立、経路広告漏れ、優先度設計ミス。
- **確認ポイント**: 隣接状態、広告プレフィックス、経路選択理由。
- **CCNA頻出**: OSPFのArea概念、DR/BDR、BGPのAS_PATH/LOCAL_PREFの基本。

## CCNA向け要点（L3）
- **ルーティング判断**: 最長一致 → AD → メトリック の順で理解する。
- **デフォルトゲートウェイ**: ホスト障害切り分けでは最初の確認ポイント。
- **NAT/PATの基本**: inside local / inside global の対応関係。
- **FHRPの役割**: デフォルトGW冗長化（HSRP/VRRP/GLBPの概念）。
- **ACLの方向**: inbound/outbound の適用位置で結果が大きく変わる。

## コマンドの見方（試験・実務共通）
- `ip route show`
  - **見る場所**: `default via`、宛先プレフィックス、次ホップ、出力IF。
  - **異常例**: 目的ネットワークの経路がなく、default routeにも到達不可。
- `ip route get <ip>`
  - **見る場所**: 実際に選ばれる経路と送信元IP。
  - **異常例**: 想定外のインターフェースから出ている。
- `ip neigh show`
  - **見る場所**: `FAILED` や `INCOMPLETE` の有無。
  - **異常例**: GWのMAC解決失敗でL3以前に止まる。
- `ping -c 3 <ip>`
  - **見る場所**: 到達可否だけでなく遅延のばらつき。
  - **異常例**: 通るが遅延/ロスが大きい（輻輳や経路揺れの疑い）。

## 確認問題（L3）
### Q1
宛先 `10.10.10.10` に対し、`10.10.10.0/24` と `10.10.0.0/16` の経路がある場合、通常選ばれるのはどれ？
- A. /16（範囲が広い方）
- B. /24（より具体的な方）
- C. ADが高い方
- D. 先に設定した方

**答え**: B

### Q2
`ip neigh show` でデフォルトGWが `FAILED` の場合に最も疑うべきなのはどれ？
- A. DNSサーバ障害
- B. ARP解決失敗またはL2到達性問題
- C. HTTPアプリのバグ
- D. BGPコミュニティ設定

**答え**: B

## メモ
L3の切り分けは「自ホスト → GW → 宛先」の順で行うと明確です。
`ip route get` と `traceroute` を組み合わせると経路問題の特定が速くなります。
