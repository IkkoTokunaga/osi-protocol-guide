---
layer: 1
title: 物理層
layerId: L1
protocols:
  - UTP
  - 光ファイバー
  - 1000BASE-T
commands:
  - ip link show
  - ethtool <iface>
  - dmesg | grep -iE "link|eth|fiber"
---

## メモ
物理層は「信号そのもの」を扱います。ケーブル種別（銅/光）、伝送速度、コネクタ、電気/光学特性などが中心です。

運用ではリンクアップ/ダウン、速度・デュプレックス、光モジュールの劣化などの観点でトラブルシュートします。
