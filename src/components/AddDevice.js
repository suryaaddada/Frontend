import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';




export const AddDevice = () => {
  const [name, setName] = useState('');
  const [patientId, setPatientId] = useState(1);
  const [deviceCost, setDeviceCost] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deviceData = {
      name: name,
      patientId: patientId,
      deviceCost: deviceCost,
    };

    try {
      const response = await fetch('https://localhost:44331/api/Admin/Device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${sessionStorage.getItem('admintoken')}`,
        },
        body: JSON.stringify(deviceData),
      });

      if (response.ok) {
        console.log('Device added successfully!');
        
        setName('');
        setPatientId(1);
        setDeviceCost(0);
      } else {
        console.error('Error adding device:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  return (
    <div className="container mt-4" style={{ backgroundColor: '#f2f2f2' }}>
      <h2 className="text-center">Add Device</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Device Name:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)} 
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deviceCost">Device Cost:</label>
          <input
            type="text"
            className="form-control"
            id="deviceCost"
            value={deviceCost}
            onChange={(e) => setDeviceCost(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1, { replace: true })}
        >
          Back  
        </button>
      </form>
    </div>
  );
};
