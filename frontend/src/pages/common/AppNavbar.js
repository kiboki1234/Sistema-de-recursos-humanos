import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { AuthContext } from '../../components/AuthContext';
import '../css/style.css';
import logoIcon from "../img/logonav.png";
import NavbarItems from './NabvarItems';


const AppNavbar = () => {
  const { userRole } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container">
        <img className="logo-navbar" src={logoIcon} alt="logo" />
        <Link className="navbar-brand" to="/">
          <strong>CPED</strong>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <NavbarItems />
            <li>
              <ProfileDropdown />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
