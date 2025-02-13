import React, { useState, useEffect, useRef, useMemo } from "react";
import { TableComponent } from "../../Components/Tables"; // Using reusable table
import { FaChevronDown, FaSearch } from "react-icons/fa";
import "../../Css/candidate/candidate.css";
import { ThemeProvider } from "../../Components/Layout/ThemeContext";
import Modal from "../../Components/Modal";

// Mock Data
const allCandidates = [
    { name: "Jane Copper", email: "jane.copper@example.com", phone: "(704) 555-0127", position: "Designer Intern", status: "New", experience: "0 years" },
    { name: "John Doe", email: "john.doe@example.com", phone: "(987) 654-3210", position: "Developer", status: "Scheduled", experience: "2 years" },
];

const statuses = ["All", "New", "Scheduled", "Ongoing", "Selected", "Rejected"];
const positions = ["All", "Designer Intern", "Developer", "Manager", "HR", "Tester"];

// Reusable Dropdown Component
const Dropdown = ({ label, options, selected, setSelected }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!dropdownRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{selected === "All" ? label : selected}</span>
                <FaChevronDown className={`dropdown-icon ${isOpen ? "open" : ""}`} />
            </div>
            {isOpen && (
                <ul className="dropdown-menu">
                    {options.map((option) => (
                        <li key={option} onClick={() => { setSelected(option); setIsOpen(false); }}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const Candidate = () => {
    const [status, setStatus] = useState("All");
    const [position, setPosition] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter candidates using useMemo for performance
    const filteredCandidates = useMemo(() => {
        return allCandidates.filter((c) =>
            (status === "All" || c.status === status) &&
            (position === "All" || c.position === position) &&
            (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [status, position, searchQuery]);

    // Table Column Configuration
    const candidateColumns = [
        { label: "Candidate Name", key: "name" },
        { label: "Email Address", key: "email" },
        { label: "Phone Number", key: "phone" },
        { label: "Position", key: "position" },
        { label: "Status", key: "status" },
        { label: "Experience", key: "experience" },
    ];

    return (
        <ThemeProvider>
            <div className="candidate-container">
                <h2>Candidates</h2>

                {/* Filters Section */}
                <div className="filter-section">
                    <Dropdown label="Status" options={statuses} selected={status} setSelected={setStatus} />
                    <Dropdown label="Position" options={positions} selected={position} setSelected={setPosition} />

                    {/* Search Box */}
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button
                        className="add-candidate-button"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Candidate
                    </button>
                </div>

                {/* Candidate Table */}
                <TableComponent data={filteredCandidates} columns={candidateColumns} />

                {/* Add Candidate Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    isCandidate={true} // Ensures Experience & Resume fields are shown
                />
            </div>
        </ThemeProvider>
    );
};

export default Candidate;
