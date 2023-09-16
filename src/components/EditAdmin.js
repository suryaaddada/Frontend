import React, { useState, useEffect } from "react";
import { AiOutlineSave } from "react-icons/ai";

export const EditAdmin = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDOB] = useState("");
  const [address, setAddress] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false); 
  const [errors, setErrors] = useState({}); 

  useEffect(() => {
    setLoading(true);
    fetch(`https://localhost:44331/api/Admin/${new URLSearchParams(window.location.search).get("id")}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${sessionStorage.getItem('admintoken')}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setUser(json);
        setFirstName(json.firstName);
        setLastName(json.lastName);
        setMobile(json.mobile);
        setGender(json.gender);
        setDOB(json.dob.split("T")[0]);
        setAddress(json.address);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!/^[a-zA-Z\s]+$/.test(firstName)) {
      errors.firstName = "First name should contain letters and whitespace only";
      isValid = false;
    }

    if (!/^[a-zA-Z\s]+$/.test(lastName)) {
      errors.lastName = "Last name should contain letters and whitespace only";
      isValid = false;
    }

    if (!/^[789]\d{9}$/.test(mobile)) {
      errors.mobile = "Mobile number should be 10 digits starting with 7, 8, or 9";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedAdmin = {
      ...user,
      firstName,
      lastName,
      gender,
      dob: dob + "T00:00:00",
      address,
      mobile,
      email: user.email,
    };

    fetch(`https://localhost:44331/api/Admin/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${sessionStorage.getItem('admintoken')}`,
      },
      body: JSON.stringify(updatedAdmin),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Admin data updated successfully");
          setUpdateSuccess(true); 
        } else {
          console.log("Failed to update nurse data");
         
        }
      })
      .catch((error) => {
        console.log("Error occurred while updating nurse data:", error);
       
      });
  };

  return (
    <div className="container mt-4">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={handleSave}>
          <h2>Edit Admin Details</h2>
          {updateSuccess && (
            <div className="alert alert-success" role="alert">
              Successfully updated <span>&#10004;</span>
            </div>
          )}
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              className="form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            {errors.firstName && (
              <div className="text-danger">{errors.firstName}</div>
            )}
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            {errors.lastName && (
              <div className="text-danger">{errors.lastName}</div>
            )}
          </div>

          <div className="form-group">
            <label>Mobile:</label>
            <input
              type="tel"
              className="form-control"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
            {errors.mobile && (
              <div className="text-danger">{errors.mobile}</div>
            )}
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <div className="form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                id="male"
                name="gender"
                value="Male"
                checked={gender === "Male"}
                onChange={(e) => setGender(e.target.value)}
                required
              />
              <label className="form-check-label" htmlFor="male">
                Male
              </label>
            </div>
            <div className="form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                id="female"
                name="gender"
                value="Female"
                checked={gender === "Female"}
                onChange={(e) => setGender(e.target.value)}
                required
              />
              <label className="form-check-label" htmlFor="female">
                Female
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              className="form-control"
              value={dob}
              onChange={(e) => setDOB(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <textarea
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            ></textarea>
          </div>

          
          <button type="submit" className="btn btn-primary">
            Save <AiOutlineSave/>
          </button>
        </form>
      )}
    </div>
  );
};
