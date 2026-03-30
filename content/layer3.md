---
layer: 3
title: ネットワーク層
layerId: L3
protocols:
  - IP
  - ICMP
  - ARP
commands:
  - ip route get <ip>
  - ip addr show
  - ping -c 3 <ip>
---

## メモ
ネットワーク層は「ルーティング」と「論理的なIP通信」を扱います。

運用では経路（ルートテーブル）、サブネット、ゲートウェイ、ARP解決などを起点に切り分けします。
