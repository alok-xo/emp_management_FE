import React, { useState, useMemo, useEffect } from "react";
import { TableComponent } from "../../Components/Tables";
import { FaSearch } from "react-icons/fa";
import "../../Css/candidate/candidate.css";
import { ThemeProvider } from "../../Components/Layout/ThemeContext";
import Modal from "../../Components/Modal";
import Dropdown from "../../Components/Dropdown";
import { submitCandidate, getAllCandidates, deleteCandidate, updateCandidateStatus } from '../../API/Candidate';
import axios from "axios";
import { server } from "../../API/Server";

const allCandidates = [
    { name: "Jane Copper", email: "jane.copper@example.com", phone: "(704) 555-0127", position: "Intern", status: "New", experience: "0 years" },
    { name: "John Doe", email: "john.doe@example.com", phone: "(987) 654-3210", position: "Developer", status: "Scheduled", experience: "2 years" },
];

const statuses = ["All", "new", "scheduled", "ongoing", "selected", "rejected"];
const positions = ["All", "intern", "fulltime", "junior", "senior", "teamlead"];

const Candidate = () => {
    const [status, setStatus] = useState("All");
    const [position, setPosition] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState(null);


    const handleEditCandidate = (candidate) => {
        setSelectedCandidate(candidate); // Set selected candidate data
        setIsModalOpen(true); // Open modal
    };

    const handleUpdateCandidate = async (formData) => {
        try {
            const token = localStorage.getItem("accessToken");

            const response = await axios.put(
                `${server}/submission/update_employee`,
                {
                    email: formData.email,
                    fullName: formData.fullName,
                    phoneNumber: formData.phone,
                    position: formData.position,
                    experience: formData.experience,
                    declaration: true,
                    status: formData.status,
                    department: formData.department,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            console.log(`Candidate ${formData.email} updated successfully`, response.data);
            setIsModalOpen(false); // Close the modal after update
            setTimeout(() => fetchCandidates(), 1000); // Refresh the candidates list
        } catch (error) {
            console.error("Error updating candidate:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const employees = await getAllCandidates();
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
            formData.append('declaration', 'true');

            formData.append('department', 'Engineering');
            formData.append('joiningDate', new Date().toISOString().split('T')[0]);

            const token = localStorage.getItem("accessToken"); 

            await submitCandidate(formData, token);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error submitting candidate:', error);
        }
    };

    const handleDeleteCandidate = async (candidate) => {
        try {
            console.log("candidatewwwwwww", candidate);

            if (!candidate.id) {
                throw new Error("Candidate ID is required for deletion.");
            }
            await deleteCandidate(candidate.id); // Call the delete function with candidate ID
        } catch (error) {
            console.error('Error deleting candidate:', error);
        }
    };

    const handleStatusChange = async (email, newStatus) => {
        try {
            await updateCandidateStatus(email, newStatus);
            await fetchCandidates();
        } catch (error) {
            console.error('Error updating candidate status:', error);
        }
    };

    return (
        <ThemeProvider>
            <div className="candidate-container">
                <h2>Candidates</h2>

                <div className="filter-section">
                    <Dropdown label="Status" options={statuses} selected={status === "All" ? "Status" : status} setSelected={setStatus} />

                    <Dropdown
                        label="Positions"
                        options={positions}
                        selected={position === "All" ? "Positions" : position}
                        setSelected={setPosition}
                    />

                    <div className="search-box">
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
                        onEdit={handleEditCandidate} // Pass the function here
                        onDelete={handleDeleteCandidate}
                        onStatusChange={handleStatusChange}
                    />
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    isCandidate={true}
                    employeeData={selectedCandidate}
                    onSubmit={handleUpdateCandidate}
                />
            </div>
        </ThemeProvider>
    );
};

export default Candidate;
