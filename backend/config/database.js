import { createPool } from "mysql2/promise";

function openConnection() {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  if (!config.host || !config.user || !config.password || !config.database) {
    console.error("[Error]: Missing required database environment variables.");
    process.exit(1);
  }

  try {
    const pool = createPool(config);
    console.log("[Success]: Connected to the database.");
    return pool;
  } catch (error) {
    console.error(`[Error]: ${error.message}`);
    process.exit(1);
  }
}

export default openConnection;
