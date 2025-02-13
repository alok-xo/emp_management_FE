import React from "react";
import Sidebar from "../../Layout/sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout; 