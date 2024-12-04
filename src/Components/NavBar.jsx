import { NavLink } from "react-router-dom";
import styles from "../Components/NavBar.module.css";
import Logo from "./Logo";

const NavBar = () => {
  return (
    <div>
      <nav className={styles.nav}>
        <Logo />
        <ul>
          <li>
            <NavLink to="/pricing">Pricing</NavLink>
          </li>
          <li>
            <NavLink to="/product">Product</NavLink>
          </li>
          <li>
            <NavLink to="/login" className={styles.ctaLink}>Login</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
