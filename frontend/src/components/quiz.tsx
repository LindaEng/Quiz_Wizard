import { quizPath } from "@/paths";
import { Link } from "react-router-dom";

export type Quiz = {
    id: number;
    name: string;
    description?: string;
    hasIncompleteAttempt?: boolean;
    // Optionally, you can add more fields like description, numQuestions, etc.
};

function QuizItem({ quiz }: { quiz: Quiz }) {
    return (
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200 last:border-b-0">
            <div className="flex-1">
                <div className="font-bold text-lg mb-1">{quiz.name}</div>
                <div className="text-gray-700">{quiz.description || "Test your knowledge and skills with this quiz."}</div>
            </div>
            <Link to={quizPath({ id: quiz.id.toString() })}
                className={
                    quiz.hasIncompleteAttempt
                        ? "bg-blue-500 text-white font-bold rounded py-2 px-4 w-32 text-center transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        : "bg-green-500 text-white font-bold rounded py-2 px-4 w-32 text-center transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                }
            >
                {quiz.hasIncompleteAttempt ? "Resume" : "Start"}
            </Link>
        </div>
    );
}

export function QuizzesList({ quizzes }: { quizzes?: Quiz[] }) {
    const safeQuizzes = Array.isArray(quizzes) ? quizzes : [];
    return (
        <div className="w-full border border-black" style={{ borderWidth: '0.5px' }}>
            {safeQuizzes.map((quiz) => (
                <QuizItem key={quiz.id} quiz={quiz} />
            ))}
        </div>
    );
}