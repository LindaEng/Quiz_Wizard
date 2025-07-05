import { FastifyInstance } from "fastify";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../controllers/userController";

export async function userRoutes(server: FastifyInstance) {
    server.post("/register", registerUser);
    server.post("/login", loginUser);
    server.post("/logout", logoutUser);
    server.get("/me", getCurrentUser);
} 