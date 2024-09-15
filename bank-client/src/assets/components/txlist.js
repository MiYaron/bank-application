function TransactionsList({ transactions }) {
    return (
        <div id="transactions">
            <h2>Transactions</h2>
            {transactions.map((transaction) => (
                <TransactionItem
                    key={transaction._id}
                    transaction={transaction}
                />
            ))}

            <p>Show More</p>
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
