import express from "express";
import txs from "../controllers/transactions.js";

const router = express.Router();

router.post("/api/transactions", txs.sendMoney);

router.get("/api/transactions", txs.getTransactions);

export default router;
