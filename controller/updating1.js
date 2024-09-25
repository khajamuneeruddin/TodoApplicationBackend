const { getDb } = require("../db");

const updating = async (req, res) => {
  const db = getDb();
  const taskID = req.params.taskID;
  const { taskName, status } = req.body;

  if (!taskName || !status) {
    return res.status(400).send("Task name and status are required");
  }

  const sql = `UPDATE taskTable SET taskName = ?, status = ? WHERE taskID = ?`;
  

  try {
    const changes = await db.run(sql, [taskName, status, taskID]);

    if (changes.changes === 0) {
      console.log("No rows were updated. Task not found.");
      return res.status(404).send({ message: "Task not found" });
    }

    res.send({ message: "Task updated successfully" });
  } catch (error) {
    console.error("SQL error:", error.message);
    return res.status(500).send({ message: "Error updating task" });
  }
};

module.exports = { updating };
