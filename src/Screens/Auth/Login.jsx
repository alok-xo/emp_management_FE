import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Css/Auth/login.css";
import InputField from "../../Components/Fields"; // Import Reusable InputField Component
import { login } from "../../API/Auth"; // Import the login function

const Login = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState(""); // New state for error message
    const [successMessage, setSuccessMessage] = useState(""); // New state for success message

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value.length <= 20) {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setErrorMessage(""); // Reset error message before submission
        setSuccessMessage(""); // Reset success message before submission
        try {
            const data = await login(formData); // Call the login API
            localStorage.setItem('accessToken', data.accessToken); // Save accessToken in local storage
            setSuccessMessage("Login successful!"); // Set success message
            console.log(data); // Handle successful login (e.g., redirect or show a message)
            setTimeout(() => {
                navigate('/candidates', { state: { fromLogin: true } });
            }, 2000);
        } catch (error) {
            setErrorMessage(error.message || "Login failed. Please try again."); // Set error message
            console.error(error); // Handle error (e.g., show an error message)
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                {/* Left Side - Image & Text */}
                <div className="login-left">
                    <div className="logo">🔲 LOGO</div>
                    <p className="preview-text">Dashboard Preview</p>
                    <img src="https://via.placeholder.com/300x200" alt="Dashboard Preview" className="dashboard-img" />
                    <p className="description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                    <p className="sub-description">
                        Sample text about the platform, making it easy to manage tasks efficiently.
                    </p>
                </div>

                {/* Right Side - Login Form */}
                <div className="login-right">
                    <h2>Welcome to Dashboard</h2>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Display success message */}
                    <form onSubmit={handleSubmit}>
                        <InputField
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            maxLength={20}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            maxLength={20}
                        />

                        <div className="forgot-password">
                            <Link to="#">Forgot password?</Link>
                        </div>

                        <button type="submit" className="login-button">Login</button>

                        <p className="register-link">
                            Don't have an account? <Link to="/register">Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
