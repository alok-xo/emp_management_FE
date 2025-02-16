import React, { useState, useEffect, useRef } from "react";
import "../Css/table.css";
import { FaEllipsisV } from "react-icons/fa";
import Dropdown from "../Components/Dropdown"; 
import { server } from "../API/Server";

const statuses = ["New", "Scheduled", "Ongoing", "Selected", "Rejected"];

const TableComponent = ({ data = [], columns = [], onEdit, onDelete, onStatusChange, customStatuses }) => {
    const [selectedStatus, setSelectedStatus] = useState({});
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const actionMenuRef = useRef(null);

    const handleDeleteCandidate = async (candidate) => {
        try {
            console.log("candidate email:", candidate.email);

            if (!candidate.email) {
                console.error("Candidate email is required for deletion.");
                return;
            }

            const token = localStorage.getItem("accessToken"); 

            const response = await fetch(`${server}/submission/delete_employee`, {
                method: 'DELETE', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: candidate.email }) 
            });

            if (!response.ok) {
                throw new Error(`Failed to delete candidate: ${response.statusText}`);
            }

            console.log(`Candidate ${candidate.email} deleted successfully`);

            onDelete(candidate); 
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error("Error deleting candidate:", error);
        }
    };



    useEffect(() => {
        const initialStatus = data.reduce((acc, item, index) => {
            acc[index] = item.status || "Select Status";
            return acc;
        }, {});
        setSelectedStatus(initialStatus);
    }, [data]);

    const handleStatusChange = async (index, status, item) => {
        setSelectedStatus((prev) => ({ ...prev, [index]: status }));
        if (onStatusChange) {
            await onStatusChange(item.email, status);
        }
    };

    const toggleActionMenu = (index, event) => {
        event.stopPropagation();
        setActionMenuOpen(actionMenuOpen === index ? null : index);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
                setActionMenuOpen(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="table-container">
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Sr.no</th>
                        {columns.map((column, index) => (
                            <th key={index} data-align={column.align}>{column.label}</th>
                        ))}
                        <th>Action</th> 
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} data-align={column.align}>
                                        {column.key === "status" ? (
                                            <Dropdown
                                                label="Select Status"
                                                options={customStatuses || statuses}
                                                selected={selectedStatus[index]}
                                                setSelected={(status) => handleStatusChange(index, status, item)}
                                            />
                                        ) : (
                                            item[column.key]
                                        )}
                                    </td>
                                ))}
                                <td className="action-cell">
                                    <div className="action-menu" ref={actionMenuRef}>
                                        <FaEllipsisV className="action-icon" onClick={(event) => toggleActionMenu(index, event)} />
                                        {actionMenuOpen === index && (
                                            <ul className="action-dropdown">
                                                <li onClick={() => onEdit(item)}>Edit</li>
                                                <li onClick={() => handleDeleteCandidate(item)}>Delete</li>
                                            </ul>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className="no-data-row">
                            <td colSpan={columns.length + 2} className="no-data-message">
                                No data available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export { TableComponent };
