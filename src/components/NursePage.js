import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

export const NursePage = () => {
  const [user, setUser] = useState({});
  const [isApproved, setIsApproved] = useState(false);
  const [activeLink, setActiveLink] = useState(""); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch(`https://localhost:44331/api/Nurse/${new URLSearchParams(location.search).get("id")}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("nursetoken")}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setUser(json);
        setIsApproved(json.isApproved);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [location]);

  const handleLogOut = (e) => {
    e.preventDefault();
    if (window.confirm("Do you want to logout?")) {
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("nursetoken");
      setTimeout(() => {
        navigate("/log");
        window.location.reload();
      }, 0);
    }
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
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
                {isApproved ? (
                  <Link
                    to={`nurse?id=${user.id}`}
                    className={`nav-link ${
                      activeLink === "nurse" ? "active" : ""
                    }`}
                    onClick={() => handleLinkClick("nurse")}
                  >
                    View Info
                  </Link>
                ) : (
                  <span className="nav-link disabled text-danger">
                    View Info (Need Approval of Admin)
                  </span>
                )}
              </li>
              <li className="nav-item">
                {isApproved ? (
                  <Link
                    to={`editpatient?id=${user.id}`}
                    className={`nav-link ${
                      activeLink === "editpatient" ? "active" : ""
                    }`}
                    onClick={() => handleLinkClick("editpatient")}
                  >
                    View Patients
                  </Link>
                ) : (
                  <span className="nav-link disabled text-danger">
                    View Patients (Need Approval of Admin)
                  </span>
                )}
              </li>

              <li className="nav-item">
                <Link
                  to={`passchangenurse?id=${user.id}`}
                  className={`nav-link ${
                    activeLink === "passchangenurse" ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("passchangenurse")}
                >
                  Change Password
                </Link>
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
