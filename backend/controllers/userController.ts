import { FastifyRequest, FastifyReply } from "fastify";
import { createUser, findUserByEmail } from "../models/userModel";
import bcrypt from "bcrypt";

export async function registerUser(req: FastifyRequest<{ Body: { name: string; email: string; password: string } }>, reply: FastifyReply) {
    const { name, email, password } = req.body;
    if (!email || !password) {
        return reply.code(400).send({ error: "Email and password are required" });
    }
    const existing = findUserByEmail(email);
    if (existing) {
        return reply.code(400).send({ error: "User already exists" });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = createUser({ name, email, password_hash });
    return reply.send({ id: user.id, name: user.name, email: user.email });
}

export async function loginUser(req: FastifyRequest<{ Body: { email: string; password: string } }>, reply: FastifyReply) {
    const { email, password } = req.body;
    if (!email || !password) {
        return reply.code(400).send({ error: "Email and password are required" });
    }
    const user = findUserByEmail(email);
    if (!user) {
        return reply.code(400).send({ error: "Invalid email or password" });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        return reply.code(400).send({ error: "Invalid email or password" });
    }
    return reply.send({ id: user.id, name: user.name, email: user.email });
} 