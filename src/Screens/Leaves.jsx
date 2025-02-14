import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import default styles
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../Css/leaves.css';

const Leaves = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [status, setStatus] = useState("Status"); // Default label for the status dropdown
    const [employees, setEmployees] = useState([]); // New state for employees
    const [leaves, setLeaves] = useState([
        {
            id: 1,
            name: "Jane Cooper",
            position: "Full Time Designer",
            date: "10/09/24",
            reason: "Visiting House",
            status: "Pending",
            hasDoc: true
        },
        {
            id: 2,
            name: "Robert Fox",
            position: "Software Engineer",
            date: "15/09/24",
            reason: "Family Function",
            status: "Approved",
            hasDoc: false
        },
        {
            id: 3,
            name: "Emily Wilson",
            position: "Product Manager",
            date: "20/09/24",
            reason: "Medical Leave",
            status: "Rejected",
            hasDoc: true
        }
    ]);

    const statusOptions = ["Status", "Pending", "Approved", "Rejected"];

    // Add new state for dropdown visibility
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [rowDropdowns, setRowDropdowns] = useState({});

    // Add new state for modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Add new state for leave form inputs
    const [employeeName, setEmployeeName] = useState('');
    const [designation, setDesignation] = useState('');
    const [leaveDate, setLeaveDate] = useState('');
    const [document, setDocument] = useState('');
    const [reason, setReason] = useState('');

    // Add useEffect for API call
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch('http://localhost:8000/submission/employees/present', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();

                if (data.success) {
                    setEmployees(data.employees.map(employee => ({
                        _id: employee._id,
                        fullName: employee.fullName,
                        position: employee.position,
                        createdAt: employee.createdAt,
                        status: employee.status,
                        resume: employee.resume
                    })));
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    // Function to toggle dropdown visibility
    const toggleDropdown = (id = 'main') => {
        if (id === 'main') {
            setStatusDropdownOpen(!statusDropdownOpen);
            setRowDropdowns({});
        } else {
            setRowDropdowns(prev => ({
                ...prev,
                [id]: !prev[id]
            }));
            setStatusDropdownOpen(false);
        }
    };

    // Filter leaves based on selected status
    const filteredLeaves = status === "Status"
        ? leaves
        : leaves.filter(leave => leave.status === status);

    // Move to Previous Month
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    // Move to Next Month
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    // Function to handle modal open/close
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Function to handle leave request submission
    const handleAddLeaveRequest = async () => {
        const accessToken = localStorage.getItem('accessToken');
        const leaveRequest = {
            employeeName,
            designation,
            leaveDate,
            document,
            reason
        };

        try {
            const response = await fetch('http://localhost:8000/leave/addLeaveRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(leaveRequest)
            });
            const data = await response.json();
            if (data.success) {
                // Handle success (e.g., close modal, reset form, show success message)
                toggleModal();
                // Optionally, refresh leaves or show a success message
            } else {
                // Handle error (e.g., show error message)
                console.error('Error adding leave request:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="leaves-container">
            <div className="leaves-header">
                <h1>Leaves</h1>
            </div>

            <div className="leaves-content">
                <div className="leaves-main">
                    <div className="status-filter">
                        <div className="custom-dropdown">
                            <button className="dropdown-button" onClick={() => toggleDropdown('main')}>
                                {status}
                            </button>
                            {statusDropdownOpen && (
                                <div className="dropdown-content">
                                    {statusOptions.map((option) => (
                                        <div
                                            key={option}
                                            className="dropdown-option"
                                            onClick={() => {
                                                setStatus(option);
                                                toggleDropdown('main');
                                            }}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className='zz'>
                            <div className="search-add-container">
                                <div className="search-wrapper">
                                    <input type="search" placeholder="Search" className="search-input" />
                                </div>
                                <button className="add-leave-btn" onClick={toggleModal}>Add Leave</button>
                            </div>
                        </div>
                    </div>

                    <div className="applied-leaves">
                        <h2>Applied Leaves</h2>
                        <table className="leaves-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Position</th>
                                    <th>Date</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Documents</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee._id}>
                                        <td>{employee.fullName}</td>
                                        <td>{employee.position}</td>
                                        <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                                        <td>-</td>
                                        <td>{employee.status}</td>
                                        <td>
                                            {employee.resume ? <p>View Doc</p> : 'No Doc'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {employees.length === 0 && (
                            <div className="empty-state">
                                <p>No employees found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Leave Calendar */}
                <div className="leave-calendar">
                    <div className="calendar-header">
                        <h2>Leave Calendar</h2>
                        <div className="month-navigator">
                            <FaChevronLeft className="nav-icon" onClick={prevMonth} />
                            <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                            <FaChevronRight className="nav-icon" onClick={nextMonth} />
                        </div>
                    </div>

                    {/* Calendar Component */}
                    <Calendar
                        className="custom-calendar"
                        onChange={setCurrentDate}
                        value={currentDate}
                    />
                    <div className="calendar-footer">
                        <p>Approved Leaves</p>
                    </div>
                </div>
            </div>

            {/* Add Leave Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add New Leave</h2>
                            <button className="close-button" onClick={toggleModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Search Employee Name"
                                        className="form-input"
                                        value={employeeName}
                                        onChange={(e) => setEmployeeName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Designation*"
                                        className="form-input"
                                        value={designation}
                                        onChange={(e) => setDesignation(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="date"
                                        placeholder="Leave Date*"
                                        className="form-input"
                                        value={leaveDate}
                                        onChange={(e) => setLeaveDate(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="document-upload">
                                        <span>Documents</span>
                                        <input
                                            type="text"
                                            placeholder="Document URL"
                                            className="form-input"
                                            value={document}
                                            onChange={(e) => setDocument(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Reason*"
                                    className="form-input"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                            <button className="save-btn" onClick={handleAddLeaveRequest}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaves;
