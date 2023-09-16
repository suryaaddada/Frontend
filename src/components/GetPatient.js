import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar,FaUserEdit } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";

export const GetPatient = () => {
  const [user, setUser] = useState({});
  const [nurse, setNurse] = useState({});
  const [post, setPost] = useState({});
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [isPosted, setIsPosted] = useState(false);
  const [ratingProvided, setRatingProvided] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://localhost:44331/api/Patient/${new URLSearchParams(window.location.search).get("id")}`,{
      method:'GET',
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("patienttoken")}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setUser(json);
        setIsPosted(json.isPosted);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (user.nurseId) {
      fetch(`https://localhost:44331/api/Nurse/${user.nurseId}`,{
        method:'GET',
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("patienttoken")}`,
        },
      })
        .then((response) => response.json())
        .then((json) => setNurse(json));
    }
  }, [user.nurseId]);

  useEffect(() => {
    fetch(`https://localhost:44331/api/Admin/Device/${user.id}`,{
      method:'GET',
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("patienttoken")}`,
      },
    })
      .then((response) => response.json())
      .then((json) => setDevices(json));
  }, [user.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleRatingChange = (value) => {
    setRating(value);
    setRatingProvided(true);
  };

  const handlePost = () => {
    if (user.nurseId && !isPosted && ratingProvided) {
      const confirmed = window.confirm(
        "You can provide a rating only once. Do you want to proceed?"
      );
      if (!confirmed) {
        return;
      }

      fetch(`https://localhost:44331/api/Nurse/${user.nurseId}`,{
        method:'GET',
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("patienttoken")}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          const count = json.postedCount + 1;
          const totalRating = (json.rating + rating) ;
          const updatedNurse = { ...json, postedCount: count, rating: totalRating };

          return fetch(`https://localhost:44331/api/Nurse/${user.nurseId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("patienttoken")}`,
            },
            body: JSON.stringify(updatedNurse),
          });
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error updating nurse");
          }
          return fetch(`https://localhost:44331/api/Patient/${user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("patienttoken")}`,
            },
            body: JSON.stringify({ ...user, isPosted: true }),
          });
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error updating patient");
          }
          setIsPosted(true); 
          setShowSuccessMessage(true); 
          setTimeout(() => {
            setShowSuccessMessage(false); 
          }, 3000);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="container mt-4">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="text-center">
          <h2>Patient Details</h2>
          <ul className="list-group mx-auto" style={{ maxWidth: "500px" }}>
            <li className="list-group-item">
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </li>
            <li className="list-group-item">
              <strong>Email:</strong> {user.email}
            </li>
            <li className="list-group-item">
              <strong>Phone:</strong> {user.mobile}
            </li>
            <li className="list-group-item">
              <strong>Gender:</strong> {user.gender}
            </li>
            <li className="list-group-item">
              <strong>Date of Birth:</strong> {formatDate(user.dob)}
            </li>
            <li className="list-group-item">
              <strong>Address:</strong> {user.address}
            </li>
            <li className="list-group-item">
              <strong>Date:</strong> {formatDate(user.date)}
            </li>
            <li className="list-group-item">
              <strong>Active:</strong> {user.isActive ? "Yes" : "No"}
            </li>
            <li className="list-group-item">
              <strong>Status:</strong> {user.result}
            </li>
          </ul>
          <button
            type="submit"
            onClick={() => navigate(`../editpatient?id=${user.id}`)}
            className="btn btn-info"
          >
            Edit <FaUserEdit/>
          </button>
        </div>
      )}
      {user.isActive && (
        <div className="text-center mt-4">
          <h2>Nurse Details</h2>
          <ul className="list-group mx-auto" style={{ maxWidth: "500px" }}>
            <li className="list-group-item">
              <strong>ID:</strong> {nurse.id}
            </li>
            <li className="list-group-item">
              <strong>Name:</strong> {nurse.firstName} {nurse.lastName}
            </li>
            <li className="list-group-item">
              <strong>Phone:</strong> {nurse.mobile}
            </li>
          </ul>
        </div>
      )}
      {!user.isActive && (
        <div className="text-center mt-4">
          <h2>Nurse Details</h2>
          <ul className="list-group mx-auto" style={{ maxWidth: "500px" }}>
            <li className="list-group-item">
              <strong>ID:</strong> {nurse.id}
            </li>
            <li className="list-group-item">
              <strong>Name:</strong> {nurse.firstName} {nurse.lastName}
            </li>
            <li className="list-group-item">
              <strong>Phone:</strong> {nurse.mobile}
            </li>
            <li className="list-group-item">
              <strong>Rating:</strong>{" "}
              <div className="rating-container">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    onClick={() => handleRatingChange(index + 1)}
                  >
                    {index < rating ? (
                      <FaStar className="star" />
                    ) : (
                      <AiOutlineStar className="star" />
                    )}
                  </span>
                ))}
              </div>
            </li>
            <li className="list-group-item">
              <button
                disabled={isPosted}
                onClick={handlePost}
                className="btn btn-primary"
              >
                {isPosted ? "Posted" : "Post"}
              </button>
              {showSuccessMessage && (
                <p className="text-success">Thanks for giving feedback!</p>
              )}
            </li>
          </ul>
        </div>
      )}
      {!user.isActive && devices.length > 0 && (
        <div className="text-center mt-4">
          <h2>Device Details</h2>
          <table className="table mx-auto" style={{ maxWidth: "500px" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Test Date</th>
                <th>Patient Info</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td>{device.name}</td>
                  <td>{formatDate(device.testDate)}</td>
                  <td>{device.patientInfo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetPatient;
