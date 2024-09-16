import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

function Signin({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");
    const signin = (event) => {
        event.preventDefault();
        setErrorMessage("");
        fetch("http://localhost:3001/api/auth/signin", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },

            body: JSON.stringify({ email, password }),
        }).then(async (response) => {
            if (response.ok) {
                const token = (await response.json()).token;
                sessionStorage.setItem("token", token);
                setToken(token);
            } else {
                setErrorMessage((await response.json()).message);
            }
        });
    };

    const signup = () => {
        navigate("/signup");
    };

    return (
        <main>
            <div className="sign">
                <div className="backdrop">
                    <div className="header">
                        <p>
                            Welcome <span id="username">Guest</span>,
                        </p>
                    </div>
                    <div className="content">
                        <form id="signin-form" onSubmit={signin}>
                            <label>Email:</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            ></input>

                            <label>Password:</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            ></input>

                            <input id="submit" type="submit" value="Sign in" />
                        </form>

                        <p className="alternate">
                            Don't have an account yet?{" "}
                            <a onClick={signup}>Sign up</a>
                        </p>

                        {errorMessage != "" && (
                            <div className="error-p">{errorMessage}</div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Signin;
