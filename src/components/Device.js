import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdAddCircle } from "react-icons/io";

export const Device = () => {
  const [devices, setDevices] = useState([]);
  const navigate=useNavigate();

  useEffect(() => { 
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    const id=1;
    try {
      const response = await fetch(`https://localhost:44331/api/Admin/Device/${id}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${sessionStorage.getItem('admintoken')}`,
        },
      });
      const data = await response.json();
      
      setDevices(data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };


  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Available Devices</h2>
      {devices.length === 0 ? (
        <p className="text-center">No Devices  available.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Device Name</th>
              
              <th>Cost of Device</th>
            </tr>
          </thead>
          <tbody>
            {devices.map(device => (
              <tr key={device.id}>
                <td>{device.name}</td>
                <td>{device.deviceCost}</td>

              </tr>
            ))}
          </tbody>
        </table> 

        
      )}
       <div className="text-center"> 
      <button className="btn btn-warning" onClick={() => navigate('../addDevice')}>
        Add Device <IoMdAddCircle/>
      </button>
    </div>
    </div>
  );
};
