const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "App_DB.db");

let db;

const initialization = async () => {
  try {
    console.log(dbPath);
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  } catch (error) {
    console.log(error);
  }
};

const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized. Call initialization() first.");
  }
  return db;
};

module.exports = { initialization, getDb };
