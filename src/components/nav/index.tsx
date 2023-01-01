import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div>
      <Link className="block whitespace-nowrap" to="min-stat">
        Min Stat
      </Link>
      <Link className="block whitespace-nowrap" to="stopwatches">
        Stopwatches
      </Link>
      <Link className="block whitespace-nowrap" to="tera-raid">
        Tera Raids
      </Link>
    </div>
  );
}
