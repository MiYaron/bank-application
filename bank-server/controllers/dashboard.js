import mongoose from "mongoose";

import Transaction from "../models/transaction.js";
import User from "../models/user.js";

async function getData(req, res) {
    const userId = req.user.id;

    const balance = (await User.findById(userId)).balance;

    const transactions = await Transaction.find({
        $or: [{ "from.id": userId }, { "to.id": userId }],
    })
        .sort({ _id: -1 })
        .limit(5);

    res.status(200).send({ balance, transactions });
}

async function sendMoney(req, res) {
    const { to, amount } = req.body;
    const user = await User.findById(req.user.id);
    if (user.email === to) {
        return res.status(400).send({ message: "Cant send money to yourself" });
    }

    if (amount == 0) {
        return res.status(400).send({ message: "Amount can not be zero" });
    }

    if (amount > user.balance) {
        return res
            .status(400)
            .send({ message: "Not enough money in the account" });
    }

    const receiver = await User.findOne({ email: to });

    if (!receiver) {
        return res
            .status(400)
            .send({ message: "No receiver for the transaction" });
    }

    const session = await mongoose.startSession();

    user.balance -= amount;
    receiver.balance += amount;

    const tx = new Transaction({
        from: { id: user.id, name: user.name },
        to: { id: receiver.id, name: receiver.name },
        amount,
    });

    try {
        await user.save();
        await receiver.save();
        await tx.save();

        res.status(201).send({
            from: user.name,
            to: receiver.name,
            amount: amount,
            time: tx.createdAt,
        });
    } catch (err) {
        res.status(500).send({ message: "Internal server error" });
    }
}

async function getTransactions(req, res) {
    const userId = req.user.id;
    const lastItem = req.query.lastItem ? req.query.lastItem : null;

    try {
        const query = {
            $or: [{ "from.id": userId }, { "to.id": userId }],
        };

        if (lastItem) {
            query._id = { $lt: lastItem };
        }

        const transactions = await Transaction.find(query)
            .sort({ _id: -1 })
            .limit(3);

        res.status(200).send({ transactions });
    } catch (error) {
        res.status(500).send({
            error: "An error occurred while fetching transactions.",
        });
    }
}

export default {
    sendMoney,
    getData,
    getTransactions,
};
