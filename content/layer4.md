---
layer: 4
title: トランスポート層
layerId: L4
protocols:
  - TCP
  - UDP
  - QUIC
commands:
  - ss -tulpn
  - nc -u -l -p 1234
  - tcpdump -i <iface> tcp
---

## メモ
トランスポート層は「端点間通信」を提供します。

TCPなら再送・輻輳・ウィンドウ、UDPなら到達保証なし、QUICならTLSと多重化が絡む点を押さえると調査が速くなります。
