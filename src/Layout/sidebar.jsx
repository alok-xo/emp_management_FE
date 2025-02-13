import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Css/sidebar.css";
import { FaUsers, FaUserTie, FaChartBar, FaRegCalendarCheck, FaSignOutAlt, FaSearch, FaBars } from "react-icons/fa";
import SearchBar from "../Components/SearchBar";
import Modal from "../Components/Modal";


const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("");

    const handleItemClick = (item) => {
        setActiveItem(item);
        setIsOpen(false);
    };

    return (
        <>
            {/* Hamburger Menu Button */}
            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <FaBars />
            </div>

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="logo">LOGO</div>

                {/* Search Box */}
                <SearchBar />

                {/* Recruitment Section */}
                <div className="section-title">Recruitment</div>
                <ul className="sidebar-menu">
                    <li>
                        <Link 
                            to="/candidates" 
                            className={activeItem === "candidates" ? "active" : ""}
                            onClick={() => handleItemClick("candidates")}
                        >
                            <FaUsers className="icon" /> Candidates
                        </Link>
                    </li>
                </ul>

                {/* Organization Section */}
                <div className="section-title">Organization</div>
                <ul className="sidebar-menu">
                    <li>
                        <Link 
                            to="/employees" 
                            className={activeItem === "employees" ? "active" : ""}
                            onClick={() => handleItemClick("employees")}
                        >
                            <FaUserTie className="icon" /> Employees
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/attendance" 
                            className={activeItem === "attendance" ? "active" : ""}
                            onClick={() => handleItemClick("attendance")}
                        >
                            <FaChartBar className="icon" /> Attendance
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/leaves" 
                            className={activeItem === "leaves" ? "active" : ""}
                            onClick={() => handleItemClick("leaves")}
                        >
                            <FaRegCalendarCheck className="icon" /> Leaves
                        </Link>
                    </li>
                </ul>

                {/* Others Section */}
                <div className="section-title">Others</div>
                <ul className="sidebar-menu">
                    <li className="logout">
                        <Link to="/logout" onClick={() => handleItemClick("logout")}>
                            <FaSignOutAlt className="icon logout-icon" /> Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
