import { RiLogoutBoxFill } from "react-icons/ri";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { IoMdContact } from "react-icons/io";

export default function Admin()  {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Navbar
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto">
              <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className={`nav-item ${location.pathname === '/getpatient' ? 'active' : ''}`}>
                <Link className="nav-link" to="./getpatient">Patient</Link>
              </li>
              <li className={`nav-item ${location.pathname === '/category' ? 'active' : ''}`}>
                <Link className="nav-link" to="./category">Category</Link>
              </li>
              <li className={`nav-item ${location.pathname === '/users' ? 'active' : ''}`}>
                <Link className="nav-link" to="./users">User</Link>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <span className="btn btn-outline-info">
                <span className="navbar-text me-3" style={{ color: "white" }}>
                  {new URLSearchParams(window.location.search).get("id")}
                </span>
                <IoMdContact />
              </span>
              <button
                className="btn btn-warning my-2 my-sm-0"
                type="submit"
                onClick={() => navigate('/Login')}
              >
                LogOut <RiLogoutBoxFill />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
