import React, { useState, useMemo, useEffect } from "react";
import { TableComponent } from "../Components/Tables"; // Reusable table component
import { FaSearch } from "react-icons/fa";
import "../Css/employee.css";
import { ThemeProvider } from "../Components/Layout/ThemeContext";
import Modal from "../Components/Modal";
import Dropdown from "../Components/Dropdown"; // Import Dropdown component
import { employeeAPI } from '../API/Employee';

// Remove the mock data
// const allEmployees = [ ... ];

const positions = ["All", "intern", "Software Engineer", "Designer", "Product Manager", "Sales Executive"];

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [position, setPosition] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    // Add useEffect to fetch employees
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const response = await employeeAPI.getAllEmployees();
                // Map the employees to match our table structure
                const formattedEmployees = response.employees.map(emp => ({
                    ...emp,
                    // Format date if needed
                    createdAt: new Date(emp.createdAt).toLocaleDateString()
                }));
                setEmployees(formattedEmployees);
                setError(null);
            } catch (err) {
                setError('Failed to fetch employees');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const filteredEmployees = useMemo(() => {
        return employees.filter((e) =>
            (e.status.toLowerCase() === "selected") && // Only show Selected employees (case-insensitive)
            (position === "All" || e.position === position) &&
            (e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [position, searchQuery, employees]);

    // Table Column Configuration
    const employeeColumns = [
        { label: "Employee Name", key: "fullName" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phoneNumber" },
        { label: "Position", key: "position" },
        { label: "Experience", key: "experience" },
        { label: "Status", key: "status" },
        { label: "Joining Date", key: "createdAt" },
    ];

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleStatusChange = (employee) => {
        // Implementation of handleStatusChange function
    };

    return (
        <ThemeProvider>
            <div className="employee-container">
                <h2>Employees</h2>

                {/* Add loading and error states */}
                {loading && <div className="loading">Loading employees...</div>}
                {error && <div className="error">{error}</div>}

                {/* Filters Section */}
                <div className="filter-section">
                    {/* Position dropdown now correctly displays "Positions" as default text */}
                    <Dropdown
                        label="Positions"
                        options={positions}
                        selected={position === "All" ? "Positions" : position}
                        setSelected={setPosition}
                    />

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

                {!loading && !error && (
                    <TableComponent
                        data={filteredEmployees}
                        columns={employeeColumns}
                        onEdit={handleEdit}
                        onStatusChange={handleStatusChange}
                    />
                )}

                {/* Employee Modal (Add/Edit) */}
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

export default Employee;
