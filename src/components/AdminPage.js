import React, { useState, useEffect } from "react";
import { RiLogoutBoxFill } from "react-icons/ri";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { IoMdContact } from "react-icons/io";
import { BiMenu } from "react-icons/bi";

export const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [admin, setAdmin] = useState({});
  const [name, setName] = useState(localStorage.getItem("adminName") || "");
  const [activeMenuItem, setActiveMenuItem] = useState(""); 

  useEffect(() => {
    fetch(`https://localhost:44331/api/Admin/${new URLSearchParams(window.location.search).get("id")}`,{
        method:"GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("admintoken")}`,
        },
      })
        .then((response) => {
         
          return response.json();
        })
        .then((json) => {
          setAdmin(json);
          setName(json.firstName);
          sessionStorage.setItem("adminName", json.firstName);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
         
        });
      
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    if (window.confirm("Do you want to logout?")) {
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("adminName"); 
      sessionStorage.removeItem('admintoken');
      setTimeout(() => {
        navigate("/login");
        window.location.reload();
      }, 0);
    }
  };

  return (
    <>
      <style>
        {`
          /* Mobile styles */
          @media (max-width: 768px) {
            .navbar-toggler {
              display: block;
            }

            .navbar-collapse {
              display: none;
              position: absolute;
              top: 60px; /* Adjust this value as needed */
              left: 0;
              right: 0;
              background-color: #343a40; /* Change the background color as needed */
            }

            .menu-open .navbar-collapse {
              display: block;
            }

            .navbar-nav {
              flex-direction: column;
              padding-left: 0;
            }

            .nav-item {
              margin: 0;
            }
          }

          /* Desktop styles */
          @media (min-width: 768px) {
            .navbar-toggler {
              display: none;
            }

            /* Highlight active menu item */
            .nav-link.active {
              background-color: #007bff; /* Change the highlight color as needed */
              color: #fff; /* Change the text color as needed */
            }
          }
        `}
      </style>
      <nav className={`navbar navbar-expand-lg navbar-dark bg-primary ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="container-fluid">
          <button
            className={`navbar-toggler ${isMenuOpen ? "collapsed" : ""}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
            aria-controls="navbarMenu"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link className="navbar-brand" to="/">
            Welcome {name}
          </Link>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto">
              <li className={activeMenuItem === "Patients" ? "nav-item active" : "nav-item"}>
                <Link className="nav-link" to="./actpatient" onClick={() => handleMenuItemClick("Patients")}>
                  Patients
                </Link>
              </li>
              <li className={activeMenuItem === "Nurses" ? "nav-item active" : "nav-item"}>
                <Link className="nav-link" to="./actnurse" onClick={() => handleMenuItemClick("Nurses")}>
                  Nurses
                </Link>
              </li>
              <li className={activeMenuItem === "Devices" ? "nav-item active" : "nav-item"}>
                <Link className="nav-link" to="./device" onClick={() => handleMenuItemClick("Devices")}>
                  Devices
                </Link>
              </li>
              <li className={activeMenuItem === "PatientAssign" ? "nav-item active" : "nav-item"}>
                <Link className="nav-link" to="./assign" onClick={() => handleMenuItemClick("PatientAssign")}>
                  Patient Assign
                </Link>
              </li>
              <li className={activeMenuItem === "PatientAssign" ? "nav-item active" : "nav-item"}>
                <Link className="nav-link" to="./nurseRegister" onClick={() => handleMenuItemClick("PatientAssign")}>
                  Add Nurse
                </Link>
              </li>
            </ul>
            </div>
          <div className="navbar-nav ml-auto">
            <span className="btn btn-info mr-3" onClick={toggleMenu}>
              <BiMenu />
            </span>
          </div>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="menu-overlay" onClick={toggleMenu}>
          <div className="menu-wrapper">
            <ul className="menu-list list-unstyled">
              <li className="nav-item">
                <Link className="nav-link text-dark" to={`getAdmin?id=${admin.id}`}>
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to={`passchangeadmin?id=${admin.id}`}>
                  ChangePassword
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" onClick={handleLogOut}>
                  LogOut
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      <Outlet />
    </>
  );
};

export default Admin;
