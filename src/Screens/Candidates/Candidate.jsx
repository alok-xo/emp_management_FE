import React, { useState, useMemo } from "react";
import { TableComponent } from "../../Components/Tables";
import { FaSearch } from "react-icons/fa";
import "../../Css/candidate/candidate.css";
import { ThemeProvider } from "../../Components/Layout/ThemeContext";
import Modal from "../../Components/Modal";
import Dropdown from "../../Components/Dropdown";

const allCandidates = [
    { name: "Jane Copper", email: "jane.copper@example.com", phone: "(704) 555-0127", position: "Designer Intern", status: "New", experience: "0 years" },
    { name: "John Doe", email: "john.doe@example.com", phone: "(987) 654-3210", position: "Developer", status: "Scheduled", experience: "2 years" },
];

const statuses = ["All", "New", "Scheduled", "Ongoing", "Selected", "Rejected"];
const positions = ["All", "Designer Intern", "Developer", "Manager", "HR", "Tester"];

const Candidate = () => {
    const [status, setStatus] = useState("All");
    const [position, setPosition] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredCandidates = useMemo(() => {
        return allCandidates.filter((c) =>
            (status === "All" || c.status === status) &&
            (position === "All" || c.position === position) &&
            (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [status, position, searchQuery]);

    const candidateColumns = [
        { label: "Candidate Name", key: "name" },
        { label: "Email Address", key: "email" },
        { label: "Phone Number", key: "phone" },
        { label: "Position", key: "position" },
        { label: "Status", key: "status" }, // Dropdown applied here
        { label: "Experience", key: "experience" },
    ];

    return (
        <ThemeProvider>
            <div className="candidate-container">
                <h2>Candidates</h2>

                <div className="filter-section">
                    <Dropdown label="Status" options={statuses} selected={status} setSelected={setStatus} />

                    {/* Position dropdown now correctly displays "Positions" as default text */}
                    <Dropdown
                        label="Positions"
                        options={positions}
                        selected={position === "All" ? "Positions" : position}
                        setSelected={setPosition}
                    />

                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <button className="add-candidate-button" onClick={() => setIsModalOpen(true)}>Add Candidate</button>
                </div>

                <TableComponent data={filteredCandidates} columns={candidateColumns} />

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCandidate={true} />
            </div>
        </ThemeProvider>
    );
};

export default Candidate;
