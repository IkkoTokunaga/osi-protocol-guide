---
layer: 2
title: データリンク層
layerId: L2
protocols:
  - Ethernet
  - PPP
  - VLAN
commands:
  - ip -d link show <iface>
  - bridge link show
  - tcpdump -e -i <iface>
---

## メモ
データリンク層は「フレーム」を扱います。MACアドレス、スイッチング（L2）、
VLANタグ付けなどが該当します。

障害対応では「どのMACがどのポートに学習されているか」「VLANタグの不一致」「L2ループ」を確認します。
