import React, { useEffect, useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
//testing 
export const Apple = () => {
  const [user, setUser] = useState({});
  const [nurseId, setNurseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const nurse = useRef();

  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://localhost:7204/api/Patient/${1}`)
      .then((response) => response.json())
      .then((json) => {
        setUser(json);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedPatient = {
      ...user,
      isAssigned:true,
      nurseId,
    };



    fetch(`https://localhost:7204/api/Admin/Patient/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Enter new Password:</label>
          <div className="input-group">
            <input
              type={showNewPassword ? "text" : "password"}
              value={nurseId}
              onChange={(e) => setNurseId(e.target.value)}
              className="form-control"
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <AiFillEye />
              ) : (
                <AiFillEyeInvisible />
              )}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>

      {updateSuccess && (
        <div className="text-success mt-2">
          Password updated successfully &#10004;
        </div>
      )}
    </div>
  );
};
