import { useEffect, useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { GrUpdate } from "react-icons/gr";

export const ChangePassword = () => {
  const [user, setUser] = useState({});
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [previousPass, setPreviousPass] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const pass = useRef();
  const [isVerified, setIsVerified] = useState(false);
  const [passwordError, setPasswordError] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://localhost:44331/api/Patient/${new URLSearchParams(window.location.search).get("id")}`,{
      method:'GET',
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("patienttoken")}`,
      }
    })
      .then((response) => response.json())
      .then((json) => {
        setUser(json);
        setPreviousPass(json.password);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const verify = (e) => {
    e.preventDefault();
    if (pass.current.value === previousPass) {
      setIsVerified(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedPatient = {
      ...user,
      password,
    };

    fetch(`https://localhost:44331/api/Patient/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("patienttoken")}`,
      },
      body: JSON.stringify(updatedPatient),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Password updated successfully");
          setUpdateSuccess(true); 
        } else {
          console.log("Failed to update Password");
         
        }
      })
      .catch((error) => {
        console.log("Error occurred while updating password:", error);
      
      });
  };

  return (
    <div className="container">
      <form onSubmit={verify}>
        <div className="form-group">
          <label>Enter old Password:</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              ref={pass}
              className="form-control"
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? (
                 <AiFillEye/>
              ) : (
                <AiFillEyeInvisible/>
              )}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Verify
        </button>
      </form>

      {passwordError && (
        <div className="text-danger mt-2">
          Incorrect old password. Please try again.
        </div>
      )}

      {isVerified && (
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Enter new Password:</label>
            <div className="input-group">
              <input
                type={showNewPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                  {showNewPassword ? (
                 <AiFillEye/>
              ) : (
                <AiFillEyeInvisible/>
              )}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Update <GrUpdate/>
          </button>
        </form>
      )}

      {updateSuccess && (
        <div className="text-success mt-2">
          Password updated successfully &#10004;
        </div>
      )}
    </div>
  );
};
