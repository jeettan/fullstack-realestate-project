const jwt = require('jsonwebtoken');

const verifyToken = async function (req, res, next) {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    } catch (err) {
        console.log(err)
        res.status(401).send("Invalid token");
    }

}

const verifyEmailToken = async function (req, res, next) {

    try {

        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send("No token provided");
        }

        const token = authHeader.split(' ')[1];

        if (!token || !token.includes(".")) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const decoded = await jwt.verify(token, process.env.EMAIL_RESET_SECRET);

        req.user = decoded;

        next()

    } catch (err) {

        console.log(err)

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(401).json({ message: "Auth failed" })
    }

}

module.exports = { verifyToken, verifyEmailToken }