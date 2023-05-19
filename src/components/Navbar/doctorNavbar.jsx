import React from "react";
import { Link } from "react-router-dom";
import "../css/PatientNavbar.css";

export default function PatientNavbar() {
  return (
    <nav
      className="navbar navbar-expand-md navbar-light"
      style={{ backgroundColor: "#d8dae8" }}
    >
      <Link className="navbar-brand" to="/">
        <img
          src="https://i.ibb.co/1K2xJrg/medlink-logo.png"
          alt="medlink-logo"
          border="0"
          style={{ maxWidth: "50px", flexGrow: 1 }}
        ></img>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/" id="authorize-doctors-link">
              Home
            </Link>
          </li>
          <li className="nav-item active">
            <Link
              className="nav-link"
              to="/doctor/show-patients"
              id="authorize-doctors-link"
            >
              View Patients
            </Link>
          </li>
          <li className="nav-item active">
            <Link
              className="nav-link"
              to="/doctor/aboutMe"
              id="authorize-doctors-link"
            >
              About Me
            </Link>
          </li>
          {/* <li className="nav-item active">
            <Link
              className="nav-link"
              to="/patient/give-permission"
              id="authorize-doctors-link"
            >
              About Me
            </Link>
          </li> */}
        </ul>
      </div>
    </nav>
  );
}
