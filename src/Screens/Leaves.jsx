import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import default styles
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../Css/leaves.css';

const Leaves = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [status, setStatus] = useState("Status"); // Default label for the status dropdown
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
                                    {/* <th>Profile</th> */}
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Docs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.map((leave) => (
                                    <tr key={leave.id}>
                                        {/* <td>{leave.position}</td> */}
                                        <td>{leave.name}</td>
                                        <td>{leave.date}</td>
                                        <td>{leave.reason}</td>
                                        <td>
                                            <div className="custom-dropdown table-dropdown">
                                                <button className="dropdown-button" onClick={() => toggleDropdown(leave.id)}>
                                                    {leave.status}
                                                </button>
                                                {rowDropdowns[leave.id] && (
                                                    <div className="dropdown-content">
                                                        {statusOptions.slice(1).map((option) => (
                                                            <div
                                                                key={option}
                                                                className="dropdown-option"
                                                                onClick={() => {
                                                                    setLeaves(leaves.map(l => 
                                                                        l.id === leave.id ? { ...l, status: option } : l
                                                                    ));
                                                                    toggleDropdown(leave.id);
                                                                }}
                                                            >
                                                                {option}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {leave.hasDoc && (
                                                <span className="doc-icon">📄</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredLeaves.length === 0 && (
                            <div className="empty-state">
                                <p>No leaves found for the selected status</p>
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
                                    />
                                </div>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        placeholder="Designation*"
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <input 
                                        type="date" 
                                        placeholder="Leave Date*"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="document-upload">
                                        <span>Documents</span>
                                        <button className="upload-btn">
                                            <span>↑</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <input 
                                    type="text" 
                                    placeholder="Reason*"
                                    className="form-input"
                                />
                            </div>
                            <button className="save-btn">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaves;
