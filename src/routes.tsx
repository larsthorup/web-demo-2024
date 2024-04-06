import { RouteObject } from "react-router-dom";
import AlbumPicker from "./AlbumPicker.tsx";
import App from "./App.tsx";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/albums",
    element: <AlbumPicker />,
  },
];
