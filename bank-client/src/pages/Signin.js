import React, { useEffect, useState, useContext } from "react";

function Signin({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const token = sessionStorage.getItem("token");
    const signin = (event) => {
        event.preventDefault();
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
                console.log((await response.json()).message);
            }
        });
    };
    return (
        <main>
            <form onSubmit={signin}>
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

                <p>
                    Don't have an account yet? <a>Sign up</a>
                </p>
            </form>
        </main>
    );
}

export default Signin;
