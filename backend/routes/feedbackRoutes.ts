import { FastifyInstance } from "fastify";
import { generateFeedbackForAnswer, generateBulkFeedback } from "../controllers/feedbackController";

export async function feedbackRoutes(server: FastifyInstance) {
    server.post("/feedback", generateFeedbackForAnswer);
    server.post("/feedback/bulk", generateBulkFeedback);
} 