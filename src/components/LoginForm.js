import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nurseemail, setNurseEmail] = useState("");
  const [nursepassword, setNursePassword] = useState("");
  const [user, setUser] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const requestBody = user === 'patient' ? { email, password } : { email: nurseemail, password: nursepassword };


    fetch(`https://localhost:44331/api/Login/${user}`,{
      method:'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        console.log("hi");
        return response.json()})
      .then((data) => {
       try{
          if (user === "patient") {
            sessionStorage.setItem("patienttoken",data.token);
            navigate(`patientpage?id=${data.id}`);
          } else {
            sessionStorage.setItem("nursetoken",data.token);
            navigate(`nursepage?id=${data.id}`);
          }
          setIsLoggedIn(true);
          sessionStorage.setItem("isLoggedIn", "true");
        }
        catch {
          setError("Invalid email or password");
          setShowErrorMessage(true);
        }
      })
      .catch(() => {
        setError("Error occurred while logging in. Please try again later.");
        setShowErrorMessage(true);
      });
  };

  
  useEffect(() => {
    let timer;

    if (showErrorMessage) {
      timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }

    const storedLoginStatus = sessionStorage.getItem("isLoggedIn");
    if (storedLoginStatus === "true") {
      setIsLoggedIn(true);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [showErrorMessage]);

  const handleReset = () => {
    setEmail("");
    setPassword("");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="container-fluid bg-light p-5">
      {!isLoggedIn && (
        <div className="container bg-white p-5">
          <h1 className="mb-4">Welcome to Covid Management System</h1>
          <p className="message">
            We are here to help you manage COVID testing and provide the best care. Our highly trained staff is dedicated to your well-being. You can trust us to guide you through this challenging time.
          </p>
          <div className="row">
            <div className="col-md-6">
              <form onSubmit={handleSubmit}>
                {showErrorMessage && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}
                 <h6 className="mb-4 text-center text-white" style={{ backgroundColor: 'gray', padding: '10px' }}>Patient Login</h6>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter the Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter the Password"
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={() => setUser('patient')}
                  >
                    Login
                  </button>
                  <input
                    type="reset"
                    className="btn btn-danger btn-block"
                    value="Reset"
                    onClick={handleReset}
                  />
                 
                </div>
              </form>
            </div>
            <div className="col-md-6">
              <form onSubmit={handleSubmit}>
                {showErrorMessage && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}
                <h6 className="mb-4 text-center text-white" style={{ backgroundColor: 'gray', padding: '10px' }}>Nurse Login</h6>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    value={nurseemail}
                    onChange={(e)=>setNurseEmail(e.target.value)} 
                    placeholder="Enter the Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    value={nursepassword}
                    onChange={(e)=>setNursePassword(e.target.value)}
                    placeholder="Enter the Password"
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={() => setUser('nurse')}
                  >
                    Login
                  </button>
                  <input
                    type="reset"
                    className="btn btn-danger btn-block"
                    value="Reset"
                    onClick={handleReset}
                  />
                 
                </div>
              </form>
            </div>
          </div>
          <h6 className="mt-3">
            Don't have a patient account?{" "}
            <a href="" onClick={handleRegisterClick}>
              Register
            </a>{" "}
            here.
          </h6>
          <button
                    type="button"
                    className="btn btn-info btn-block"
                    onClick={(e) => navigate('/')}
                  >
                   Go To Home Page
                  </button>
        </div>
      )}
      <Outlet />
    </div>
  );
}

export default LoginForm;
