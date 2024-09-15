import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {}, [token]);

    const token = sessionStorage.getItem("token");
    if (token && jwtDecode(token).role === "client") {
        navigate("/dashboard");
    }

    navigate("/signin");
};

export default Home;
