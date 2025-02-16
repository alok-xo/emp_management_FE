import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import default styles
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../Css/leaves.css';
import { server } from '../API/Server';
import { FaFileDownload } from "react-icons/fa"; // Import the icon
import axios from 'axios';


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
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [leaveDates, setLeaveDates] = useState([]);
    const [approvedLeaves, setApprovedLeaves] = useState([]);

    const searchEmployees = async (name) => {
        if (!name) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`${server}/leave/getEmployeesByName?name=${name}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (response.data.success && response.data.data.length > 0) {
                setSearchResults(response.data.data); // Store employees list
                setShowDropdown(true); // Show dropdown
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleEmployeeSelect = (employee) => {
        setEmployeeName(employee.fullName);
        setDesignation(employee.position); // Auto-fill designation
        setShowDropdown(false); // Hide dropdown after selection
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            searchEmployees(employeeName);
        }, 300); // Debounce time to avoid excessive API calls

        return () => clearTimeout(delayDebounceFn);
    }, [employeeName]);




    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`${server}/leave/getFilteredLeaves`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();

                if (data.success) {
                    const formattedEmployees = data.data.map(employee => ({
                        _id: employee._id,
                        employeeName: employee.employeeName, // Correct key from API
                        designation: employee.designation,
                        leaveDate: new Date(employee.leaveDate).toLocaleDateString('en-GB'), // Convert to DD-MM-YYYY
                        reason: employee.reason,
                        status: employee.status,
                        document: employee.document ? `${server}/${employee.document}` : null
                    }));

                    setEmployees(formattedEmployees);

                    // Filter approved leaves
                    setApprovedLeaves(formattedEmployees.filter(emp => emp.status === "leaveApproved"));
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

        // Create FormData object
        const formData = new FormData();
        formData.append('employeeName', employeeName);
        formData.append('designation', designation);
        formData.append('leaveDate', leaveDate);
        formData.append('reason', reason);

        // Only append document if it's selected
        if (document) {
            formData.append('document', document);
        }

        try {
            const response = await fetch(`${server}/leave/addLeaveRequest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}` // No 'Content-Type', as browser auto-sets it
                },
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                toggleModal();
                window.location.reload(); // Refresh the page after successful submission
            } else {
                console.error('Error adding leave request:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            // Convert selected status to match the API format (leaveApproved, leaveRejected)
            let formattedStatus = "";
            if (newStatus === "Approve") formattedStatus = "leaveApproved";
            else if (newStatus === "Reject") formattedStatus = "leaveRejected";
            else formattedStatus = "leaveCreated"; // Default for pending

            // Update the UI first to reflect the change instantly
            setEmployees(prevEmployees =>
                prevEmployees.map(employee =>
                    employee._id === id ? { ...employee, status: formattedStatus } : employee
                )
            );

            // Make the API request
            await axios.put(
                `${server}/leave/update_status/${id}`,
                { status: formattedStatus },
                { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
            );

            setTimeout(() => {
                fetchEmployees();
            }, 500);
            window.location.reload();

        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    useEffect(() => {
        const fetchEmployeesOnLeave = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`${server}/leave/employees_on_leave`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();

                if (data.success) {
                    const dates = data.data.map(emp => {
                        const leaveDate = new Date(emp.leaveDate);
                        leaveDate.setMinutes(leaveDate.getMinutes() - leaveDate.getTimezoneOffset()); // Fix UTC shift
                        return leaveDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
                    });

                    setLeaveDates(dates);
                }
            } catch (error) {
                console.error('Error fetching employees on leave:', error);
            }
        };

        fetchEmployeesOnLeave();
    }, []);

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
                                        <td>{employee.employeeName}</td>
                                        <td>{employee.designation}</td>
                                        <td>{employee.leaveDate}</td>
                                        <td>{employee.reason}</td>
                                        <td>
                                            <select
                                                style={{ borderRadius: "2rem" }}
                                                value={
                                                    employee.status === "leaveApproved" ? "Approve" :
                                                        employee.status === "leaveRejected" ? "Reject" : "Pending"
                                                }
                                                onChange={(e) => handleStatusChange(employee._id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Approve">Approve</option>
                                                <option value="Reject">Reject</option>
                                            </select>
                                        </td>
                                        <td>
                                            {employee.document ? (
                                                <a style={{ marginLeft: "40px" }} href={employee.document} target="_blank" rel="noopener noreferrer" className="doc-link">
                                                    <FaFileDownload style={{ color: "#fff" }} className="doc-icon" />
                                                </a>
                                            ) : (
                                                <span>No Doc</span>
                                            )}
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
                        {/* <div className="month-navigator">
                            <FaChevronLeft className="nav-icon" onClick={prevMonth} />
                            <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                            <FaChevronRight className="nav-icon" onClick={nextMonth} />
                        </div> */}
                    </div>

                    {/* Calendar Component */}
                    <Calendar
                        className="custom-calendar"
                        onChange={setCurrentDate}
                        value={currentDate}
                        tileClassName={({ date, view }) => {
                            if (view === 'month') {
                                const formattedDate = new Date(date);
                                formattedDate.setMinutes(formattedDate.getMinutes() - formattedDate.getTimezoneOffset()); // Fix UTC shift
                                const dateString = formattedDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
                                return leaveDates.includes(dateString) ? "leave-highlight" : null;
                            }
                        }}
                    />
                    {approvedLeaves.length > 0 && (
                        <div className="approved-leaves-container">
                            <h3 className="approved-leaves-title">Approved Leaves</h3>
                            {approvedLeaves.map((leave) => (
                                <div key={leave._id} className="approved-leave-card">
                                    <div className="approved-leave-details">
                                        <strong className="employee-name">{leave.employeeName}</strong>
                                        <p className="designation">{leave.designation}</p>
                                    </div>
                                    <span className="leave-date">{leave.leaveDate}</span>
                                </div>
                            ))}
                        </div>
                    )}
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
                                <div className="form-group" style={{ position: "relative" }}>
                                    <input
                                        type="text"
                                        placeholder="Search Employee Name"
                                        className="form-input"
                                        value={employeeName}
                                        onChange={(e) => setEmployeeName(e.target.value)}
                                    />

                                    {/* Employee Search Dropdown */}
                                    {showDropdown && searchResults.length > 0 && (
                                        <ul className="dropdown-menu">
                                            {searchResults.map((employee) => (
                                                <li
                                                    key={employee._id}
                                                    onClick={() => handleEmployeeSelect(employee)}
                                                    className="dropdown-item"
                                                >
                                                    {employee.fullName}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Designation*"
                                        className="form-input"
                                        value={designation}
                                        readOnly
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
                                        {/* <label htmlFor="documentUpload" className="upload-label">
                                            Upload Document
                                        </label> */}
                                        <input
                                            type="file"
                                            id="documentUpload"
                                            onChange={(e) => setDocument(e.target.files[0])} // Store selected file
                                            accept=".pdf,.doc,.docx,.jpg,.png"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <input
                                    style={{ width: "44%" }}
                                    type="text"
                                    placeholder="Reason*"
                                    className="form-input"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                            <div id='btncnt'>
                                <button className="save-btn" onClick={handleAddLeaveRequest}>Save</button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaves;
