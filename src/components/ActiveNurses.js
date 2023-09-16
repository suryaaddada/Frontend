import React, { useState, useEffect } from 'react';
import { TiTick } from "react-icons/ti";

export const ActiveNurses = () => {
  const [activeNurses, setActiveNurses] = useState([]);
  const [inactiveNurses, setInactiveNurses] = useState([]);
  const [approvedNurseId, setApprovedNurseId] = useState(null);
  const [activeNurseCount, setActiveNurseCount] = useState(0);
  const [inactiveNurseCount, setInactiveNurseCount] = useState(0);

  const [showUpdated, setShowUpdated] = useState(false);

  useEffect(() => {
    fetchNurses();
  }, []);

  const fetchNurses = async () => {
    try {
      const response = await fetch('https://localhost:44331/api/Admin/GetNurse',{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${sessionStorage.getItem('admintoken')}`,
        },
      });
      const data = await response.json();
      const activeNurses = data.filter(nurse => nurse.isApproved);
      const inactiveNurses = data.filter(nurse => !nurse.isApproved);

      setActiveNurses(activeNurses);
      setInactiveNurses(inactiveNurses);
      setActiveNurseCount(activeNurses.length);
      setInactiveNurseCount(inactiveNurses.length);
    } catch (error) {
      console.error('Error fetching nurses:', error);
    }
  };


  function calculateExperience(startDate) {
    const start = new Date(startDate);
    const present = new Date();
  
    const yearsDiff = present.getFullYear() - start.getFullYear();
    const monthsDiff = present.getMonth() - start.getMonth();
    const daysDiff = present.getDate() - start.getDate();
  
    let experience = "";
  
    if (yearsDiff > 0) {
      experience += `${yearsDiff} year${yearsDiff > 1 ? "s" : ""} `;
    }
  
    if (monthsDiff > 0) {
      experience += `${monthsDiff} month${monthsDiff > 1 ? "s" : ""} `;
    }
  
    if (daysDiff > 0) {
      experience += `${daysDiff} day${daysDiff > 1 ? "s" : ""} `;
    }
  
    return experience.trim(); 
  }
  
  
  const handleSalaryChange = (event, nurseId) => {
    const { value } = event.target;
    if (/^\d*$/.test(value)) {
      setInactiveNurses(prevNurses =>
        prevNurses.map(nurse => {
          if (nurse.id === nurseId) {
            return {
              ...nurse,
              annualSalary: value.trim() !== '' ? parseInt(value) * 12 : 0,
            };
          }
          return nurse;
        })
      );
    }
  };

  const handleApproveClick = async (nurseId) => {
    try {
      const nurseToUpdate = inactiveNurses.find(nurse => nurse.id === nurseId);
      const response = await fetch(`https://localhost:44331/api/Admin/Nurse/${nurseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${sessionStorage.getItem('admintoken')}`,
        },
        body: JSON.stringify({
          ...nurseToUpdate,
          isApproved: true,
        }),
      });
      if (response.ok) {
        setApprovedNurseId(nurseId); 

        
        const updatedInactiveNurses = inactiveNurses.map(nurse => {
          if (nurse.id === nurseId) {
            return {
              ...nurse,
              isApproved: true,
            };
          }
          return nurse;
        });

       
        const approvedNurse = updatedInactiveNurses.find(nurse => nurse.id === nurseId);
        const updatedActiveNurses = [...activeNurses, approvedNurse];

        setActiveNurses(updatedActiveNurses);
        setInactiveNurses(updatedInactiveNurses);
        setActiveNurseCount(updatedActiveNurses.length);
        setInactiveNurseCount(updatedInactiveNurses.length);

       
        setTimeout(() => {
          setApprovedNurseId(null);

          
          const filteredInactiveNurses = inactiveNurses.filter(nurse => nurse.id !== nurseId);
          setInactiveNurses(filteredInactiveNurses);
          setInactiveNurseCount(filteredInactiveNurses.length);
        }, 2000); 
      } else {
        console.error('Error approving nurse');
      }
    } catch (error) {
      console.error('Error approving nurse:', error);
    }
  };

  const handleRejectClick = async (nurseId) => {
    try {
      const response = await fetch(`https://localhost:44331/api/Admin/Nurse/${nurseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization:`Bearer ${sessionStorage.getItem('admintoken')}`,
        },
      });
      if (response.ok) {
      
        const filteredInactiveNurses = inactiveNurses.filter(nurse => nurse.id !== nurseId);
        setInactiveNurses(filteredInactiveNurses);
        setInactiveNurseCount(prevCount => prevCount - 1);
      } else {
        console.error('Error rejecting nurse');
      }
    } catch (error) {
      console.error('Error rejecting nurse:', error);
    }
  };
  
const handleAnnualSalaryChange = (event, nurseId) => {
  const { value } = event.target;
  if (/^\d*$/.test(value)) {
    setActiveNurses(prevNurses =>
      prevNurses.map(nurse => {
        if (nurse.id === nurseId) {
          return {
            ...nurse,
            annualSalary: value.trim() !== '' ? parseFloat(value) : 0,
          };
        }
        return nurse;
      })
    );
  }
};

const handleUpdateClick = async (nurseId) => {
  try {
    const nurseToUpdate = activeNurses.find(nurse => nurse.id === nurseId);
    const response = await fetch(`https://localhost:44331/api/Admin/Nurse/${nurseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization:`Bearer ${sessionStorage.getItem('admintoken')}`,
      },
      body: JSON.stringify({
        ...nurseToUpdate, 
        annualSalary: activeNurses.find(nurse => nurse.id === nurseId).annualSalary,
      }),
    });
    if (response.ok) {
      
      setActiveNurses(prevNurses =>
        prevNurses.map(nurse => {
          if (nurse.id === nurseId) {
            return {
              ...nurse,
              annualSalary: activeNurses.find(nurse => nurse.id === nurseId).annualSalary,
            };
          }
          return nurse;
        })
      );
      setShowUpdated(true);
      setTimeout(() => setShowUpdated(false), 2000);
    }
  } catch (error) {
    console.error('Error updating nurse:', error);
  }
};

  const totalNurseCount = activeNurseCount + inactiveNurseCount;

  return (
    <div className="container mt-4">
      

      <h2 className="text-center mt-4">Active Nurses</h2>
      {activeNurses.length === 0 ? (
        <p className="text-center">No active nurses available.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Annual Salary</th>
            <th>Patient Count</th>
            <th>Past Experience</th>
            <th>Present Experience</th>
            <th>Rating</th>
            <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeNurses.map(nurse => (
              <tr key={nurse.id}>
                <td>{nurse.firstName}</td>
                <td>{nurse.lastName}</td>
                <td>{nurse.gender}</td>
                <td>{nurse.address}</td>
                <td>{nurse.mobile}</td>
                <td>{nurse.email}</td>
                <td>
              
<input
  type="text"
  value={nurse.annualSalary}
  onChange={event => handleAnnualSalaryChange(event, nurse.id)}
/>
    </td>
                
                <td>{nurse.patientCount}</td>
                <td>{nurse.experience}</td>
                <td>{calculateExperience(nurse.date)}</td>
                <td>{ parseFloat((nurse.rating/nurse.postedCount).toFixed(2))}</td>
                <td>
                <button
  className="btn btn-primary"
  onClick={() => handleUpdateClick(nurse.id)}
  disabled={isNaN(activeNurses.find(nurse => nurse.id === nurse.id).annualSalary) || activeNurses.find(nurse => nurse.id === nurse.id).annualSalary <= 0}
>
  {showUpdated ? "Updating..." : "Update"}
</button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

     
     
    </div>
  );
};

export default ActiveNurses;
