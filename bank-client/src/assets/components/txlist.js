import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function TransactionsList({ userId, transactions, setTransactions }) {
    const [lastItem, setLastItem] = useState("");

    useEffect(() => {
        if (transactions.length > 0) {
            setLastItem(transactions[transactions.length - 1]._id);
        }
    }, [transactions]);

    const fold = async () => {
        setTransactions(transactions.slice(0, 5));
    };

    const showMore = async () => {
        const response = await fetch(
            `http://localhost:3001/api/transactions?lastItem=${lastItem}`,
            {
                headers: {
                    Authentication: `Bearer ${sessionStorage.getItem("token")}`,
                },
            }
        );

        const data = await response.json();
        const addedTransactions = data.transactions;

        if (addedTransactions.length > 0) {
            addedTransactions.map((transaction) => {
                if (transaction.from.id === userId) {
                    transaction.amount *= -1;
                }
            });

            setTransactions((prevTransactions) => [
                ...prevTransactions,
                ...addedTransactions,
            ]);
        }
    };

    if (transactions.length == 0) {
        return (
            <div id="transactions">
                <p>No transactions to show</p>
            </div>
        );
    }

    return (
        <div id="transactions">
            <h2 onClick={fold}>Transactions ↑</h2>
            {transactions.map((transaction, index) => (
                <TransactionItem
                    key={transaction._id}
                    transaction={transaction}
                />
            ))}

            <p id="show-more" onClick={showMore}>
                Show More ↓
            </p>
        </div>
    );
}

function TransactionItem({ transaction }) {
    if (transaction.amount > 0) {
        return (
            <div className="tx-item">
                <div className="tx-icon positive"></div>
                <div className="tx-data">
                    <p>From:</p>
                    <p className="username">{transaction.from.name}</p>
                </div>
                <p className="amount positive">+{transaction.amount}$</p>
            </div>
        );
    }

    return (
        <div className="tx-item">
            <div className="tx-icon negative"></div>
            <div className="tx-data">
                <p>To:</p>
                <p className="username">{transaction.to.name}</p>
            </div>
            <p className="amount negative">{transaction.amount}$</p>
        </div>
    );
}

export default TransactionsList;
