import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
 
export const GetNurse = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`https://localhost:44331/api/Nurse/${new URLSearchParams(window.location.search).get("id")}`,{
      method:"GET",
      headers:{
        "Content-type":"application/json",
        Authorization:`Bearer ${sessionStorage.getItem('nursetoken')}`,
      },
    })
      .then((response) => response.json())
      .then((json) => setUser(json))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString); 
    return date.toLocaleDateString();
  };

  const handleEdit = () => {
    navigate(`../editnurse?id=${user.id}`);
  };

  return (
    <div className="container mt-4">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="text-center">
          <h2>Nurse Details</h2>
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
              <strong>Approved:</strong> {user.isApproved ? "Yes" : "No"}
            </li>
            <li className="list-group-item">
              <strong>No of Patients:</strong> {user.patientCount}
            </li>
            <li className="list-group-item">
              <strong>Salary:</strong> {user.annualSalary}
            </li>
            <li className="list-group-item">
              <strong>Rating:</strong>  { parseFloat((user.rating/user.postedCount).toFixed(2))}
            </li>

          </ul>
          <button type="button" onClick={handleEdit} className="btn btn-info">
            Edit <FaUserEdit/>
          </button>
        </div>
      )}
    </div>
  );
};
