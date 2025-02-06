import { JSONFilePreset } from "lowdb/node";

let db;

export async function createConnection() {
  const defaultData = {
    "tasks": [],
  };
  db = await JSONFilePreset("db.json", defaultData);

  await db.read();

  db.data ||= defaultData;

  await db.write();
}

export { db };
