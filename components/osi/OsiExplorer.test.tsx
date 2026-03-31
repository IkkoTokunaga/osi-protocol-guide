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

  test("renders protocol detail blocks as accordion items", () => {
    render(<OsiExplorer layers={layers} />);
    fireEvent.click(screen.getByRole("button", { name: /L7/ }));

    const summary = screen.getByText("HTTP / HTTPS");
    const details = summary.closest("details");
    expect(details).not.toBeNull();
    expect(details).not.toHaveAttribute("open");

    fireEvent.click(summary);

    expect(details).toHaveAttribute("open");
    expect(screen.getByText("Web通信の基本プロトコル。")).toBeInTheDocument();
  });
});
