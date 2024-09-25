const { getDb } = require("../db");
const bcrypt = require("bcrypt");

const checkingUserInDBSignUp = async (req, res, next) => {
  const db = getDb();
  const { email } = req.body;

  const checkQuery = `SELECT * FROM UsersTable WHERE email = ?`;

  try {
    const query = await db.get(checkQuery, [email]);

    if (query) {
      return res.status(400).send({ message: "Email Already Exists." });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

///---------------------checkingUserInDBLogin ---------------------
const checkingUserInDBLogin = async (req, res, next) => {
  const db = getDb();
  const { email, password } = req.body;

  const checkQuery = `SELECT * FROM UsersTable WHERE email = ?`;

  try {
    const query = await db.get(checkQuery, [email]);

    if (!query) {
      
      return res.status(400).send({ message: "Email doesn't exist." });
    }

    const match = await bcrypt.compare(password, query.password);

    if (!match) {
      return res.status(401).send({ message: "Invalid password." });
    }

    req.user = query;

    

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server error." });
  }
};

module.exports = { checkingUserInDBSignUp, checkingUserInDBLogin };
