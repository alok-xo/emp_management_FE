import React, { useState, useEffect } from "react";
import "../Css/modal.css"; // Ensure you have this CSS file
import InputField from "./Fields"; // Import the InputField component

const Modal = ({ isOpen, onClose, employeeData = null, isCandidate = false }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        experience: "", // Only for Candidates
        resume: "", // Only for Candidates
        department: "", // Only for Employees
        dateOfJoining: "", // Only for Employees
    });

    // Populate form fields when editing a candidate or employee
    useEffect(() => {
        if (employeeData) {
            setFormData({
                fullName: employeeData.name || "",
                email: employeeData.email || "",
                phone: employeeData.phone || "",
                position: employeeData.position || "",
                experience: isCandidate ? employeeData.experience || "" : "", // Only for candidates
                resume: "", // Only for candidates
                department: !isCandidate ? employeeData.department || "" : "", // Only for employees
                dateOfJoining: !isCandidate ? employeeData.dateOfJoining || "" : "", // Only for employees
            });
        } else {
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                position: "",
                experience: isCandidate ? "" : "", // Only for candidates
                resume: "", // Only for candidates
                department: !isCandidate ? "" : "", // Only for employees
                dateOfJoining: !isCandidate ? "" : "", // Only for employees
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <p>{employeeData ? "Edit Employee" : "Add New Candidate"}</p>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="input-grid">
                        <InputField
                            label={isCandidate ? "Full Name" : "Employee Name"}
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

                    {/* Only Show for Candidates */}
                    {isCandidate && (
                        <div className="input-grid">
                            <InputField
                                label="Experience"
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                required
                            />
                            <div className="file-upload">
                                <label>Resume*</label>
                                <input type="file" name="resume" onChange={handleChange} required={!employeeData} />
                                <span className="upload-icon">📤</span>
                            </div>
                        </div>
                    )}
                    {/* Only Show for Employees */}
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

                    {/* Only Show for Candidates */}
                    {/* {isCandidate && (
                        <div className="file-upload">
                            <label>Resume*</label>
                            <input type="file" name="resume" onChange={handleChange} required={!employeeData} />
                            <span className="upload-icon">📤</span>
                        </div>
                    )} */}

                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <button type="submit" className="save-button">
                            {employeeData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
