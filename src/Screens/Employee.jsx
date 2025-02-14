import React, { useState, useMemo } from "react";
import { TableComponent } from "../Components/Tables"; // Reusable table component
import { FaSearch } from "react-icons/fa";
import "../Css/employee.css";
import { ThemeProvider } from "../Components/Layout/ThemeContext";
import Modal from "../Components/Modal";
import Dropdown from "../Components/Dropdown"; // Import Dropdown component

// Mock Employee Data
const allEmployees = [
    { name: "Bob Smith", email: "bob.smith@example.com", phone: "987-654-3210", position: "Software Engineer", department: "IT", dateOfJoining: "2020-06-20" },
];

const positions = ["All", "HR Manager", "Software Engineer", "Designer", "Product Manager", "Sales Executive"];

const Employee = () => {
    const [position, setPosition] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const filteredEmployees = useMemo(() => {
        return allEmployees.filter((e) =>
            (position === "All" || e.position === position) &&
            (e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [position, searchQuery]);

    // Table Column Configuration
    const employeeColumns = [
        { label: "Employee Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
        { label: "Position", key: "position" },
        { label: "Department", key: "department" },
        { label: "Date of Joining", key: "dateOfJoining" },
    ];

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    return (
        <ThemeProvider>
            <div className="employee-container">
                <h2>Employees</h2>

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
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <TableComponent data={filteredEmployees} columns={employeeColumns} onEdit={handleEdit} />

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
