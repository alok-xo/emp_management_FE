import React, { useState, useMemo, useEffect } from "react";
import { TableComponent } from "../Components/Tables"; 
import { FaSearch } from "react-icons/fa";
import "../Css/employee.css";
import { ThemeProvider } from "../Components/Layout/ThemeContext";
import Modal from "../Components/Modal";
import Dropdown from "../Components/Dropdown"; 
import { employeeAPI } from '../API/Employee';



const positions = ["All", "intern", "fulltime", "junior", "senior", "teamlead"];

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [position, setPosition] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [dropdowns, setDropdowns] = useState({});

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const response = await employeeAPI.getAllEmployees();
                const formattedEmployees = response.employees.map(emp => ({
                    ...emp,
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
            (e.status.toLowerCase() === "selected") && 
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
        {
            label: "Actions",
            key: "actions",
            render: (employee) => (
                <button className="delete-btn" onClick={() => handleDelete(employee._id)}>
                    🗑 Delete
                </button>
            ),
        },
    ];

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleStatusChange = (employee) => {
    };

    const handleDelete = async (employeeId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
        if (!confirmDelete) return;

        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await fetch(`${server}/submission/delete_employee/${employeeId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert("Employee deleted successfully!");
                console.log("hiiiiiiiiiiiii");
                
                window.location.reload();
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error deleting employee:", error);
            alert("Failed to delete employee.");
        }
    };



    return (
        <ThemeProvider>
            <div className="employee-container">
                <h2>Employees</h2>

                {loading && <div className="loading">Loading employees...</div>}
                {error && <div className="error">{error}</div>}

                <div className="filter-section">
                    <Dropdown
                        label="Positions"
                        options={positions}
                        selected={position === "All" ? "Positions" : position}
                        setSelected={setPosition}
                    />

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
                        data={filteredEmployees}
                        columns={employeeColumns}
                        onEdit={handleEdit}
                        onStatusChange={handleStatusChange}
                    />
                )}

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

export default Employee;
