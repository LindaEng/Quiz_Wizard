import { FastifyInstance } from "fastify";
import { registerUser, loginUser } from "../controllers/userController";

export async function userRoutes(server: FastifyInstance) {
    server.post("/register", registerUser);
    server.post("/login", loginUser);
} 