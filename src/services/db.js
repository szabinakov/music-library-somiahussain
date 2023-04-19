const db = require("../db/index");
const getDb = async () => {
  return db;
};

module.exports = getDb;
