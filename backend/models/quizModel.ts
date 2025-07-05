import { db } from "../db-client";

export function getAllQuizzes() {
    return db.prepare("SELECT id, title as name FROM assignments").all();
}

export function getQuizById(id: number) {
    const quiz = db.prepare("SELECT * FROM assignments WHERE id = ?").get(id) as { id: number; title: string } | undefined;
    const questions = db.prepare(`
        SELECT id, question_content, choices, correct_choice_index, weight
        FROM assignment_questions
        WHERE assignment_id = ?
        `).all(id);

    const mappedQuiz = quiz ? { id: quiz.id, name: quiz.title } : null;
    return { questions, quiz: mappedQuiz };
}

export function saveQuizAttempt(userId: number, quizId: number, answers: string, currentQuestion: number, completed: boolean = false) {
    // Check if there's an existing attempt
    const existingAttempt = db.prepare(`
        SELECT id FROM quiz_attempts 
        WHERE user_id = ? AND quiz_id = ? AND completed = 0
    `).get(userId, quizId) as { id: number } | undefined;

    if (existingAttempt) {
        // Update existing attempt
        return db.prepare(`
            UPDATE quiz_attempts 
            SET answers = ?, current_question = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(answers, currentQuestion, completed ? 1 : 0, existingAttempt.id);
    } else {
        // Create new attempt
        return db.prepare(`
            INSERT INTO quiz_attempts (user_id, quiz_id, answers, current_question, completed)
            VALUES (?, ?, ?, ?, ?)
        `).run(userId, quizId, answers, currentQuestion, completed ? 1 : 0);
    }
}

export function getQuizAttempt(userId: number, quizId: number) {
    return db.prepare(`
        SELECT * FROM quiz_attempts 
        WHERE user_id = ? AND quiz_id = ? AND completed = 0
        ORDER BY updated_at DESC
        LIMIT 1
    `).get(userId, quizId) as {
        id: number;
        user_id: number;
        quiz_id: number;
        answers: string;
        current_question: number;
        completed: number;
        created_at: string;
        updated_at: string;
    } | undefined;
}

export function getIncompleteAttempts(userId: number) {
    return db.prepare(`
        SELECT qa.*, a.title as quiz_name
        FROM quiz_attempts qa
        JOIN assignments a ON qa.quiz_id = a.id
        WHERE qa.user_id = ? AND qa.completed = 0
        ORDER BY qa.updated_at DESC
    `).all(userId) as Array<{
        id: number;
        user_id: number;
        quiz_id: number;
        answers: string;
        current_question: number;
        completed: number;
        created_at: string;
        updated_at: string;
        quiz_name: string;
    }>;
}