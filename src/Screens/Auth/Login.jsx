import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Css/Auth/login.css";
import InputField from "../../Components/Fields";
import { login } from "../../API/Auth";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage(""); 
        try {
            const data = await login(formData);
            localStorage.setItem('accessToken', data.accessToken);
            setSuccessMessage("Login successful!");
            console.log(data);
            setTimeout(() => {
                navigate('/candidates', { state: { fromLogin: true } });
            }, 2000);
        } catch (error) {
            setErrorMessage(error.message || "Login failed. Please try again."); 
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                {/* Left Side - Image & Text */}
                <div className="login-left">
                    <div className="logo">🔲 LOGO</div>
                    <p className="preview-text">Dashboard Preview</p>
                    <img src="https://d2ogrdw2mh0rsl.cloudfront.net/production/images/static/live-for-teams-new.png" alt="Dashboard Preview" className="dashboard-img" />
                    <p className="description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                    <p className="sub-description">
                        Sample text about the platform, making it easy to manage tasks efficiently.
                    </p>
                </div>

                <div className="login-right">
                    <h2>Welcome to Dashboard</h2>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} 
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
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
