import React, { useState, useMemo, useEffect } from "react";
import { TableComponent } from "../../Components/Tables";
import { FaSearch } from "react-icons/fa";
import "../../Css/candidate/candidate.css";
import { ThemeProvider } from "../../Components/Layout/ThemeContext";
import Modal from "../../Components/Modal";
import Dropdown from "../../Components/Dropdown";
import { submitCandidate, getAllCandidates, deleteCandidate, updateCandidateStatus } from '../../API/Candidate';
import axios from "axios";

const allCandidates = [
    { name: "Jane Copper", email: "jane.copper@example.com", phone: "(704) 555-0127", position: "Intern", status: "New", experience: "0 years" },
    { name: "John Doe", email: "john.doe@example.com", phone: "(987) 654-3210", position: "Developer", status: "Scheduled", experience: "2 years" },
];

const statuses = ["All", "New", "Scheduled", "Ongoing", "Selected", "Rejected"];
const positions = ["All", "Intern", "Developer", "Manager", "HR", "Tester"];

const Candidate = () => {
    const [status, setStatus] = useState("All");
    const [position, setPosition] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const employees = await getAllCandidates();
            // Transform the data to match the expected format
            const formattedCandidates = employees.map(emp => ({
                name: emp.fullName,
                email: emp.email,
                phone: emp.phoneNumber,
                position: emp.position,
                status: emp.status,
                experience: `${emp.experience} years`
            }));
            setCandidates(formattedCandidates);
        } catch (error) {
            console.error('Error fetching candidates:', error);
            // Add error handling here
        } finally {
            setLoading(false);
        }
    };

    const filteredCandidates = useMemo(() => {
        return candidates.filter((c) =>
            (status === "All" || c.status === status) &&
            (position === "All" || c.position === position) &&
            (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [status, position, searchQuery, candidates]);

    const candidateColumns = [
        { label: "Candidate Name", key: "name" },
        { label: "Email Address", key: "email" },
        { label: "Phone Number", key: "phone" },
        { label: "Position", key: "position" },
        { label: "Status", key: "status" }, // Dropdown applied here
        { label: "Experience", key: "experience" },
    ];

    const handleSubmitCandidate = async (formData) => {
        try {
            // Add declaration field to the FormData
            formData.append('declaration', 'true');

            // Add department and joiningDate with default values if needed
            formData.append('department', 'Engineering'); // You might want to make this dynamic
            formData.append('joiningDate', new Date().toISOString().split('T')[0]);

            // Get the authentication token from wherever you store it
            const token = localStorage.getItem("accessToken"); // Replace with actual token management

            await submitCandidate(formData, token);
            setIsModalOpen(false);
            // Refresh the candidates list
            // fetchCandidates(); // Refresh candidates list after submission
        } catch (error) {
            console.error('Error submitting candidate:', error);
            // Add error notification here
        }
    };

    // Function to delete a candidate
    const handleDeleteCandidate = async (candidate) => {
        try {
            // Ensure candidateId is defined before making the request
            console.log("candidatewwwwwww", candidate);

            if (!candidate.id) {
                throw new Error("Candidate ID is required for deletion.");
            }
            await deleteCandidate(candidate.id); // Call the delete function with candidate ID
            // fetchCandidates(); // Refresh candidates list after deletion
        } catch (error) {
            console.error('Error deleting candidate:', error);
            // Add error notification here
        }
    };

    const handleStatusChange = async (email, newStatus) => {
        try {
            await updateCandidateStatus(email, newStatus);
            // Optionally refresh the candidates list
            await fetchCandidates();
        } catch (error) {
            console.error('Error updating candidate status:', error);
            // Add error handling here
        }
    };

    return (
        <ThemeProvider>
            <div className="candidate-container">
                <h2>Candidates</h2>

                <div className="filter-section">
                    <Dropdown label="Status" options={statuses} selected={status === "All" ? "Status" : status} setSelected={setStatus} />

                    {/* Position dropdown now correctly displays "Positions" as default text */}
                    <Dropdown
                        label="Positions"
                        options={positions}
                        selected={position === "All" ? "Positions" : position}
                        setSelected={setPosition}
                    />

                    <div className="search-box">
                        {/* <FaSearch className="search-icon" /> */}
                        <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <button className="add-candidate-button" onClick={() => setIsModalOpen(true)}>Add Candidate</button>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <TableComponent
                        data={filteredCandidates}
                        columns={candidateColumns}
                        onEdit={(candidate) => console.log('Edit candidate:', candidate)}
                        onDelete={handleDeleteCandidate}
                        onStatusChange={handleStatusChange}
                    />
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    isCandidate={true}
                    onSubmit={handleSubmitCandidate}
                />
            </div>
        </ThemeProvider>
    );
};

export default Candidate;
