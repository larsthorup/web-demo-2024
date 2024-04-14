import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { createBrowserRouter } from "react-router-dom";
import { AlbumProvider } from "./AlbumContext";

const router = createBrowserRouter(routes);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AlbumProvider>
      <RouterProvider router={router} />
    </AlbumProvider>
  </React.StrictMode>
);
