import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv-extended";
import path from "path";

dotenv.load({
  includeProcessEnv: true,
  path: path.resolve(__dirname, "../.env"),
  defaults: path.resolve(__dirname, "../.env.defaults"),
});

const matchModels = (filename: string, member: string) => {
  return (
    filename.substring(0, filename.indexOf(".model")) === member.toLowerCase()
  );
};

let db: Sequelize;
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "dev") {
  const databaseName = process.env.DATABASENAME || "suibian";
  const databaseUsername = process.env.DATABASEUSERNAME || "";
  const databasePassword = process.env.DATABASEPASSWORD || "";
  const databaseUrl = "localhost";

  db = new Sequelize(databaseName, databaseUsername, databasePassword, {
    host: databaseUrl,
    dialect: "postgres",
    modelMatch: matchModels,
    models: [__dirname + "/models"],
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
  console.log(`databaseName:${databaseName} databaseUsername:${databaseUsername} databasePassword:${databasePassword} databaseUrl:${databaseUrl}`)
  console.log("connecting to local database");
} else {
  // production mode
  const databaseName = process.env.DATABASENAME || "suibian";
  const databaseUsername = process.env.DATABASEUSERNAME || "";
  const databasePassword = process.env.DATABASEPASSWORD || "";
  const databaseUrl = process.env.DATABASE_URL;

  db = new Sequelize(databaseName, databaseUsername, databasePassword, {
    host: databaseUrl,
    dialect: "postgres",
    modelMatch: matchModels,
    models: [__dirname + "/models"],
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
  console.log(`databaseName:${databaseName} databaseUsername:${databaseUsername} databasePassword:${databasePassword} databaseUrl:${databaseUrl}`)
  console.log("connecting to remote database");
}

export { db };
