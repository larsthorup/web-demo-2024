import { FormEvent, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

interface Album {
  title: string;
  date: string;
}

export function AlbumPicker() {
  const [albums, setAlbums] = useState<Album[]>([]);
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
    const mbResult = (await response.json()) as {
      releases: { title: string; date: string }[];
    };
    const { releases } = mbResult;
    setAlbums(releases.map(({ title, date }) => ({ title, date })));
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
    <form onSubmit={handleSubmit} aria-label="search">
      <label>
        Artist name:
        <input name="artist" />
      </label>
      <br />
      <label htmlFor="date">Release date:</label>
      <input
        id="date"
        name="date"
        type="number"
        min={1950}
        onInput={onValidate}
      />
      <button type="submit">Search</button>
      <p>Albums:</p>
      <ol>
        {albums.map(({title, date}) => (
          <li>{title} - {date}</li>
        ))}
      </ol>
    </form>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <AlbumPicker />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
