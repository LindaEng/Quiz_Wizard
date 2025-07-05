import { FastifyInstance } from "fastify";
import { fetchAllQuizzes, fetchQuizById, saveQuizAttempt, getQuizAttempt, getIncompleteAttempts } from "../controllers/quizController"; 

export async function quizRoutes(server: FastifyInstance) {
    server.get("/quizzes", fetchAllQuizzes);
    server.get("/quizzes/:id", fetchQuizById);
    server.post("/quiz-attempts", saveQuizAttempt);
    server.get("/quiz-attempts/:quizId", getQuizAttempt);
    server.get("/incomplete-attempts", getIncompleteAttempts);
}