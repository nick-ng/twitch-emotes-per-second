import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./root";
import EmotesPerSecond from "./components/emotes-per-second";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [{ path: "/", element: <EmotesPerSecond /> }],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
