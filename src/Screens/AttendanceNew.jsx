import React, { useState, useEffect } from 'react';
import './EmployeeNew.css';
import Dropdown from '../Components/Dropdown';
import SearchBar from '../Components/SearchBar';

const EmployeeNew = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Status');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8000/submission/employees', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data.employees);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotalEmployees(data.totalEmployees);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (index, newStatus) => {
    try {
      const employee = employees[index];
      const response = await fetch(`http://localhost:8000/submission/updateAttendance/${employee._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          attendanceStatus: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update attendance status');
      }

      const updatedEmployees = [...employees];
      updatedEmployees[index].attendanceStatus = newStatus;
      setEmployees(updatedEmployees);
    } catch (err) {
      setError(err.message);
      // Optionally revert the UI change if the API call fails
      console.error('Error updating attendance status:', err);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    return employee.status === "selected" &&
      (selectedStatus === "Status" || employee.attendanceStatus.toLowerCase() === selectedStatus.toLowerCase());
  });


  return (
    <div className="attendance-container">
      <h1>Attendance</h1>

      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="filters">
            <Dropdown
              label="Status"
              options={['Status', 'Present', 'Absent']}
              selected={selectedStatus}
              setSelected={setSelectedStatus}
            />
            <SearchBar placeholder="Search" />
          </div>

          <table className="attendance-table">
            <thead>
              <tr className="header-row">
                <th>Profile</th>
                <th>Employee Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Task</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={employee._id}>
                  <td className="profile-cell">
                    {/* Profile image placeholder */}
                  </td>
                  <td>{employee.fullName}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department || 'N/A'}</td>
                  <td>{employee.task || 'N/A'}</td>
                  <td>
                    <select
                      value={employee.attendanceStatus}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                      className={`status-select ${employee.attendanceStatus.toLowerCase()}`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                  <td>
                    <div className="three-dots">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default EmployeeNew;
