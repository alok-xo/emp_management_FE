import React, { useState, useMemo } from "react";
import { TableComponent } from "../Components/Tables"; // Reusable table component
import { FaChevronDown, FaSearch } from "react-icons/fa";
import "../Css/attendance.css";
import { ThemeProvider } from "../Components/Layout/ThemeContext";
import Modal from "../Components/Modal";
import "../Css/attendance.css"
import Dropdown from "../Components/Dropdown";

// Mock Attendance Data
const allAttendance = [
    {
        profile: "https://via.placeholder.com/50", // Profile Image Placeholder
        name: "Bob Smith",
        position: "Software Engineer",
        department: "IT",
        task: "Feature Development",
        status: "Present",
    },
    {
        profile: "https://via.placeholder.com/50",
        name: "Alice Johnson",
        position: "HR Manager",
        department: "HR",
        task: "Interviews",
        status: "Absent",
    },
];

// const statuses = ["All", "New", "Scheduled", "Ongoing", "Selected", "Rejected"];

const attendanceStatuses = ["Present", "Absent"]; // Define attendance-specific statuses

const Attendance = () => {
    const [status, setStatus] = useState("Status");
    const [position, setPosition] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const filteredAttendance = useMemo(() => {
        return allAttendance.filter((e) =>
            (status === "Status" || e.status === status) &&
            (position === "All" || e.position === position) &&
            (e.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [status, position, searchQuery]);

    // Table Column Configuration
    const attendanceColumns = [
        { label: "Profile", key: "profile", type: "image" }, // Image column
        { label: "Employee Name", key: "name" },
        { label: "Position", key: "position" },
        { label: "Department", key: "department" },
        { label: "Task", key: "task" },
        { label: "Status", key: "status" },
        // { label: "Action", key: "action", type: "button" }, // Action buttons
    ];

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    return (
        <ThemeProvider>
            <div className="attendance-container">
                <h2>Attendance</h2>

                {/* Filters Section */}
                <div className="filter-section">
                    <Dropdown label="Status" options={attendanceStatuses} selected={status} setSelected={setStatus} />
                    <div className="search-box">
                        {/* <FaSearch className="search-icon" /> */}
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <TableComponent 
                    data={filteredAttendance} 
                    columns={attendanceColumns} 
                    onEdit={handleEdit}
                    customStatuses={attendanceStatuses} // Pass custom statuses to table
                />

                {/* Attendance Modal (Add/Edit) */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    employeeData={editingEmployee}
                    isCandidate={false} // Ensures only Employee-specific fields are shown
                />
            </div>
        </ThemeProvider>
    );
};

export default Attendance;
