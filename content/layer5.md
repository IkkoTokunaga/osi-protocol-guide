---
layer: 5
title: セッション層
layerId: L5
protocols:
  - NetBIOS
  - RPC
  - SIP
commands:
  - lsof -i -P -n | grep <service>
  - ss -tnp
  - rpcinfo -p <host>
---

## メモ
セッション層は「セッションの確立・維持」を担います（ただし現代の実装では上位層/実装仕様に吸収されやすいです）。

調査では、開始/切断、状態遷移、セッション枯渇、タイムアウトなどの観点で見ると手早いです。
