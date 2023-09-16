import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [userType, setUserType] = useState("patient");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [pass, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDOB] = useState("");
  const [gender, setGender] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [isAct, setAct] = useState(true);
  const [result, setResult] = useState("Not yet Tested");
  const [isAssigned, setIsAssigned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [experience, setExperience] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const navigate=useNavigate();

  useEffect(() => {
    let successTimer, errorTimer;

    if (showSuccessMessage) {
      successTimer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }

    if (showErrorMessage) {
      errorTimer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }

    return () => {
      clearTimeout(successTimer);
      clearTimeout(errorTimer);
    };
  }, [showSuccessMessage, showErrorMessage]);


  // Validation checks
  const nameRegex = /^[A-Za-z\s]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[789]\d{9}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    if (!nameRegex.test(fname) || !nameRegex.test(lname)) {
      setError(true);
      setSubmitting(false);
      return;
    }

    if (!passwordRegex.test(pass)) {
      setError(true);
      setSubmitting(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setError(true);
      setSubmitting(false);
      return;
    }

    if (!mobileRegex.test(mobile)) {
      setError(true);
      setSubmitting(false);
      return;
    }

    if (address.trim() === "" || dob === "" || gender === "") {
      setError(true);
      setSubmitting(false);
      return;
    }

    const data = {
      password: pass,
      firstName: fname,
      lastName: lname,
      gender: gender,
      dob: dob,
      address: address,
      mobile: mobile,
      date: date,
      email: email,
      isActive: isAct,
      result: result,
      isAssigned: isAssigned,
    };

    try {
      
        let url = "https://localhost:44331/api/Patient";
        let emailExistsUrl = `https://localhost:44331/api/Login/patientmailexists/${email}`;
     

     
      const emailCheckResponse = await fetch(emailExistsUrl);
      if (!emailCheckResponse.ok) {
        setError(true);
        setSubmitting(false);
        return;
      }
      const emailExistsResult = await emailCheckResponse.json();
      if (emailExistsResult) {
        setEmailExists(true);
        setSubmitting(false);
        return;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        setShowSuccessMessage(true); 
        setFname("");
        setLname("");
        setPassword("");
        setEmail("");
        setMobile("");
        setAddress("");
        setDOB("");
        setGender("");
        setDate(new Date().toISOString().substr(0, 10));
        setAct(true);
        setResult("Not yet Tested");
        setIsAssigned(false);
        setExperience("");
      } else {
        setError(true);
        setShowErrorMessage(true); 
      }
    } catch (error) {
      setError(true);
      setShowErrorMessage(true);
    }

    setSubmitting(false);
  };

  

  return (
    <div className="container" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="text-center mb-4">Patient Registration</h2>
              
              {showSuccessMessage && ( 
                <div className="alert alert-success" role="alert">
                  Registration successful! You can now log in.
                </div>
              )}
              {showErrorMessage && ( 
                <div className="alert alert-danger" role="alert">
                  Registration failed. Please try again.
                </div>
              )}
              <form onSubmit={handleSubmit}>
               
                <div className="form-group">
                  <label htmlFor="fname">First Name</label>
                  <input
                    type="text"
                    id="fname"
                    className={`form-control ${
                      error && !nameRegex.test(fname) ? "is-invalid" : ""
                    }`}
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    required
                  />
                  {error && !nameRegex.test(fname) && (
                    <div className="invalid-feedback">
                      Please enter a valid first name.
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="lname">Last Name</label>
                  <input
                    type="text"
                    id="lname"
                    className={`form-control ${
                      error && !nameRegex.test(lname) ? "is-invalid" : ""
                    }`}
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    required
                  />
                  {error && !nameRegex.test(lname) && (
                    <div className="invalid-feedback">
                      Please enter a valid last name.
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="pass">Password</label>
                  <input
                    type="password"
                    id="pass"
                    className={`form-control ${
                      error && !passwordRegex.test(pass) ? "is-invalid" : ""
                    }`}
                    value={pass}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="5"
                  />
                  {error && !passwordRegex.test(pass) && (
                    <div className="invalid-feedback">
                      Password must be at least 5 characters long and contain at
                      least one letter, one number, and one special character.
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control ${
                      (error && !emailRegex.test(email)) || emailExists
                        ? "is-invalid"
                        : ""
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    title="Please enter a valid email address"
                  />
                  {error && !emailRegex.test(email) && !emailExists && (
                    <div className="invalid-feedback">
                      Please enter a valid email address.
                    </div>
                  )}
                  {emailExists && (
                    <div className="invalid-feedback">
                      Email already exists. Please try a different one.
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input
                    type="tel"
                    id="mobile"
                    className={`form-control ${
                      error && !mobileRegex.test(mobile) ? "is-invalid" : ""
                    }`}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    pattern="^[789]\d{9}$"
                    title="Please enter a valid 10-digit mobile number starting with 7, 8, or 9"
                  />
                  {error && !mobileRegex.test(mobile) && (
                    <div className="invalid-feedback">
                      Please enter a valid 10-digit mobile number starting with
                      7, 8, or 9.
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    className={`form-control ${
                      error && address.length === 0 ? "is-invalid" : ""
                    }`}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  {error && address.length === 0 && (
                    <div className="invalid-feedback">
                      Please enter your address.
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    id="dob"
                    className={`form-control ${
                      error && dob.length === 0 ? "is-invalid" : ""
                    }`}
                    value={dob}
                    onChange={(e) => setDOB(e.target.value)}
                    required
                  />
                  {error && dob.length === 0 && (
                    <div className="invalid-feedback">
                      Please enter your date of birth.
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    className={`form-control ${
                      error && gender.length === 0 ? "is-invalid" : ""
                    }`}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {error && gender.length === 0 && (
                    <div className="invalid-feedback">
                      Please select your gender.
                    </div>
                  )}
                </div>
                
              <div style={{display: "flex", justifyContent: "space-between" }}>
  <div className="form-group">
    <button
      type="submit"
      className="btn btn-outline-primary"
      disabled={submitting}
    >
      {submitting ? "Submitting..." : "Submit"}
    </button>
  </div>
  <div className="form-group">
    <button
      type="button"
      className="btn btn-outline-dark"
      onClick={(e) => navigate('/log')}
    >
      Login
    </button>
  </div>
</div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
