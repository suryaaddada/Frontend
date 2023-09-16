import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";


export const PatientPage = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch(`https://localhost:44331/api/Patient/${new URLSearchParams(window.location.search).get("id")}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("patienttoken")}`,
      },
    })
      .then((response) => response.json())
      .then((json) => setUser(json))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleLogOut = (e) => {
    e.preventDefault();
    if (window.confirm("Do you want to logout?")) {
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("patienttoken");
      setTimeout(() => {
        navigate("/log");
        window.location.reload();
      }, 0);
    }
  };

  return (
    <div className="container-fluid p-0">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-text text-white">
            Welcome {user.firstName}
          </span>

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
              <li className="nav-item">
                <NavLink
                  to={`patient?id=${user.id}`}
                  className="nav-link"
                  activeClassName="active"
                >
                  View Info
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to={`passchpat?id=${user.id}`}
                  className="nav-link"
                  activeClassName="active"
                >
                  Change Password
                </NavLink>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleLogOut}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default PatientPage;
