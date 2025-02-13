import React, { useState, useEffect, useRef } from "react";
import "../Css/table.css";
import { FaEllipsisV, FaChevronDown } from "react-icons/fa"; // Icons

const statuses = ["New", "Scheduled", "Ongoing", "Selected", "Rejected"];

const CandidateTable = ({ candidates = [] }) => {
    const [selectedStatus, setSelectedStatus] = useState(
        candidates.reduce((acc, candidate, index) => {
            acc[index] = candidate.status;
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
                        <th>Candidate Name</th>
                        <th>Email Address</th>
                        <th>Phone Number</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Experience</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.length > 0 ? (
                        candidates.map((candidate, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{candidate.name}</td>
                                <td>{candidate.email}</td>
                                <td>{candidate.phone}</td>
                                <td>{candidate.position}</td>

                                {/* Status Dropdown */}
                                <td className="dropdown-cell">
                                    <div className="status-dropdown">
                                        <button
                                            className="dropdown-button"
                                            onClick={() => toggleDropdown(index)}
                                        >
                                            {selectedStatus[index]} <FaChevronDown />
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
                                </td>

                                <td>{candidate.experience}</td>

                                {/* Action Menu (Edit/Delete) */}
                                <td className="action-cell">
                                    <div className="action-menu" ref={actionMenuRef}>
                                        <FaEllipsisV
                                            className="action-icon"
                                            onClick={(event) => toggleActionMenu(index, event)}
                                        />
                                        {actionMenuOpen === index && (
                                            <ul className="action-dropdown">
                                                <li onClick={() => console.log("Edit clicked for", candidate)}>Edit</li>
                                                <li onClick={() => console.log("Delete clicked for", candidate)}>Delete</li>
                                            </ul>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className="no-data-row">
                            <td colSpan="8" className="no-data-message">
                                No candidates available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export { CandidateTable };
