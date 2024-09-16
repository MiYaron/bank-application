import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const signup = (event) => {
        event.preventDefault();

        setErrorMessage("");
        if (password.length < 8) {
            setErrorMessage("Password must contain at least 8 characters");
            return;
        }

        if (password != confirmation) {
            setErrorMessage("Passwords do not match");
            return;
        }

        setPhone(formatPhone(phone));

        fetch("http://localhost:3001/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },

            body: JSON.stringify({ name, email, phone, password }),
        }).then(async (response) => {
            if (response.ok) {
                signin();
            } else {
                setErrorMessage((await response.json()).message);
            }
        });
    };

    const formatPhone = (phone) => {
        console.log(typeof phone);
        if (phone.startsWith("0")) {
            phone = phone.slice(1);
        }
        phone = phone.replaceAll("-", "");

        return "(+972)" + phone;
    };

    const signin = () => {
        navigate("/signin");
    };

    return (
        <main>
            <div className="sign">
                <div className="backdrop signup">
                    <div className="header">
                        <p>
                            Welcome <span id="username">Guest</span>,
                        </p>
                    </div>
                    <div className="content">
                        <form id="signup-form" onSubmit={signup}>
                            <label>Name:</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required={true}
                                onChange={(e) => setName(e.target.value)}
                            ></input>
                            <label>Email:</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required={true}
                                onChange={(e) => setEmail(e.target.value)}
                            ></input>
                            <label>Phone:</label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                required={true}
                                onChange={(e) => setPhone(e.target.value)}
                            ></input>
                            <label>Password:</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            ></input>
                            <label>Confirm Password:</label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                onChange={(e) =>
                                    setConfirmation(e.target.value)
                                }
                            ></input>

                            <input id="submit" type="submit" value="Sign up" />
                        </form>

                        <p className="alternate">
                            Already have an account?{" "}
                            <a onClick={signin}>Sign in</a>
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

export default Signup;
