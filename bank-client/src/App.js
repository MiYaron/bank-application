import React, { useEffect, useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
    const [token, setToken] = useState(sessionStorage.getItem("token"));
    const user = token ? jwtDecode(token) : null;

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        user?.role === "client" ? (
                            <Dashboard user={user} />
                        ) : (
                            <Signin setToken={setToken} />
                        )
                    }
                />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;
