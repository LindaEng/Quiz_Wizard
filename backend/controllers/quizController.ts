import { FastifyRequest, FastifyReply } from "fastify";
import { getAllQuizzes, getQuizById } from "../models/quizModel";

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