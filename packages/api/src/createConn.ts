import { join } from "path";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";

export const createConn = () =>
  createConnection({
    type: "postgres",
    database: __prod__ ? undefined : "vsinder",
    url: __prod__ ? process.env.DATABASE_URL : undefined,
    entities: [join(__dirname, "./entities/*")],
    migrations: [join(__dirname, "./migrations/*")],
    // synchronize: !__prod__,
    logging: !__prod__,
  });
