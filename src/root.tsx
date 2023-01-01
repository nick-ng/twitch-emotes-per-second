import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="mx-4">
      <h1>Twitch Emotes Per Second</h1>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
