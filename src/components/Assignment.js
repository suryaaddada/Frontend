import React, { useEffect, useState } from 'react';

export const Assignment = () => {
  const [patients, setPatients] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [error, setError] = useState(null);
  const [updatedPatientId, setUpdatedPatientId] = useState(null);
  const [nurseEmails, setNurseEmails] = useState([]); 
  const [selectedNurseEmails, setSelectedNurseEmails] = useState({});

  useEffect(() => {
    fetch('https://localhost:44331/api/Admin/GetPatient',{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${sessionStorage.getItem('admintoken')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
       
        const filteredPatients = data.filter(patient => !patient.isAssigned);
        setPatients(filteredPatients);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
        setError('Failed to fetch patients');
      });

    fetch('https://localhost:44331/api/Admin/GetNurse',{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${sessionStorage.getItem('admintoken')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
       
        const filteredNurses = data.filter(nurse => nurse.isApproved);
        const sortedNurses = filteredNurses.sort((a, b) => a.patientCount - b.patientCount);
        setNurses(sortedNurses);
        const nurseEmailList = sortedNurses.map(nurse => nurse.email);
        setNurseEmails(nurseEmailList);
      })
      .catch(error => {
        console.error('Error fetching nurses:', error);
        setError('Failed to fetch nurses');
      });
  }, []);

  const updatePatientNurseId = async (patientId, nurseId) => {
    try {
      const selectedEmail = selectedNurseEmails[patientId];
      const patientToUpdate = patients.find(patient => patient.id === patientId);
      const nurseId = nurses.find(nurse => nurse.email === selectedEmail)?.id;
      const updatedPatient = { ...patientToUpdate, isAssigned: true, nurseId };

      const patientResponse = await fetch(`https://localhost:44331/api/Admin/Patient/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${sessionStorage.getItem('admintoken')}`,
        },
        body: JSON.stringify(updatedPatient),
      });

      if (!patientResponse.ok) {
        throw new Error('Failed to update patient');
      }

      setPatients(prevPatients => prevPatients.filter(patient => patient.id !== patientId));
      setUpdatedPatientId(patientId);

      const nurseToUpdate = nurses.find(nurse => nurse.id === nurseId);
      const updatedNurse = {
        ...nurseToUpdate,
        patientCount: nurseToUpdate.patientCount + 1,
      };

      

      const nurseResponse = await fetch(`https://localhost:44331/api/Admin/Nurse/${nurseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${sessionStorage.getItem('admintoken')}`,
        },
        body: JSON.stringify(updatedNurse),
      });

      if (!nurseResponse.ok) {
        throw new Error('Failed to update nurse');
      }

      setNurses(prevNurses => {
        const updatedNurses = prevNurses.map(nurse => {
          if (nurse.id === nurseId) {
            return { ...nurse, patientCount: nurse.patientCount + 1 };
          }
          return nurse;
        });
        return updatedNurses;
      });
    } catch (error) {
      console.error('Error updating patient and nurse:', error);
      setError('Failed to update patient and nurse');
    }
  };

  const handleNurseIdChange = (event, patientId) => {
    const updatedPatients = patients.map(patient => {
      if (patient.id === patientId) {
        const nurseId = event.target.value !== '' ? parseInt(event.target.value) : null;
        return { ...patient, nurseId };
      }
      return patient;
    });
    setPatients(updatedPatients);
  };

  const isNurseIdValid = nurseId => {
    return nurses.some(nurse => nurse.id === nurseId);
  };
  const handleNurseEmailChange = (event, patientId) => {
    const selectedEmail = event.target.value;
    setSelectedNurseEmails(prevEmails => ({ ...prevEmails, [patientId]: selectedEmail }));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h2>Patients</h2>
          {error && <p className="text-danger">{error}</p>}
          <table className="table table-striped ">
            <thead>
              <tr>
               
                <th>Name</th>
                <th>Gender</th>
                <th>Nurse Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="5">No patients available</td>
                </tr>
              ) : (
                patients.map(patient => (
                  <tr key={patient.id} className={updatedPatientId === patient.id ? 'updated' : ''}>
                  
                    <td>{patient.firstName} {patient.lastName}</td>
                    <td>{patient.gender}</td>
                    <td>
                    
                      <select
                        className="form-control"
                        value={selectedNurseEmails[patient.id] || ''}
                        onChange={event => handleNurseEmailChange(event, patient.id)}>
                        <option value="">Select Nurse Email</option>
                        {nurseEmails.map(email => (
                          <option key={email} value={email}>
                            {email}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => updatePatientNurseId(patient.id, selectedNurseEmails[patient.id])}
                        
                      >
                        {updatedPatientId === patient.id ? '✔' : 'Update'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="col-md-6">
          <h2>Nurses</h2>
          {error && <p className="text-danger">{error}</p>}
          <table className="table table-striped ">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Patient Count</th>
              </tr>
            </thead>
            <tbody>
              {nurses.length === 0 ? (
                <tr>
                  <td colSpan="3">No nurses available</td>
                </tr>
              ) : (
                nurses.map(nurse => (
                  <tr key={nurse.id}>
                    <td>{nurse.email}</td>
                    <td>{nurse.firstName} {nurse.lastName}</td>
                    <td>{nurse.gender}</td>
                    <td>{nurse.patientCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Assignment;
