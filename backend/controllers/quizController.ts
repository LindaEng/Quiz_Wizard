import { FastifyRequest, FastifyReply } from "fastify";
import { getAllQuizzes, getQuizById, saveQuizAttempt as saveAttempt, getQuizAttempt as getAttempt, getIncompleteAttempts as getIncomplete } from "../models/quizModel";

export async function fetchAllQuizzes(_req: FastifyRequest, reply: FastifyReply) {
    const quizzes = await getAllQuizzes();
    return reply.send(quizzes);
}

export async function fetchQuizById(req: FastifyRequest<{ Params: {id : string }}>, reply: FastifyReply) {
    const { id } = req.params;
    const result = getQuizById(Number(id));
    if(!result.quiz) {
        return reply.code(404).send({ error: "Quiz not found"});
    }
    return reply.send(result);
}

export async function saveQuizAttempt(req: FastifyRequest<{
    Body: {
        quizId: number;
        answers: string;
        currentQuestion: number;
        completed?: boolean;
    }
}>, reply: FastifyReply) {
    const session = req.session as any;
    if (!session.userId) {
        return reply.code(401).send({ error: "Not authenticated" });
    }
    
    const { quizId, answers, currentQuestion, completed = false } = req.body;
    
    try {
        const result = saveAttempt(session.userId, quizId, answers, currentQuestion, completed);
        return reply.send({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        return reply.code(500).send({ error: "Failed to save quiz attempt" });
    }
}

export async function getQuizAttempt(req: FastifyRequest<{ 
    Params: { quizId: string };
}>, reply: FastifyReply) {
    const session = req.session as any;
    if (!session.userId) {
        return reply.code(401).send({ error: "Not authenticated" });
    }
    
    const { quizId } = req.params;
    
    try {
        const attempt = getAttempt(session.userId, Number(quizId));
        if (!attempt) {
            return reply.code(404).send({ error: "No incomplete attempt found" });
        }
        return reply.send(attempt);
    } catch (error) {
        return reply.code(500).send({ error: "Failed to retrieve quiz attempt" });
    }
}

export async function getIncompleteAttempts(req: FastifyRequest, reply: FastifyReply) {
    const session = req.session as any;
    if (!session.userId) {
        return reply.code(401).send({ error: "Not authenticated" });
    }
    
    try {
        const attempts = getIncomplete(session.userId);
        return reply.send(attempts);
    } catch (error) {
        return reply.code(500).send({ error: "Failed to retrieve incomplete attempts" });
    }
}