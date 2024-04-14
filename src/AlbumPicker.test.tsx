import { debug } from "vitest-preview";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import mockResponse from "./mockResponse.json";
import AlbumPicker from "./AlbumPicker";
import { routes } from "./routes";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { AlbumProvider } from "./AlbumContext";

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

    const router = createMemoryRouter(routes, { initialEntries: ["/albums"] });
    render(
      <AlbumProvider>
        <RouterProvider router={router} />
      </AlbumProvider>
    );

    const artistInput = screen.getByLabelText("Artist name:");
    await user.type(artistInput, "rihanna");
    const dateInput = screen.getByLabelText(
      "Release date:"
    ) as HTMLInputElement;
    await user.type(dateInput, "1920");
    expect(dateInput).toBeInvalid();
    expect(dateInput.validationMessage).toBe("Please enter a year after 1950");
    await user.clear(dateInput);
    await user.type(dateInput, "2005");
    expect(dateInput).toBeValid();
    const form = screen.getByRole("form", { name: "search" });
    fireEvent.submit(form);

    await screen.findAllByText("Music of the Sun - 2005-08-29");
    debug();

    expect(mockFetch).toHaveBeenCalledWith(
      "https://musicbrainz.org/ws/2/release?fmt=json&query=artist:rihanna AND date:2005"
    );
    expect(mockFetch).toHaveBeenCalledWith(
      "https://eolqod83qyz4plh.m.pipedream.net",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ artist: "rihanna", date: "2005", count: 21 }),
      }
    );
  });
});
