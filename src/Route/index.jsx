import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Screens/Auth/Login.jsx";
import Register from "../Screens/Auth/Register.jsx";
import Candidates from "../Screens/Candidates/Candidate.jsx";
import MainLayout from "../Components/Layout/MainLayout.jsx";
import Employee from "../Screens/Employee.jsx";
import Attendance from "../Screens/attendance.jsx";
import Leaves from "../Screens/Leaves.jsx";


export const AppRoutes = () => {
    // You can add authentication check here later
    const isAuthenticated = true;
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes with Layout */}
            <Route
                element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />}
            >
                <Route path="/dashboard" element={<h1>Dashboard</h1>} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/employees" element={<Employee />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leaves" element={<Leaves />} />
            </Route>

            {/* Root redirect */}
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
        </Routes>
    );
};
