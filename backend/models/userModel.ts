import { db } from "../db-client";

export type User = {
    id: number;
    name: string;
    email: string;
    password_hash: string;
};

export function createUser({ name, email, password_hash }: { name: string; email: string; password_hash: string }): User {
    const stmt = db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
    const info = stmt.run(name, email, password_hash);
    return { id: Number(info.lastInsertRowid), name, email, password_hash };
}

export function findUserByEmail(email: string): User | undefined {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email) as User | undefined;
} 