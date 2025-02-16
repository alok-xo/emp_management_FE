import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/modal.css";
import InputField from "./Fields";
import { FaFileUpload } from "react-icons/fa";
import { server } from "../API/Server"; // Ensure this is correctly pointing to your API

const Modal = ({ isOpen, onClose, employeeData = null, isCandidate = false, fetchCandidates }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        experience: "", // Only for Candidates
        resume: null, // Only for Candidates
        department: "", // Only for Employees
        dateOfJoining: "", // Only for Employees
        status: "new",
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (employeeData) {
            setFormData({
                fullName: employeeData.name || "",
                email: employeeData.email || "",
                phone: employeeData.phone || "",
                position: employeeData.position || "",
                experience: isCandidate ? employeeData.experience || "" : "",
                department: !isCandidate ? employeeData.department || "" : "",
                dateOfJoining: !isCandidate ? employeeData.dateOfJoining || "" : "",
                status: employeeData.status || "new",
            });
        }
    }, [employeeData, isCandidate]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "file" ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const token = localStorage.getItem("accessToken");

            const submitData = new FormData();
            submitData.append("fullName", formData.fullName);
            submitData.append("email", formData.email);
            submitData.append("phoneNumber", formData.phone);
            submitData.append("position", formData.position);
            submitData.append("experience", formData.experience);
            submitData.append("status", formData.status);
            submitData.append("declaration", true);

            if (formData.department) submitData.append("department", formData.department);
            if (formData.dateOfJoining) submitData.append("dateOfJoining", formData.dateOfJoining);
            if (formData.resume) submitData.append("resume", formData.resume);

            const url = employeeData
                ? `${server}/submission/update_employee`
                : `${server}/submission/submit`;

            await axios({
                method: employeeData ? "PUT" : "POST",
                url,
                data: submitData,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccessMessage(employeeData ? "Candidate updated successfully!" : "Candidate added successfully!");

            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1500);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Error submitting form. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {successMessage && (
                    <div className="message success" style={{ color: "green", padding: "10px 15px" }}>
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="message error" style={{ color: "red", padding: "10px 15px" }}>
                        {errorMessage}
                    </div>
                )}
                <div className="modal-header">
                    <p>{employeeData ? "Edit Candidate" : "Add New Candidate"}</p>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="input-grid">
                        <InputField
                            label="Full Name"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={!!employeeData}
                        />
                    </div>
                    <div className="input-grid">
                        <InputField
                            label="Phone Number"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            label="Position"
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {isCandidate && (
                        <div className="input-grid">
                            <InputField
                                label="Experience (Years)"
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                required
                            />
                            <div className="file-upload">
                                <label>Resume*</label>
                                <div className="file-input-container">
                                    <input type="file" name="resume" onChange={handleChange} />
                                    <FaFileUpload className="upload-icon" />
                                </div>
                            </div>
                        </div>
                    )}

                    {!isCandidate && (
                        <div className="input-grid">
                            <InputField
                                label="Department"
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />
                            <InputField
                                label="Date of Joining"
                                type="date"
                                name="dateOfJoining"
                                value={formData.dateOfJoining}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <div className="declaration">
                        <input type="checkbox" id="declaration" required />
                        <label htmlFor="declaration">
                            I hereby declare that the above information is true to the best of my knowledge and belief
                        </label>
                    </div>

                    <div className="button-container">
                        <button type="submit" className="save-button" disabled={loading}>
                            {loading ? "Processing..." : employeeData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
