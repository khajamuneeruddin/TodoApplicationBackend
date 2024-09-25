const { getDb } = require("../db");

const bcrypt = require("bcrypt");

const { v4: uuidv4 } = require("uuid");

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

const addUserToDB = async (req, res, next) => {
  const { email, password, username } = req.body;
  const db = getDb();
  const id = uuidv4();

  const addUserToDBQuery = `INSERT INTO UsersTable ( "userID","username", "email", "password") VALUES (?, ?, ?, ?)`;

  try {
    const hashedPassword = await hashPassword(password);
    await db.run(addUserToDBQuery, [id, username, email, hashedPassword]);
    const token = req.token;
    return res
      .status(201)
      .send({ message: "Added Successfully", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add user" });
  }
};


const addTaskToTaskDB = async (req, res, next) => {
  const db = getDb();
  const { taskName, status } = req.body;
  const { email } = req.user;

  if (!taskName || !status) {
    return res.status(400).send("Task name and status are required.");
  }

  try {
   
    const userQuery = "SELECT userID FROM UsersTable WHERE email = ?";
    const userResult = await db.get(userQuery, [email]);

    if (!userResult) {
      return res.status(404).send("User not found.");
    }

    const userID = userResult.userID; 
    const id = uuidv4();

    const insertQuery = `
      INSERT INTO taskTable (taskID, taskName, status, userID)
      VALUES (?, ?, ?, ?);
    `;
    const values = [id, taskName, status, userID]; 

    await db.run(insertQuery, values);

    const updatedTaskList = await db.all(
      "SELECT * FROM taskTable WHERE userID = ?",
      [userID] 
    );

    const newTask = { taskID: id, taskName, status, userID }; 

    return res.status(201).send({
      message: "Task added successfully",
      newTask,
      allTasks: updatedTaskList,
    });
  } catch (error) {
    console.error("Error adding task to the database:", error);
    return res.status(500).send("Internal server error");
  }
};




const deleteTaskFromDB = async (req, res) => {
  const db = getDb();
  const { taskID } = req.params;

  try {
    const deleteQuery = `DELETE FROM taskTable WHERE taskID = ?`;
    await db.run(deleteQuery, [taskID]);

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).send("Internal server error");
  }
};

module.exports = { addUserToDB, addTaskToTaskDB, deleteTaskFromDB };
