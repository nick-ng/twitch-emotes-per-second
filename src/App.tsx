import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./root";
import EmotesPerSecond from "./components/emotes-per-second";

const imgHeight = 24;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <EmotesPerSecond /> },
      {
        path: "/test-image-sizes",
        element: (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
            }}
          >
            {[
              "https://cdn.betterttv.net/emote/5f69a3fd9068f170aaed5a09/2x",
              "https://cdn.7tv.app/emote/618db419b1eb03daac7d5a41/2x.webp",
              "https://cdn.7tv.app/emote/636e100557f7a6dc03bb22fa/2x.webp",
              "https://cdn.7tv.app/emote/623ddd4c323d0026d4ee61e6/2x.webp",
              "https://cdn.7tv.app/emote/62bb8c1eb601b61c9bef2642/2x.webp",
              "https://cdn.7tv.app/emote/63a8e0917df9e1edbf05093a/2x.webp",
            ].map((a) => (
              <div
                key={a}
                style={{
                  textAlign: "center",
                  backgroundColor: "black",
                  border: "2px solid gray",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <img
                  style={{ height: `${imgHeight}px`, display: "block" }}
                  src={a}
                />
                <span style={{ color: "white", fontWeight: "bold" }}>×2</span>
              </div>
            ))}
          </div>
        ),
      },
      { path: "/:urlChannel", element: <EmotesPerSecond /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
