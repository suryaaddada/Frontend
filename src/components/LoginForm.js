import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleUserChange = async () => {
    const data={email,password};
    const patientResponse = await fetch(`https://localhost:44331/api/Login/patientCredentials`,{
      method:'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const nurseResponse = await fetch(`https://localhost:44331/api/Login/nurseCredentials`,{
      method:'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const isPatient = await patientResponse.json();
    const isNurse = await nurseResponse.json();
    console.log("Called");

    if (isPatient) {
      setUser('patient');
    } else if (isNurse) {
      setUser('nurse');
    } else {
      setUser('admin');
     
    }
  };

  useEffect(() => {
   
    if (user) {
      fetchUserLogin();
    }
  }, [user]);

  const fetchUserLogin = async () => {
    try {
      const response = await fetch(`https://localhost:44331/api/Login/${user}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (user === "patient") {
          sessionStorage.setItem("patienttoken", data.token);
          navigate(`patientpage?id=${data.id}`);
        } 
        else   if (user === "nurse") {
          sessionStorage.setItem("nursetoken", data.token);
          navigate(`nursepage?id=${data.id}`);
        }
        else{
          sessionStorage.setItem("admintoken", data.token);
         
          navigate(`adminpage?id=${data.id}`);
        }

        setIsLoggedIn(true);
        sessionStorage.setItem("isLoggedIn", "true");
      } else {
        setError("Invalid email or password");
        setShowErrorMessage(true);
      }
    } catch {
      setError("Error occurred while logging in. Please try again later.");
      setShowErrorMessage(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   

   
    await handleUserChange();
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
          <form onSubmit={handleSubmit}>
            {showErrorMessage && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
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
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>

              <input
                type="reset"
                className="btn btn-danger btn-block"
                value="Reset"
                onClick={handleReset}
              />

              <button
                type="button"
                className="btn btn-info btn-block"
                onClick={() => navigate('/')}
              >
                Home
              </button>
            </div>
            <h6 className="mt-3">
              Don't have an Patient Account?{" "}
              <a href="" onClick={handleRegisterClick}>
                Register
              </a>{" "}
              here.
            </h6>
          </form>
        </div>
      )}
      <Outlet />
    </div>
  );
}

export default LoginForm;
