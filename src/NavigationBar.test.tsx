import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { routes } from "./routes";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import userEvent from "@testing-library/user-event";

describe(NavigationBar.name, () => {
  it("should render", async () => {
    const user = userEvent.setup();
    const router = createBrowserRouter(routes);
    render(<RouterProvider router={router} />);

    expect(screen.getByText("count is 0")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Albums" }));

    expect(await screen.findByLabelText("Artist name:")).toBeInTheDocument();
  });
});

