require('dotenv').config();  
const jwt = require("jsonwebtoken");

const  mySercertKey  = process.env.JWT_SECRET_KEY;





// ------------ createJwtToken Logic -----------------------------

const createJwtToken1 = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const payload = { email };
  console.log("email", email);
  try {
    const token = jwt.sign(payload, mySercertKey, { expiresIn: "7d" });
    req.token = token;
    next();
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//--------------------

const createJwtToken2 = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const payload = { email };
  console.log("email", email);
  try {
    const token = jwt.sign(payload, mySercertKey, { expiresIn: "7d" });
    return res.status(201).send({ token: token });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//----------------------------verifyToken Logic -------------------

const verifyToken = async (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header) {
    return res.status(403).send("Token is required");
  }
  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, mySercertKey);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = { createJwtToken1, createJwtToken2, verifyToken };
