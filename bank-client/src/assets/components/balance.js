import { useState } from "react";

function BalanceCard({ balance, setBalance }) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [to, setReceiver] = useState("");
    const [amount, setAmount] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    function sendMoney() {
        if (!isFormVisible) {
            setIsFormVisible(true);
        } else {
            console.log(JSON.stringify({ to, amount }));
            fetch("http://localhost:3001/api/transactions", {
                method: "POST",
                headers: {
                    Authentication: `Bearer ${sessionStorage.getItem("token")}`,
                    "Content-type": "application/json; charset=UTF-8",
                },

                body: JSON.stringify({ to, amount }),
            }).then(async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    setBalance(balance - amount);
                    cancel();
                } else {
                    setErrorMessage((await response.json()).message);
                }
            });
        }
    }

    function cancel() {
        setReceiver("");
        setAmount(0);
        setErrorMessage("");
        setIsFormVisible(false);
    }

    return (
        <div className="card">
            <h3>YOUR BALANCE</h3>
            <p>{balance}$</p>
            {isFormVisible && (
                <>
                    <hr></hr>
                    <form className="transaction-form">
                        <label htmlFor="to">Reciever's Email:</label>
                        <input
                            type="email"
                            id="to"
                            value={to}
                            onChange={(e) => setReceiver(e.target.value)}
                            required
                        />
                        <label htmlFor="amount">Amount:</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(+e.target.value)}
                            required
                        />
                    </form>
                    {errorMessage != "" && (
                        <div className="error-p">{errorMessage}</div>
                    )}
                </>
            )}

            <div id="card-footer">
                {isFormVisible && (
                    <div id="cancel-button" onClick={cancel}>
                        Cancel
                    </div>
                )}
                <div id="send-button" onClick={sendMoney}>
                    Send Money
                </div>
            </div>
        </div>
    );
}

export default BalanceCard;
