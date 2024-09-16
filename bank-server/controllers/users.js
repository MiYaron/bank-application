import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { sendVerificationCode } from "../utils/mailing.js";

async function register(req, res) {
    const userData = req.body;

    const encryptedPassword = await encryptPassword(userData.password);
    userData.password = encryptedPassword;

    const user = new User(userData);

    try {
        await user.save();
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({ message: "Email already in use" });
        } else {
            return res.status(500).send({ message: "Somthing went wrong" });
        }
    }

    const url = process.env.SERVER_URL + ":" + process.env.SERVER_PORT;

    const link = `${url}/api/auth/verify?user_id=${user.id}`;

    sendVerificationCode(userData.email, userData.name, link);

    res.status(200).send({ message: "Verification mail was sent" });
}

async function signup(req, res) {
    const id = req.query["user_id"];

    if (
        !(await User.findOneAndUpdate(
            { _id: id, status: "Pending" },
            { status: "Active" }
        ))
    ) {
        return res.status(410).send({ message: "Verfication expired" });
    }

    res.status(303).redirect("https://www.google.com/");
}

async function signin(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
        !user ||
        user.status != "Active" ||
        !(await comparePasswords(password, user.password))
    ) {
        return res.status(400).send({ message: "Wrong email or password" });
    }

    const tokenData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_HASH, {
        expiresIn: "1h",
    });

    res.status(200).send({ token });
}

async function getDetails(req, res) {}

function modifyDetails(req, res) {}

const waitingList = {};

async function encryptPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function comparePasswords(dbPassword, userPassword) {
    return await bcrypt.compare(dbPassword, userPassword);
}

export default {
    signup,
    register,
    signin,
};
