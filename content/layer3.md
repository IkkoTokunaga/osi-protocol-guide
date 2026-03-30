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

### IPv6
- **役割**: 128bitアドレス空間。RA/SLAACやNDPで自動構成。
- **実務での見どころ**: デュアルスタック時の優先経路、DNS AAAA解決。
- **確認ポイント**: `ip -6 route` と NDP キャッシュ。

### ICMP
- **役割**: 到達性確認とエラー通知（Echo, Destination Unreachable など）。
- **実務での見どころ**: ICMP遮断により疎通調査が難航、PMTUD失敗。
- **確認ポイント**: Echo Reply 有無、Fragmentation Needed の有無。

### ARP
- **役割**: IPv4アドレスをMACアドレスに解決。
- **実務での見どころ**: ARPエントリ競合、グラチュイタスARPでの揺れ。
- **確認ポイント**: `ip neigh show` の状態（REACHABLE/STALE/FAILED）。

### OSPF / BGP
- **役割**: 動的ルーティング制御（IGP/EGP）。
- **実務での見どころ**: ネイバー未確立、経路広告漏れ、優先度設計ミス。
- **確認ポイント**: 隣接状態、広告プレフィックス、経路選択理由。

## メモ
L3の切り分けは「自ホスト → GW → 宛先」の順で行うと明確です。
`ip route get` と `traceroute` を組み合わせると経路問題の特定が速くなります。
