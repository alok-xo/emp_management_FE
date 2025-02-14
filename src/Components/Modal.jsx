import React, { useState, useEffect } from "react";
import "../Css/modal.css"; // Ensure you have this CSS file
import InputField from "./Fields"; // Import the InputField component

const Modal = ({ isOpen, onClose, employeeData = null, isCandidate = false, onSubmit }) => {
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
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create FormData object with the correct field names matching the API
        const submitData = new FormData();
        submitData.append('fullName', formData.fullName);
        submitData.append('email', formData.email);
        submitData.append('phoneNumber', formData.phone);
        submitData.append('position', formData.position);
        submitData.append('experience', formData.experience);
        submitData.append('status', 'new');

        if (formData.resume) {
            submitData.append('resume', formData.resume);
        }

        try {
            await onSubmit(submitData);
            setSuccessMessage("Submission successful!");
            setErrorMessage(""); // Clear any previous error message

            // Clear the form data
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                position: "",
                experience: "",
                resume: "",
                department: "",
                dateOfJoining: "",
            });

            // Wait for 2 seconds before closing modal and reloading
            await new Promise(resolve => setTimeout(resolve, 2000));
            onClose(); // Close the modal
            window.location.reload(); // Reload the page

        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage("Error submitting form. Please try again.");
            setSuccessMessage(""); // Clear any previous success message
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Update success/error message styling */}
                {successMessage && (
                    <div className="message success" style={{
                        color: "#155724",
                        backgroundColor: "#d4edda",
                        padding: "10px",
                        borderRadius: "4px",
                        marginBottom: "10px"
                    }}>
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="message error" style={{
                        color: "#721c24",
                        backgroundColor: "#f8d7da",
                        padding: "10px",
                        borderRadius: "4px",
                        marginBottom: "10px"
                    }}>
                        {errorMessage}
                    </div>
                )}
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
                        <input type="checkbox" required />
                        <label style={{ marginLeft: "8px" }}>
                            I hereby declare that the above information is true to the best of my knowledge and belief
                        </label>
                    </div>
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
