import { type Quiz, QuizzesList } from "@/components/quiz";
import { quizzesApiUrl, incompleteAttemptsApiUrl } from "@/paths";
import { useEffect, useState } from "react";

export function RootPage() {
	const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		// Fetch quizzes and incomplete attempts in parallel
		Promise.all([
			fetch(quizzesApiUrl({})).then((res) => res.json()),
			fetch(incompleteAttemptsApiUrl({}), { credentials: "include" }).then((res) => res.json()).catch(() => [])
		])
		.then(([quizzesData, incompleteAttempts]) => {
			// Create a set of quiz IDs that have incomplete attempts
			const incompleteQuizIds = new Set(incompleteAttempts.map((attempt: any) => attempt.quiz_id));
			
			// Merge the data
			const quizzesWithAttempts = quizzesData.map((quiz: Quiz) => ({
				...quiz,
				hasIncompleteAttempt: incompleteQuizIds.has(quiz.id)
			}));
			
			setQuizzes(quizzesWithAttempts);
		})
		.catch(setError);
	}, []);

	if (error) return <div className="text-center p-8 font-sans">An error has occurred: {error.message}</div>;

	if (!quizzes) return <div className="text-center p-8 font-sans">Loading...</div>;

	return (
		<div className="flex flex-col items-center w-full px-2">
			<div className="w-full max-w-5xl mx-auto">
				<div className="text-2xl font-bold mt-5 mb-2 text-center">Welcome back!</div>
				<div className="mb-8" style={{ borderBottom: '0.5px solid black' }} />
			</div>
			<div className="w-full max-w-5xl mx-auto">
				<QuizzesList quizzes={quizzes} />
			</div>
		</div>
	);
}
