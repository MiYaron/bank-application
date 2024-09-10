import express from "express";
import Users from "../controllers/users.js";
const router = express.Router();

router.post("/auth/signup", (req, res) => {
    Users.register(req, res);
});
router.get("/auth/verify", (req, res) => {
    Users.signup(req, res);
});

router.post("/auth/signin", (req, res) => {
    Users.signin(req, res);
});

export default router;
