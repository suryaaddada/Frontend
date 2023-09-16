import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLoginCircleFill } from "react-icons/ri";
import { BiArrowBack } from "react-icons/bi";
 
export const TestPatient = () => {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch('https://localhost:44331/api/Nurse/Device',{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${sessionStorage.getItem('nursetoken')}`,
        },
      });
      const names = await response.json();
      const currentDate = new Date().toISOString().split('T')[0];
      const initialDevices = names.map((name) => ({
        name: name,
        patientId: `${new URLSearchParams(window.location.search).get('id')}`,
        patientInfo: name === 'Digital Thermometer' ? '' : 'Positive',
        testDate: currentDate,
        deviceCost: 0,
      }));
      setDevices(initialDevices);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const handlePatientChange = (index, event) => {
    const updatedDevices = [...devices];
    updatedDevices[index].patientInfo = event.target.value;
    setDevices(updatedDevices);
  };

  const handleSubmit = async (index) => {
    try {
      const deviceToPost = devices[index];

      if (deviceToPost.name === 'Digital Thermometer') {
        deviceToPost.patientInfo += '°F'; 
      }

      const response = await fetch('https://localhost:44331/api/Nurse/Device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${sessionStorage.getItem('nursetoken')}`,
        },
        body: JSON.stringify(deviceToPost),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Device posted:', responseData);
        setIsSubmitted(true); 
      
        setTimeout(() => {
          setIsSubmitted(false); 
        }, 3000);
      } else {
        console.error('Error posting device:', response.status);
       
      }
    } catch (error) {
      console.error('Error posting device:', error);
    }
  };

  const handleSubmitAll = async () => {
    for (let index = 0; index < devices.length; index++) {
      await handleSubmit(index);
    }
  };

  return (
    <div className="container">
      <h2>Test Patient</h2>
      {isSubmitted && (
        <div className="alert alert-success" role="alert">
          Submitted successfully!
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Device Name</th>
              <th>Patient Info</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, index) => (
              <tr key={index}>
                <td>{device.name}</td>
                <td>
                  {device.name === 'Digital Thermometer' ? (
                    <input
                      type="text"
                      value={device.patientInfo}
                      onChange={(event) => handlePatientChange(index, event)}
                      className="form-control" 
                      placeholder="Enter Temperature in Fahrenheit"
                    />
                  ) : (
                    <select
                      value={device.patientInfo}
                      onChange={(event) => handlePatientChange(index, event)}
                      className="form-control"
                    >
                      <option value="Positive">Positive</option>
                      <option value="Negative">Negative</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleSubmitAll} className="btn btn-primary">
        Submit <RiLoginCircleFill/>
      </button>
      <button onClick={() => navigate(-1)} className="btn btn-secondary">
        Back <BiArrowBack/>
      </button>
    </div>
  );
};
