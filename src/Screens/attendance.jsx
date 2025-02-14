import React, { useState, useMemo, useEffect } from "react";
import { TableComponent } from "../Components/Tables"; // Reusable table component
import "../Css/attendance.css";
import { ThemeProvider } from "../Components/Layout/ThemeContext";
import Modal from "../Components/Modal";
import Dropdown from "../Components/Dropdown";
import { updateAttendanceStatus } from "../API/Attendance";
import { employeeAPI } from "../API/Employee";

const attendanceStatuses = ["All", "Present", "Absent"];
const positions = ["All", "Intern", "Software Engineer", "Designer", "Product Manager", "Sales Executive"];

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("All");
    const [position, setPosition] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    // Fetch Employees from API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const response = await employeeAPI.getAllEmployees();
                // Format employees to match table structure
                const formattedEmployees = response.employees.map(emp => ({
                    ...emp,
                    createdAt: new Date(emp.createdAt).toLocaleDateString(),
                    attendanceStatus: emp.attendanceStatus || "Absent" // Default to Absent if no status is provided
                }));
                setEmployees(formattedEmployees);
                setError(null);
            } catch (err) {
                setError("Failed to fetch employees");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const filteredAttendance = useMemo(() => {
        return employees.filter((e) =>
            e.status === "selected" &&  // Ensure only selected employees are shown
            (status === "All" || e.attendanceStatus === status) &&
            (position === "All" || e.position === position) &&
            e.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [status, position, searchQuery, employees]);


    // Table Column Configuration
    const attendanceColumns = [
        { label: "Employee Name", key: "fullName" },
        { label: "Email", key: "email" },
        { label: "Position", key: "position" },
        { label: "Department", key: "department" },
        { label: "Status", key: "attendanceStatus" },
        { label: "Joining Date", key: "createdAt" },
    ];

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async (employeeId, newStatus) => {
        try {
            await updateAttendanceStatus(employeeId, newStatus);
            setEmployees((prevEmployees) =>
                prevEmployees.map((emp) =>
                    emp._id === employeeId ? { ...emp, attendanceStatus: newStatus } : emp
                )
            );
        } catch (error) {
            console.error("Failed to update attendance:", error);
        }
    };

    return (
        <ThemeProvider>
            <div className="attendance-container">
                <h2>Attendance</h2>

                {/* Loading and Error Handling */}
                {loading && <div className="loading">Loading employees...</div>}
                {error && <div className="error">{error}</div>}

                {/* Filters Section */}
                <div className="filter-section">
                    <Dropdown label="Status" options={attendanceStatuses} selected={status} setSelected={setStatus} />
                    {/* <Dropdown label="Position" options={positions} selected={position} setSelected={setPosition} /> */}
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {!loading && !error && (
                    <TableComponent
                        data={filteredAttendance}
                        columns={attendanceColumns}
                        onEdit={handleEdit}
                        onStatusChange={handleStatusUpdate}
                    />
                )}

                {/* Attendance Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    employeeData={editingEmployee}
                    isCandidate={false}
                />
            </div>
        </ThemeProvider>
    );
};

export default Attendance;
