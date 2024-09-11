import express from "express";
import users from "../controllers/users.js";
const router = express.Router();

router.post("/api/auth/signup", users.register);
router.get("/api/auth/verify", users.signup);
router.post("/api/auth/signin", users.signin);

export default router;
