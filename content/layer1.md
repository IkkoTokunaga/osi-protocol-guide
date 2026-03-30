---
layer: 1
title: 物理層
layerId: L1
protocols:
  - 1000BASE-T
  - 10GBASE-SR
  - 光ファイバー
  - PoE
  - Auto-Negotiation
commands:
  - ip link show
  - ethtool <iface>
  - ethtool -m <iface>
  - dmesg | grep -iE "link|eth|sfp"
---

## 主要プロトコル/規格詳細

### 1000BASE-T
- **役割**: Cat5e/Cat6 のツイストペア上で 1Gbps 通信を実現する Ethernet 物理規格。
- **実務での見どころ**: speed/duplex のミスマッチ、ケーブル品質劣化、ペア断線。
- **確認ポイント**: `ethtool <iface>` で negotiated speed と duplex を確認。

### 10GBASE-SR
- **役割**: マルチモード光ファイバー向け 10GbE 規格。データセンターで多用。
- **実務での見どころ**: 光モジュール相性、TX/RX パワー不足、汚れによる減衰。
- **確認ポイント**: DOM情報（温度/電力）とエラーカウンタの増加有無。

### 光ファイバー
- **役割**: 長距離・高帯域伝送の物理媒体（SMF/MMF）。
- **実務での見どころ**: 曲げ半径超過、コネクタ汚染、片系断。
- **確認ポイント**: 送受信レベル、LOS（Loss of Signal）イベント。

### PoE (Power over Ethernet)
- **役割**: Ethernet ケーブルで給電を行う仕組み（AP/カメラ/電話機など）。
- **実務での見どころ**: 供給電力不足、規格差（802.3af/at/bt）、起動不安定。
- **確認ポイント**: スイッチ側の給電状態と消費電力。

### Auto-Negotiation
- **役割**: 速度・デュプレックスを機器間で自動合意。
- **実務での見どころ**: 手動固定との組み合わせで片側のみ half になる事故。
- **確認ポイント**: 両端設定の整合性、CRCエラー増加。

## メモ
物理層の障害は上位層すべてに波及します。まずリンク状態とエラーカウンタを確認し、
「ケーブル/モジュール/ポート」の順に切り分けると短時間で原因に辿り着きやすいです。
