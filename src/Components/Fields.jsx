import React, { useState } from "react";
import "../Css/fields.css"; 
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

const InputField = ({ label, type, name, value, onChange, required }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
            <div className="input-container">
                <label htmlFor={name}>
                    {label} {required && <span className="required">*</span>}
                </label>

                <div className="input-wrapper">
                    <input
                        type={type === "password" && showPassword ? "text" : type}
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        className={type === "password" ? "password-input" : ""}
                        placeholder={`${label.toLowerCase()}`}
                    />
                    {type === "password" && (
                        <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    )}
                </div>
            </div>
    );
};

export default InputField;
