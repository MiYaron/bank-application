import express from "express";
import account from "../controllers/dashboard.js";

const router = express.Router();

router.post("/api/transactions", account.sendMoney);
router.get("/api/dashboard", account.getData);
router.get("/api/transactions", account.getTransactions);

export default router;
