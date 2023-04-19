const { Client } = require("pg");
const path = require("path");

const loadEnv = () => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV != "production") {
    const envFile = envName === "../.env.test";

    require("dotenv").config({
      path: path.join(__dirname, envFile),
    });

    const databaseName = process.env.PGDATABASE;

    delete process.env.PGDATABASE;

    return databaseName;
  }
};

const dropDatabase = async (databaseName) => {
  const client = new Client();
  try {
    await client.connect();

    console.log(`Creating ${databaseName} database...`);

    await client.query(`DROP DATABASE ${databaseName} WITH (FORCE)`);

    console.log("Database droped!");
  } catch (err) {
    console.log(err);
  } finally {
    client.end();
  }
};
