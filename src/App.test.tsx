import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";
import { routes } from "./routes";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

describe(App.name, () => {
  it("should render", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);
    expect(screen.getByText("count is 0")).toBeInTheDocument();
  });
});
