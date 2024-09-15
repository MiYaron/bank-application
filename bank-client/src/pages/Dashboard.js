import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import TransactionsList from "../assets/components/txlist";
import BalanceCard from "../assets/components/balance";

const Dashboard = () => {
    const navigate = useNavigate();
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
    }, [balance]);

    function Signout() {
        sessionStorage.removeItem("token");

        navigate(0);
    }

    return (
        <main>
            <div className="dashboard">
                <div className="backdrop"></div>
                <div className="content">
                    <div className="header">
                        <div id="exit-button" onClick={Signout}></div>
                        <p>
                            Welcome <span id="username">{user.name},</span>
                        </p>
                    </div>
                    <BalanceCard balance={balance} setBalance={setBalance} />
                </div>
            </div>
            <TransactionsList transactions={transactions} user />
        </main>
    );
};

export default Dashboard;
