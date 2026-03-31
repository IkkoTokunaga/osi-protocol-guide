import { fireEvent, render, screen } from "@testing-library/react";

import OsiExplorer, { type OsiLayer } from "@/components/osi/OsiExplorer";

const layers: OsiLayer[] = [
  {
    id: "L7",
    title: "アプリケーション層",
    protocols: ["HTTP/HTTPS", "DNS"],
    commands: ["curl -I https://example.com"],
    protocolDetails: [
      {
        name: "HTTP / HTTPS",
        slug: "http-https",
        detailHtml: "<p>Web通信の基本プロトコル。</p>",
        rawBody: "",
        role: "Web通信の基本プロトコル",
        practicalUse: "4xx/5xxの傾向を確認",
        checkPoint: "ステータスコードと応答時間",
        ccnaFocus: "主要アプリプロトコルの役割整理",
      },
    ],
    memoHtml: "<p>L7メモ</p>",
  },
  {
    id: "L4",
    title: "トランスポート層",
    protocols: ["TCP", "UDP"],
    commands: ["ss -tulpn"],
    protocolDetails: [
      {
        name: "TCP",
        slug: "tcp",
        detailHtml: "<p>再送と順序保証を提供。</p>",
        rawBody: "",
        role: "再送と順序保証を提供",
        practicalUse: "3-way handshake失敗を確認",
        checkPoint: "再送統計とセッション状態",
        ccnaFocus: "3-way handshake理解",
      },
    ],
    memoHtml: "<p>L4メモ</p>",
  },
];

describe("OsiExplorer", () => {
  test("is closed by default and toggles layer by click", () => {
    render(<OsiExplorer layers={layers} />);

    expect(
      screen.queryByRole("heading", { name: "L7: アプリケーション層" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /L4/ }));

    expect(
      screen.getByRole("heading", { name: "L4: トランスポート層" }),
    ).toBeInTheDocument();
    expect(screen.getByText("ss -tulpn")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /L4/ }));
    expect(
      screen.queryByRole("heading", { name: "L4: トランスポート層" }),
    ).not.toBeInTheDocument();
  });

  test("keeps already open layer when opening another", () => {
    render(<OsiExplorer layers={layers} />);

    fireEvent.click(screen.getByRole("button", { name: /L7/ }));
    fireEvent.click(screen.getByRole("button", { name: /L4/ }));

    expect(
      screen.getByRole("heading", { name: "L7: アプリケーション層" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "L4: トランスポート層" }),
    ).toBeInTheDocument();
  });

  test("shows protocol links to detail pages", () => {
    render(<OsiExplorer layers={layers} />);
    fireEvent.click(screen.getByRole("button", { name: /L7/ }));

    expect(screen.getByText("HTTP / HTTPS")).toBeInTheDocument();
    fireEvent.click(screen.getByText("HTTP / HTTPS"));
    const link = screen.getByRole("link", { name: "もっと詳細を見る" });
    expect(link).toHaveAttribute("href", "/protocols/http-https");
  });
});
