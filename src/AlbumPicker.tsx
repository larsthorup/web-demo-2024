import { FormEvent, useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import { useAlbumDispatch, useAlbumState } from "./AlbumContext";

export default function AlbumPicker() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAlbumDispatch();
  const { albums, artist, date } = useAlbumState();
  const [navigating, setNavigating] = useState(true);
  useEffect(() => {
    setNavigating(false);
  }, []);
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const form = e.target as HTMLFormElement;
    const formElements = form.elements as typeof form.elements & {
      artist: HTMLInputElement;
      date: HTMLInputElement;
    };
    if (
      formElements.artist.value.toLowerCase() === "rihanna" &&
      formElements.date.value === "2010"
    ) {
      formElements.date.setCustomValidity(
        "Not allowed to search for Rihanna's 2010 albums"
      );
      return;
    }
    const artist = encodeURIComponent(formElements.artist.value);
    const date = encodeURIComponent(formElements.date.value);
    const query = `artist:${artist} AND date:${date}`;
    const url = `https://musicbrainz.org/ws/2/release?fmt=json&query=${query}`;
    const response = await fetch(url);
    if (!response.ok) {
      setError(`Failed to search: ${response.statusText}`);
    }
    const mbResult = (await response.json()) as {
      releases: { title: string; date: string }[];
    };
    const { releases } = mbResult;
    const albums = releases.map(({ title, date }) => ({ title, date }));
    dispatch({ type: "fetched", payload: { albums, artist, date } });
    const logUrl = "https://eolqod83qyz4plh.m.pipedream.net";
    const logResponse = await fetch(logUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ artist, date, count: releases.length }),
    });
    if (!logResponse.ok) {
      setError(`Failed to log search: ${logResponse.statusText}`);
    }
    setIsLoading(false);
  }
  function onValidate(e: FormEvent) {
    const target = e.target as HTMLInputElement;
    if (target.validity.badInput || target.validity.rangeUnderflow) {
      target.setCustomValidity("Please enter a year after 1950");
    } else {
      target.setCustomValidity("");
    }
  }
  return (
    <div className={`page ${navigating ? "navigating" : "navigated"}`}>
      <NavigationBar />
      <form onSubmit={handleSubmit} aria-label="search">
        <label>
          Artist name:
          <input name="artist" defaultValue={artist}/>
        </label>
        <br />
        <label htmlFor="date">Release date:</label>
        <input
          id="date"
          name="date"
          type="number"
          min={1950}
          defaultValue={date}
          onInput={onValidate}
        />
        <button type="submit">Search</button>
        {isLoading && <p>Searching...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!isLoading && (
          <>
            <p>Albums:</p>
            <ol>
              {albums.map(({ title, date }) => (
                <li>
                  {title} - {date}
                </li>
              ))}
            </ol>
          </>
        )}
      </form>
    </div>
  );
}
