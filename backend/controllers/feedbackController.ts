import { FastifyRequest, FastifyReply } from "fastify";
import { generateFeedback, FeedbackRequest } from "../services/llmFeedback";

export async function generateFeedbackForAnswer(
    req: FastifyRequest<{
        Body: {
            question: string;
            userAnswer: string;
            correctAnswer: string;
            choices?: string[];
            questionType: 'multiple_choice' | 'text';
        };
    }>,
    reply: FastifyReply
) {
    try {
        const { question, userAnswer, correctAnswer, choices, questionType } = req.body;

        if (!question || !userAnswer || !correctAnswer || !questionType) {
            return reply.code(400).send({
                error: "Missing required fields: question, userAnswer, correctAnswer, and questionType are required"
            });
        }

        if (!['multiple_choice', 'text'].includes(questionType)) {
            return reply.code(400).send({
                error: "questionType must be either 'multiple_choice' or 'text'"
            });
        }

        const feedbackRequest: FeedbackRequest = {
            question,
            userAnswer,
            correctAnswer,
            choices,
            questionType
        };

        const feedback = await generateFeedback(feedbackRequest);
        
        return reply.send(feedback);
    } catch (error) {
        console.error('Error in feedback controller:', error);
        return reply.code(500).send({
            error: "Internal server error while generating feedback"
        });
    }
}

export async function generateBulkFeedback(
    req: FastifyRequest<{
        Body: {
            incorrectAnswers: Array<{
                question: string;
                userAnswer: string;
                correctAnswer: string;
                choices?: string[];
                questionType: 'multiple_choice' | 'text';
            }>;
        };
    }>,
    reply: FastifyReply
) {
    try {
        const { incorrectAnswers } = req.body;

        if (!Array.isArray(incorrectAnswers) || incorrectAnswers.length === 0) {
            return reply.code(400).send({
                error: "incorrectAnswers must be a non-empty array"
            });
        }

        const feedbackPromises = incorrectAnswers.map(answer => 
            generateFeedback({
                question: answer.question,
                userAnswer: answer.userAnswer,
                correctAnswer: answer.correctAnswer,
                choices: answer.choices,
                questionType: answer.questionType
            })
        );

        const feedbackResults = await Promise.all(feedbackPromises);
        
        return reply.send({
            feedback: feedbackResults
        });
    } catch (error) {
        console.error('Error in bulk feedback controller:', error);
        return reply.code(500).send({
            error: "Internal server error while generating bulk feedback"
        });
    }
} 