import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../Css/Auth/login.css";
import InputField from "../../Components/Fields"; // Import Reusable InputField Component

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
                    <form>
                        <InputField
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <InputField
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
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
