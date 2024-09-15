import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import TransactionsList from "../assets/components/txlist";

const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [user, setUser] = useState(
        jwtDecode(sessionStorage.getItem("token"))
    );

    useEffect(() => {
        const getData = async () => {
            const response = await fetch(
                "http://localhost:3001/api/dashboard",
                {
                    headers: {
                        Authentication: `Bearer ${sessionStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const data = await response.json();

            data.transactions.map((transaction) => {
                if (transaction.from.id === user.id) {
                    transaction.amount *= -1;
                }
            });

            setBalance(data.balance);
            setTransactions(data.transactions);
        };

        getData();
    }, []);

    function signout() {
        sessionStorage.removeItem("token");
        return redirect("/");
    }

    return (
        <main>
            <div className="dashboard">
                <div className="backdrop"></div>
                <div className="content">
                    <div className="header">
                        <div id="exit-button" onClick={signout}></div>
                        <p>
                            Welcome <span id="username">{user.name},</span>
                        </p>
                    </div>
                    <div className="card">
                        <h3>YOUR BALANCE</h3>
                        <p>{balance}$</p>
                        <div id="card-footer">
                            <div id="send-button">Send Money</div>
                        </div>
                    </div>
                </div>
            </div>
            <TransactionsList transactions={transactions} user />
        </main>
    );
};

export default Dashboard;
