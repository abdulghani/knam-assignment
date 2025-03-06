import Knex from "knex";
import glob from "fast-glob";
import path from "path";

export const db = Knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

export async function migrate() {
  const directory = [path.resolve(process.cwd(), "./migrations/*")];
  const directories = [
    ...new Set(glob.sync(directory).map((dir) => path.dirname(dir))),
  ];
  const migrationConfig = {
    directory: directories,
    sortDirsSeparately: true,
    tableName: "_migrations",
  };
  return db.migrate.latest(migrationConfig);
}
