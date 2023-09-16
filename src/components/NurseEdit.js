import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
 
export const NurseEdit = () => {
  const [patients, setPatients] = useState([]);
  const [updatedRows, setUpdatedRows] = useState([]);
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`https://localhost:44331/api/Nurse/patient/${new URLSearchParams(window.location.search).get('id')}`,{
          method:"GET",
          headers:{
            "Content-type":"application/json",
            Authorization:`Bearer ${sessionStorage.getItem('nursetoken')}`,
          },
        });
        const data = await response.json();
        const activePatients = data.filter((patient) => patient.isActive);
        setPatients(activePatients);
        setIsLoading(false); 
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
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

  const handleClose = async (patientId) => {
    try {
      const updatedPatients = patients.filter((patient) => patient.id !== patientId);
      const required = patients.find((patient) => patient.id === patientId);
      const update = { ...required, isActive: false };
      setPatients(updatedPatients);

      const response = await fetch(`https://localhost:44331/api/Patient/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${sessionStorage.getItem('nursetoken')}`,
        },
        body: JSON.stringify(update),
      });

      if (response.ok) { 

        console.log('Patient closed successfully');
      } else {
        console.error('Failed to close patient');
      }
    } catch (error) {
      console.error('Error closing patient:', error);
    }
  };

  const handleUpdate = async (patientId) => {
    try {
      const patientToUpdate = patients.find((patient) => patient.id === patientId);

      if (patientToUpdate) {
        const response = await fetch(`https://localhost:44331/api/Patient/${patientId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization:`Bearer ${sessionStorage.getItem('nursetoken')}`,
          },
          body: JSON.stringify(patientToUpdate),
        });

        if (response.ok) {
        
          setUpdatedRows((prevUpdatedRows) => [...prevUpdatedRows, patientId]);

          setTimeout(() => {
            setUpdatedRows((prevUpdatedRows) => prevUpdatedRows.filter((id) => id !== patientId));
          }, 3000);
        } else {
          console.error('Patient update failed');
        }
      }
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleViewDetails = async (patientId) => {
    if (expandedPatientId === patientId) {
      setExpandedPatientId(null);
    } else {
      try {
        const response = await fetch(`https://localhost:44331/api/Admin/Device/${patientId}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization:`Bearer ${sessionStorage.getItem('nursetoken')}`,
          },
        });
        const deviceInfo = await response.json();

        setPatients((prevPatients) => {
          return prevPatients.map((patient) => {
            if (patient.id === patientId) {
              return { ...patient, deviceInfo };
            }
            return patient;
          });
        });

        setExpandedPatientId(patientId);
      } catch (error) {
        console.error('Error fetching device information:', error);
      }
    }
  };

  return (
    <div className="container">
      <h1>Patients</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : patients.length === 0 ? (
        <p>No Patients Available</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
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
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleUpdate(patient.id)}
                        disabled={updatedRows.includes(patient.id)}
                      >
                        {updatedRows.includes(patient.id) ? 'Updated ✓' : 'Update'}
                      </button>
                      {patient.result!="Not Yet Tested"?
                      <button
                        className="btn btn-primary"
                        onClick={() => handleViewDetails(patient.id)}
                      >
                        {expandedPatientId === patient.id ? 'Hide' : 'View'}
                      </button>
                      : <h1></h1>}
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`../test?id=${patient.id}`)}
                      >
                        Test
                      </button>
                      {(patient.result==="Positive" || patient.result==="Negative" )?
                      <button
                        className="btn btn-primary"
                        onClick={() => handleClose(patient.id)}
                      >
                        Close Patient Record
                      </button> 
                      :
                      <p></p>}
                    </div>
                  </td>
                </tr>
                {expandedPatientId === patient.id && (
                  <tr>
                    <td colSpan="5">
                      <div className="row">
                        <div className="col">
                          <h4>Full Information</h4>
                          <p>ID: {patient.id}</p>
                          <p>
                            Name: {patient.firstName} {patient.lastName}
                          </p>
                          <p>Gender: {patient.gender}</p>
                          <p>DOB: {new Date(patient.dob).toLocaleDateString()}</p>
                          <p>Mobile: {patient.mobile}</p>
                          <p>Address: {patient.address}</p>
                          
                        </div>
                        <div className="col">
                          <h4>Device Information</h4>
                          {patient.deviceInfo ? (
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Patient Info</th>
                                </tr>
                              </thead>
                              <tbody>
                                {patient.deviceInfo.map((device) => (
                                  <tr key={device.id}>
                                    <td>{device.name}</td>
                                    <td>{device.patientInfo}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p>Loading device information...</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NurseEdit;
