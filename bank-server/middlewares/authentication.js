import jwt from "jsonwebtoken";

function authenticate(req, res, next) {
    const token = req.headers.authentication?.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_HASH, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        req.user = decoded;
        next();
    });
}

export default {
    authenticate,
};
