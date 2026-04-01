import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppRouter } from "../router";

describe("auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("redirects /todos to /login when no token", async () => {
    const router = createAppRouter(["/todos"]);

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/login");
    });

    expect(await screen.findByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByTestId("auth-shell")).toBeInTheDocument();
    expect(screen.getByTestId("auth-card")).toBeInTheDocument();
  });

  it("stores token after login and navigates to /todos", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ code: 0, message: "ok", data: { token: "jwt-token" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const router = createAppRouter(["/login"]);
    const user = userEvent.setup();

    render(<RouterProvider router={router} />);

    await user.type(screen.getByLabelText(/username/i), "alice");
    await user.type(screen.getByLabelText(/password/i), "secret");
    const signInButton = screen.getByRole("button", { name: /sign in/i });
    expect(signInButton).toHaveClass("btn", "btn-primary");
    await user.click(signInButton);

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("jwt-token");
      expect(router.state.location.pathname).toBe("/todos");
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "alice", password: "secret" }),
      }),
    );
  });
});
