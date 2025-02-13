import React, { useState, useEffect, useRef } from "react";
import "../Css/table.css";
import { FaEllipsisV, FaChevronDown } from "react-icons/fa"; // Icons

const statuses = ["New", "Scheduled", "Ongoing", "Selected", "Rejected"];

const TableComponent = ({ data = [], columns = [], onEdit }) => {
    const [selectedStatus, setSelectedStatus] = useState(
        data.reduce((acc, item, index) => {
            acc[index] = item.status || "";
            return acc;
        }, {})
    );

    const [dropdownOpen, setDropdownOpen] = useState(null); // Track open dropdown
    const [actionMenuOpen, setActionMenuOpen] = useState(null); // Track action menu
    const actionMenuRef = useRef(null); // Ref to detect clicks outside

    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    const toggleActionMenu = (index, event) => {
        event.stopPropagation(); // Prevent event bubbling
        setActionMenuOpen(actionMenuOpen === index ? null : index);
    };

    const updateStatus = (index, status) => {
        setSelectedStatus({ ...selectedStatus, [index]: status });
        setDropdownOpen(null); // Close dropdown after selection
    };

    // Close action menu when clicking outside
    useEffect(() => {
        const closeMenu = (event) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
                setActionMenuOpen(null);
            }
        };
        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, []);

    return (
        <div className="table-container">
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Sr.no</th>
                        {columns.map((column, index) => (
                            <th key={index}>{column.label}</th>
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
                                    <td key={colIndex}>
                                        {column.key === "status" ? (
                                            <div className="status-dropdown">
                                                <button
                                                    className="dropdown-button"
                                                    onClick={() => toggleDropdown(index)}
                                                >
                                                    {selectedStatus[index] || "Select Status"} <FaChevronDown />
                                                </button>
                                                {dropdownOpen === index && (
                                                    <ul className="dropdown-menu">
                                                        {statuses.map((status) => (
                                                            <li key={status} onClick={() => updateStatus(index, status)}>
                                                                {status}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ) : (
                                            item[column.key]
                                        )}
                                    </td>
                                ))}

                                {/* Action Menu (Edit/Delete) */}
                                <td className="action-cell">
                                    <div className="action-menu" ref={actionMenuRef}>
                                        <FaEllipsisV
                                            className="action-icon"
                                            onClick={(event) => toggleActionMenu(index, event)}
                                        />
                                        {actionMenuOpen === index && (
                                            <ul className="action-dropdown">
                                                <li onClick={() => onEdit(item)}>Edit</li>
                                                <li onClick={() => console.log("Delete clicked for", item)}>Delete</li>
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
