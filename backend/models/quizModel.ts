import { db } from "../db-client";

export function getAllQuizzes() {
    const data = db.prepare("SELECT id, title FROM assignments").all() as { id: number; title: string }[];
    return data.map((row) => ({
        id: row.id,
        name: row.title,
    }));
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