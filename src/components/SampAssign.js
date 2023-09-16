import React, { useState, useEffect } from 'react';

export const ActivePatients = () => {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('https://localhost:44331/api/Admin/GetPatient');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredPatients = filter === 'Active'
    ? patients.filter(patient => patient.isActive)
    : filter === 'Inactive'
      ? patients.filter(patient => !patient.isActive)
      : patients;

  const activePatientCount = patients.filter(patient => patient.isActive).length;
  const inactivePatientCount = patients.filter(patient => !patient.isActive).length;
  const totalPatientCount = patients.length;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Patient Statistics</h2>

      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Active Patients</th>
            <th>Inactive Patients</th>
            <th>Total Patients</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{activePatientCount}</td>
            <td>{inactivePatientCount}</td>
            <td>{totalPatientCount}</td>
          </tr>
        </tbody>
      </table>

      <div className="text-center mt-4">
        <h3>Filter Patients</h3>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="filter"
            id="filterActive"
            value="Active"
            checked={filter === 'Active'}
            onChange={handleFilterChange}
          />
          <label className="form-check-label" htmlFor="filterActive">
            Active
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="filter"
            id="filterInactive"
            value="Inactive"
            checked={filter === 'Inactive'}
            onChange={handleFilterChange}
          />
          <label className="form-check-label" htmlFor="filterInactive">
            Inactive
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="filter"
            id="filterAll"
            value="All"
            checked={filter === 'All'}
            onChange={handleFilterChange}
          />
          <label className="form-check-label" htmlFor="filterAll">
            All
          </label>
        </div>
      </div>
     

      {filter === 'Active' && (
        <h2 className="text-center mt-4">Active Patients</h2>
      )}
      {filter === 'Inactive' && (
        <h2 className="text-center mt-4">Inactive Patients</h2>
      )}
      {filter === 'All' && (
        <h2 className="text-center mt-4">All Patients</h2>
      )}

      {filteredPatients.length === 0 ? (
        <p className="text-center">No patients available.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Address</th>
              <th>Mobile</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.firstName}</td>
                <td>{patient.lastName}</td>
                <td>{patient.gender}</td>
                <td>{formatDate(patient.dob)}</td>
                <td>{patient.address}</td>
                <td>{patient.mobile}</td>
                <td>{patient.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
