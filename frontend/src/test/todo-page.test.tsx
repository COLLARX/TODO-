import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppRouter } from "../router";

describe("todo page", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", "jwt-token");
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads todos with bearer token", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          code: 0,
          message: "ok",
          data: [{ id: 1, title: "Write tests", description: "auth and todo flow", status: "TODO" }],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const router = createAppRouter(["/todos"]);
    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Write tests")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/todos",
      expect.objectContaining({
        method: "GET",
        headers: { Authorization: "Bearer jwt-token" },
      }),
    );
  });

  it("creates a todo and refreshes list", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 0, message: "ok", data: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 0, message: "ok", data: { id: 2, title: "Ship app", description: "today", status: "TODO" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 0, message: "ok", data: [{ id: 2, title: "Ship app", description: "today", status: "TODO" }] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    const router = createAppRouter(["/todos"]);
    const user = userEvent.setup();

    render(<RouterProvider router={router} />);

    await user.type(await screen.findByLabelText(/title/i), "Ship app");
    await user.type(screen.getByLabelText(/description/i), "today");
    await user.click(screen.getByRole("button", { name: /add todo/i }));

    expect(await screen.findByText("Ship app")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/todos",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Ship app", description: "today" }),
      }),
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("updates and deletes own todo", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 0, message: "ok", data: [{ id: 3, title: "Review PR", description: "before lunch", status: "TODO" }] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 0, message: "ok", data: { id: 3, title: "Review PR", description: "before lunch", status: "DONE" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 0, message: "ok", data: null }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    const router = createAppRouter(["/todos"]);
    const user = userEvent.setup();

    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Review PR")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /mark done/i }));
    await waitFor(() => {
      expect(screen.getByText(/done/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await waitFor(() => {
      expect(screen.queryByText("Review PR")).not.toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/todos/3",
      expect.objectContaining({
        method: "PUT",
        headers: {
          Authorization: "Bearer jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Review PR", description: "before lunch", status: "DONE" }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "/api/todos/3",
      expect.objectContaining({
        method: "DELETE",
        headers: { Authorization: "Bearer jwt-token" },
      }),
    );
  });
});
