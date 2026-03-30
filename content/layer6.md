---
layer: 6
title: プレゼンテーション層
layerId: L6
protocols:
  - TLS
  - JPEG
  - ASCII
commands:
  - openssl s_client -connect <host>:443
  - curl -v https://<host>
  - tcpdump -i <iface> port 443
---

## メモ
プレゼンテーション層は「データの表現（暗号化・圧縮・フォーマット変換）」に焦点があります。

TLSのハンドシェイク、証明書、暗号スイート、圧縮の有無などがトラブルの入口になります。
