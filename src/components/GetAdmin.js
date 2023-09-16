import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";

export const GetAdmin = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    navigate(`../editadmin?id=${user.id}`);
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
          </ul>
          <button type="button" onClick={handleEdit} className="btn btn-info">
            Edit <CiEdit/>
          </button>
        </div>
      )}
    </div>
  );
};
