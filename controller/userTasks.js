const { getDb } = require("../db");

const userTasks = async (req, res) => {
  const user = req.user;

  const db = getDb();
  const query = `SELECT * FROM taskTable WHERE userID = ?`;

  try {
    const queryResult = await db.all(query, [user.userID]);

    if (queryResult.length > 0) {
      res.status(200).send({ allTask: queryResult });
    } else {
      res.status(404).send("No tasks found for this user.");
    }
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    res.status(500).send({ message: "Error fetching user tasks" });
  }
};

//-----------------------------------------------------------------------------

const userTasksHome = async (req, res) => {
  const { email } = req.user;

  const db = getDb();
  const query = `SELECT * FROM UsersTable  WHERE email = ?`;

  try {
    const queryResult = await db.all(query, [email]);

    if (queryResult.length > 0) {
      const query1 = `SELECT * FROM taskTable WHERE userID = ?`;


      try {
        const queryResult2 = await db.all(query1, [queryResult[0].userID]);

       
        if (queryResult.length > 0) {
          res.status(200).send({ allTask: queryResult2 });
        } else {
          res.status(404).send("No tasks found for this user.");
        }
      } catch (error) {
        console.error("Error fetching user tasks:", error);
        res.status(500).send({ message: "Error fetching user tasks" });
      }
    } else {
      res.status(404).send("No tasks found for this user.");
    }
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { userTasks, userTasksHome };
