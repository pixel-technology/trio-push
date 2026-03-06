import { writeFileSync } from "fs";

const SPEC_URL = "https://triochat-push.onrender.com/openapi.json";

async function run() {
  const res = await fetch(SPEC_URL);
  if (!res.ok) throw new Error(`Failed to fetch OpenAPI spec`);
  const json = await res.text();
  writeFileSync("openapi.json", json);
  console.log("OpenAPI spec downloaded");
}

run();
