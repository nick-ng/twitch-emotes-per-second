import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="h-screen">
      <Outlet />
    </div>
  );
}
