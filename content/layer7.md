---
layer: 7
title: アプリケーション層
layerId: L7
protocols:
  - HTTP
  - DNS
  - SMTP
commands:
  - dig +short <domain>
  - curl -I http://<host>
  - swaks --to test@<domain> --server <host>
---

## メモ
アプリケーション層は「人が使うサービスそのもの」です。

HTTPステータス、DNSの応答、メール配送など、アプリ観点での切り分けが速いです。
