import { Link } from "react-router-dom";
import classes from "./navbar.module.css";
import home from "./assets/img/home.png";

export default function Navbar() {
  return (
    <nav className={classes["main-div"]}>
      <p>
        <Link to="/">
          <img src={home} className={classes["home-icon"]} alt="home-icon" />
        </Link>
      </p>
      <ul>
        <li>
          <Link to="/models">Models</Link>
        </li>
        <li>
          <Link to="/csv">CSV</Link>
        </li>
      </ul>
    </nav>
  );
}
