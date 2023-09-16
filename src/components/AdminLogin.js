import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [disableForm, setDisableForm] = useState(false); 
  const [resetCount, setResetCount] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
try{
    const response = await fetch("https://localhost:44331/api/Login/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password }),
      })
      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();

    
      sessionStorage.setItem("admintoken", data.token);
      console.log(data.token);

      navigate(`/adminpage?id=${data.id}`);
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }

  }; 


  const handleResetClick = () => {
    setResetCount((prevCount) => prevCount + 1);

    
    if (resetCount + 1 === 5) {
      navigate("/adminregister");
    }

    
    setEmail("");
    setPassword("");
  };

  return (
    <div>
    <div style={{ background: "#f2f2f2", minHeight: "100vh" }}>
      <div className="container">
        <h1 className="text-center mt-5">Admin Login</h1>
        <div className="row justify-content-center">
          <div className="col-md-6 mt-5">
            <form
              style={{ background: "#ffffff", padding: "20px", borderRadius: "5px" }}
              onSubmit={handleSubmit}
              disabled={disableForm} 
            >
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  placeholder="Enter the Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  placeholder="Enter the Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
                <button
                  type="reset"
                  className="btn btn-danger"
                  onClick={handleResetClick}
                >
                  Reset
                </button>
                <button
                  
                  className="btn btn-info"
                  onClick={()=>navigate('/')}
                >
                 Home <AiFillHome/>
                </button>
              </div>
             
              {error && (
                <div
                  className="alert alert-danger mt-3"
                  role="alert"
                  style={{ borderRadius: "5px" }}
                >
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      
    </div>
  
    <Outlet />
    </div>
  );
}

export default Login;
