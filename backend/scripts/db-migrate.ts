import fs from "node:fs";
import { db } from "../db-client";

try {
	db.transaction(() => {
		const migrations = fs
			.readdirSync("./migrations")
			.filter((file) => file.endsWith(".sql"))
			.sort((a, b) => a.localeCompare(b));

		for (const migration of migrations) {
			const rawSql = fs.readFileSync(`./migrations/${migration}`, "utf8");

			console.log(`--> Running migration: ${migration}`);
			db.exec(rawSql);
			console.log("<-- completed successfully.");
		}
	})();

	console.log("Database migrations ran successfully!");
} catch (err) {
	console.error("Error running migrations:", err);
} finally {
	db.close();
}
