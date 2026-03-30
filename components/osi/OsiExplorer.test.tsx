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
        detailHtml: "<p>Web通信の基本プロトコル。</p>",
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
        detailHtml: "<p>再送と順序保証を提供。</p>",
      },
    ],
    memoHtml: "<p>L4メモ</p>",
  },
];

describe("OsiExplorer", () => {
  test("renders selected layer details and switches by sidebar click", () => {
    render(<OsiExplorer layers={layers} />);

    expect(
      screen.getByRole("heading", { name: "L7: アプリケーション層" }),
    ).toBeInTheDocument();
    expect(screen.getByText("curl -I https://example.com")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /L4/ }));

    expect(
      screen.getByRole("heading", { name: "L4: トランスポート層" }),
    ).toBeInTheDocument();
    expect(screen.getByText("ss -tulpn")).toBeInTheDocument();
  });

  test("renders protocol detail blocks as accordion items", () => {
    render(<OsiExplorer layers={layers} />);

    const summary = screen.getByText("HTTP / HTTPS");
    const details = summary.closest("details");
    expect(details).not.toBeNull();
    expect(details).not.toHaveAttribute("open");

    fireEvent.click(summary);

    expect(details).toHaveAttribute("open");
    expect(screen.getByText("Web通信の基本プロトコル。")).toBeInTheDocument();
  });
});
