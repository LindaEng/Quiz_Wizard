import { db } from "../db-client";

export type User = {
    id: number;
    name: string;
    email: string;
};

export function createUser({ name, email }: { name: string; email: string }): User {
    const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
    const info = stmt.run(name, email);
    return { id: Number(info.lastInsertRowid), name, email };
}

export function findUserByEmail(email: string): User | undefined {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email) as User | undefined;
} 