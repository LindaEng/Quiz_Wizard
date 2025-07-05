import { FastifyRequest, FastifyReply } from "fastify";
import { createUser, findUserByEmail } from "../models/userModel";

export async function registerUser(req: FastifyRequest<{ Body: { name: string; email: string } }>, reply: FastifyReply) {
    const { name, email } = req.body;
    if (!email) {
        return reply.code(400).send({ error: "Email is required" });
    }
    const existing = findUserByEmail(email);
    if (existing) {
        return reply.code(400).send({ error: "User already exists" });
    }
    const user = createUser({ name, email });
    return reply.send({ id: user.id, name: user.name, email: user.email });
}

export async function loginUser(req: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) {
    const { email } = req.body;
    if (!email) {
        return reply.code(400).send({ error: "Email is required" });
    }
    const user = findUserByEmail(email);
    if (!user) {
        return reply.code(400).send({ error: "User not found" });
    }
    
    // Set session data
    const session = req.session as any;
    session.userId = user.id;
    session.userName = user.name;
    session.userEmail = user.email;
    
    return reply.send({ id: user.id, name: user.name, email: user.email });
}

export async function logoutUser(req: FastifyRequest, reply: FastifyReply) {
    req.session.destroy();
    return reply.send({ success: true });
}

export async function getCurrentUser(req: FastifyRequest, reply: FastifyReply) {
    const session = req.session as any;
    if (!session.userId) {
        return reply.code(401).send({ error: "Not authenticated" });
    }
    return reply.send({
        id: session.userId,
        name: session.userName,
        email: session.userEmail
    });
} 