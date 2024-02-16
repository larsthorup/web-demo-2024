import { debug } from "vitest-preview";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App, { AlbumPicker } from "./App";
import userEvent from "@testing-library/user-event";
import mockResponse from "./mockResponse.json";

describe(App.name, () => {
  it("should render", () => {
    render(<App />);
    expect(screen.getByLabelText("Artist name:")).toBeInTheDocument();
  });
});

describe(AlbumPicker.name, () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should show search results", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.spyOn(window, "fetch").mockImplementation(async () => {
      return {
        json: async () => mockResponse,
      } as Response;
    });

    render(<AlbumPicker />);

    const artistInput = screen.getByLabelText("Artist name:");
    await user.type(artistInput, "rihanna");
    const form = screen.getByRole("form", { name: "search" });
    fireEvent.submit(form);

    await screen.findByText("A Girl Like Me");
    debug();

    expect(mockFetch).toHaveBeenCalledWith(
      "https://musicbrainz.org/ws/2/release?fmt=json&query=artist:rihanna"
    );
  });
});
