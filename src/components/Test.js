import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const NurseEdit = () => {
  const [patients, setPatients] = useState([]);
  const [updatedRows, setUpdatedRows] = useState([]);
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const [expandedTestId, setExpandedTestId] = useState(null);
  const [devices, setDevices] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          `https://localhost:44331/api/Nurse/patient/${new URLSearchParams(
            window.location.search
          ).get('id')}`
        );
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('https://localhost:44331/api/Nurse/devices');
        const data = await response.json();
        setDevices(data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleResultChange = (patientId, event) => {
    const updatedPatients = patients.map((patient) => {
      if (patient.id === patientId) {
        return { ...patient, result: event.target.value };
      }
      return patient;
    });

    setPatients(updatedPatients);
  };

  const handleUpdate = async (patientId) => {
    try {
      const patientToUpdate = patients.find((patient) => patient.id === patientId);

      if (patientToUpdate) {
        const response = await fetch(`https://localhost:44331/api/Patient/${patientId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(patientToUpdate),
        });

        if (response.ok) {
        
          setUpdatedRows((prevUpdatedRows) => [...prevUpdatedRows, patientId]);

          setTimeout(() => {
            setUpdatedRows((prevUpdatedRows) =>
              prevUpdatedRows.filter((id) => id !== patientId)
            );
          }, 3000);
        } else {
          console.error('Patient update failed');
        }
      }
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleViewDetails = (patientId) => {
    setExpandedPatientId((prevExpandedPatientId) =>
      prevExpandedPatientId === patientId ? null : patientId
    );
  };

  const handleViewTest = (testId) => {
    setExpandedTestId((prevExpandedTestId) => (prevExpandedTestId === testId ? null : testId));
  };

  const handleDeviceUpdate = async (deviceId, event) => {
    const deviceToUpdate = devices.find((device) => device.id === deviceId);

    if (deviceToUpdate) {
      deviceToUpdate.patientInfo = event.target.value;

      try {
        const response = await fetch(`https://localhost:44331/api/Nurse/Device/${deviceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deviceToUpdate),
        });

        if (response.ok) {
       
          setUpdatedRows((prevUpdatedRows) => [...prevUpdatedRows, deviceId]);

          setTimeout(() => {
            setUpdatedRows((prevUpdatedRows) =>
              prevUpdatedRows.filter((id) => id !== deviceId)
            );
          }, 3000);
        } else {
          console.error('Device update failed');
        }
      } catch (error) {
        console.error('Error updating device:', error);
      }
    }
  };

  return (
    <div className="container">
      <h1>Patients</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Age</th>
            <th>Result</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <React.Fragment key={patient.id}>
              <tr>
                <td>{patient.id}</td>
                <td>
                  {patient.firstName} {patient.lastName}
                </td>
                <td>{patient.gender}</td>
                <td>{patient.dob}</td>
                <td>{calculateAge(patient.dob)}</td>
                <td>
                  <select
                    value={patient.result}
                    onChange={(event) => handleResultChange(patient.id, event)}
                  >
                    <option value="Not Yet Tested">Not Yet Tested</option>
                    <option value="Waiting for results">Waiting for results</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleUpdate(patient.id)}
                    disabled={updatedRows.includes(patient.id)}
                  >
                    {updatedRows.includes(patient.id) ? 'Updated ✓' : 'Update'}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewDetails(patient.id)}
                  >
                    {expandedPatientId === patient.id ? 'Hide' : 'View'}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewTest(patient.id)}
                  >
                    {expandedTestId === patient.id ? 'Hide Test' : 'View Test'}
                  </button>
                </td>
              </tr>
              {expandedPatientId === patient.id && (
                <tr>
                  <td colSpan="7">
                   
                    <div>
                      <h4>Full Information</h4>
                      <p>ID: {patient.id}</p>
                      <p>Name: {patient.firstName} {patient.lastName}</p>
                      <p>Mobile: {patient.mobile}</p>
                      <p>Address: {patient.address}</p>
                      
                    </div>
                  </td>
                </tr>
              )}
              {expandedTestId === patient.id && (
                <tr>
                  <td colSpan="7">
                  
                    <div>
                      <h4>Available Devices</h4>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Patient ID</th>
                            <th>Patient Info</th>
                            <th>Test Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {devices
                            .filter((device) => device.patientId === patient.id)
                            .map((device) => (
                              <tr key={device.id}>
                                <td>{device.id}</td>
                                <td>{device.name}</td>
                                <td>{device.patientId}</td>
                                <td>{device.patientInfo}</td>
                                <td>{device.testDate}</td>
                                <td>
                                  <button
                                    className="btn btn-primary"
                                    onClick={(event) => handleDeviceUpdate(device.id, event)}
                                    disabled={updatedRows.includes(device.id)}
                                  >
                                    {updatedRows.includes(device.id) ? 'Updated ✓' : 'Update'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NurseEdit;