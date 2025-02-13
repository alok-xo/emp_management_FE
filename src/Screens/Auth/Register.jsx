import React, { useState } from "react";
import "../../Css/Auth/Register.css";
import { Link } from "react-router-dom";
import InputField from "../../Components/Fields";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="logo">LOGO</div>
        <img src="dashboard-preview.png" alt="Dashboard Preview" className="dashboard-image" />
        <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
        <p>
          Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
        </p>
      </div>

      <div className="register-right">
        <h2>Welcome to Dashboard</h2>
        <form className="register-form">
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

          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="register-button">Register</button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;