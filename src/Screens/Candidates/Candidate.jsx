import React, { useState, useEffect, useRef } from "react";
import { CandidateTable } from "../../Components/Tables";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import "../../Css/candidate/candidate.css";
import { ThemeProvider } from "../../Components/Layout/ThemeContext";
import Modal from "../../Components/Modal";

const allCandidates = [
    { name: "Jane Copper", email: "jane.copper@example.com", phone: "(704) 555-0127", position: "Designer Intern", status: "New", experience: "0 years" },
];

const statuses = ["All", "New", "Scheduled", "Ongoing", "Selected", "Rejected"];
const positions = ["All", "Designer Intern", "Developer", "Manager", "HR", "Tester"];

const Candidate = () => {
    const [status, setStatus] = useState("All");
    const [position, setPosition] = useState("All");
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isPositionOpen, setIsPositionOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const statusDropdownRef = useRef(null);
    const positionDropdownRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!statusDropdownRef.current?.contains(event.target)) {
                setIsStatusOpen(false);
            }
            if (!positionDropdownRef.current?.contains(event.target)) {
                setIsPositionOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter candidates based on selected status & position
    const filteredCandidates = allCandidates.filter((c) =>
        (status === "All" || c.status === status) &&
        (position === "All" || c.position === position) &&
        (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <ThemeProvider>
            <div className="candidate-container">
                <h2>Candidates</h2>

                {/* Filters */}
                <div className="filter-section">
                    {/* Status Dropdown */}
                    <div className="dropdown-container" ref={statusDropdownRef}>
                        <div className="dropdown-header" onClick={() => setIsStatusOpen(!isStatusOpen)}>
                            <span>{status === "All" ? "Status" : status}</span>
                            <FaChevronDown className={`dropdown-icon ${isStatusOpen ? "open" : ""}`} />
                        </div>
                        {isStatusOpen && (
                            <ul className="dropdown-menu">
                                {statuses.map((option) => (
                                    <li key={option} onClick={() => { setStatus(option); setIsStatusOpen(false); }}>
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Position Dropdown */}
                    <div className="dropdown-container" ref={positionDropdownRef}>
                        <div className="dropdown-header" onClick={() => setIsPositionOpen(!isPositionOpen)}>
                            <span>{position === "All" ? "Position" : position}</span>
                            <FaChevronDown className={`dropdown-icon ${isPositionOpen ? "open" : ""}`} />
                        </div>
                        {isPositionOpen && (
                            <ul className="dropdown-menu">
                                {positions.map((option) => (
                                    <li key={option} onClick={() => { setPosition(option); setIsPositionOpen(false); }}>
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

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
                <CandidateTable candidates={filteredCandidates} />

                {/* Add Candidate Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </ThemeProvider>
    );
};

export default Candidate;
