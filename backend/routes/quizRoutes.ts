import { FastifyInstance } from "fastify";
import { fetchAllQuizzes, fetchQuizById } from "../controllers/quizController"; 

export async function quizRoutes(server: FastifyInstance) {
    server.get("/quizzes", fetchAllQuizzes);
    server.get("/quizzes/:id", fetchQuizById);
}