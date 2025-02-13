import React, { useState } from "react";
import "../Css/modal.css"; // Ensure you have this CSS file
import InputField from "./Fields"; // Import the InputField component

const Modal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        resume: "",
        declaration: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <p>Add New Candidate</p>
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
                            <input type="file" name="resume" onChange={handleChange} required />
                            <span className="upload-icon">📤</span>
                        </div>
                    </div>
                    <div className="declaration">
                        <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleChange} required />
                        <label>I hereby declare that the above information is true to the best of my knowledge and belief.</label>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <button type="submit" className={`save-button ${!formData.declaration ? "disabled" : ""}`} disabled={!formData.declaration}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
