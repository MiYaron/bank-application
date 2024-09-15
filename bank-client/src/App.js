import React, { useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
    const [token, setToken] = useState(sessionStorage.getItem("token"));
    const role = token ? jwtDecode(token).role : "guest";

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        role === "client" ? (
                            <Dashboard />
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
