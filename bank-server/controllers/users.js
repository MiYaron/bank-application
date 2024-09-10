import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { sendVerificationCode } from "../utils/mailing.js";

async function register(req, res) {
    const userData = req.body;
    const validation = await registerationValidations(userData);

    if (validation.status != 200) {
        return res.status(validation.status).send(validation.message);
    }

    const encryptedPassword = await encryptPassword(userData.password, 10);
    userData.password = encryptedPassword;

    const user = new User(userData);

    const generatedCode = generateCode(user);

    const link = `http://10.10.1.185:3001/auth/verify?verification_code=${generatedCode}&user_id=${user._id}`;

    // sendVerificationCode(userData.email, userData.name, link);

    // res.status(200).send("Verification mail was sent");

    res.status(200).send(link);
}

async function signup(req, res) {
    const code = req.query["verification_code"];
    const userId = req.query["user_id"];

    const user = waitingList[userId];
    if (!user) {
        return res.status(410).send("Verfication key is expired");
    } else if (!authenticateUser(user, code)) {
        return res.status(400).send("Verification key is not valid");
    }

    try {
        await user.save();
        res.status(302).redirect("https://www.google.com/");
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).send("Email already in use");
        } else {
            res.status(500).send("Somthing went wrong");
        }
    }
}

async function signin(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await comparePasswords(password, user.password))) {
        return res.status(400).send("Wrong email or password");
    }

    const tokenData = { id: user._id, email: user.email, role: user.role };

    const token = jwt.sign(tokenData, process.env.TOKEN_HASH, {
        expiresIn: "1h",
    });

    res.cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
    });

    res.status(200).send("Success");
}

async function getDetails(req, res) {}

function modifyDetails(req, res) {}

const waitingList = {};

function generateCode(user) {
    const code = Math.floor(Math.random() * (99999 - 10000) + 10000);
    user.auth = code;

    waitingList[user.id] = user;

    setTimeout(() => {
        delete waitingList[user.id];
    }, 900000);

    return code;
}

function authenticateUser(user, code) {
    if (user.auth == code) {
        return true;
    }

    return false;
}

async function encryptPassword(password, rounds) {
    return await bcrypt.hash(password, rounds);
}

async function comparePasswords(dbPassword, userPassword) {
    return await bcrypt.compare(dbPassword, userPassword);
}

async function registerationValidations(userData) {
    if (await User.findOne({ email: userData.email })) {
        return { status: 409, message: "Email already in use" };
    }

    return { status: 200, message: "OK" };
}

export default {
    signup,
    register,
    signin,
};
