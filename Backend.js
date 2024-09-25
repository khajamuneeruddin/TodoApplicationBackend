const express = require("express");
require('dotenv').config(); 
const { updating } = require("./controller/updating1");
const {
  verifyToken,
  createJwtToken1,
  createJwtToken2,
} = require("./controller/Jwt");
const {
  checkingUserInDBSignUp,
  checkingUserInDBLogin,
} = require("./controller/checkingUserInDB");
const { userTasksHome } = require("./controller/userTasks");
const {
  addUserToDB,
  addTaskToTaskDB,
  deleteTaskFromDB,
} = require("./controller/addUserToDB");
const { initialization } = require("./db");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const startServer = async () => {
  try {
    await initialization();

    app.post("/sign", checkingUserInDBSignUp, createJwtToken1, addUserToDB);
    app.post(
      "/login",
      (req, res, next) => {
        console.log("Login route hit");
        next();
      },
      checkingUserInDBLogin,
      createJwtToken2
    );

    app.post("/home", verifyToken, userTasksHome);
    app.put("/home/:taskID", verifyToken, updating);
    app.post("/home/add", verifyToken, addTaskToTaskDB, userTasksHome);

    app.delete("/home/:taskID", deleteTaskFromDB);

    app.listen(3000, () => {
      console.log("Server is Running on port 3000");
    });
  } catch (error) {
    console.error("Error initializing the server:", error);
  }
};

startServer();
