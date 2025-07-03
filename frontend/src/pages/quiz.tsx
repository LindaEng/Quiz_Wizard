import type { Quiz } from "@/components/quiz";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { quizApiUrl, rootPath } from "@/paths";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export function QuizPage() {
	const { id } = useParams();
	if (!id) throw new Error("Quiz id param is required");

	const [quiz, setQuiz] = useState<Quiz | null>(null);
	const [questions, setQuestions] = useState<any[]>([]);
	const [error, setError] = useState<Error | null>(null);
	const [current, setCurrent] = useState(0);
	const [showQuiz, setShowQuiz] = useState(false);
	const [answers, setAnswers] = useState<(number | null)[]>([]);

	useEffect(() => {
		fetch(quizApiUrl({ id }))
			.then((res) => res.json())
			.then((data) => {
				setQuiz(data.quiz);
				setQuestions(data.questions);
				console.log(data)
				setAnswers(Array(data.questions.length).fill(null));
			})
			.catch(setError);
			    if (quiz) {
    }
	}, [id]);
	

	if (error)
		return (
			<div className="text-red-500 p-4">
				<p className="font-bold mb-1">An error has occurred:</p>
				<p>{error.message}</p>
			</div>
		);

	if (!quiz) return <div className="text-center p-8">Loading...</div>;
	    if (!showQuiz) {
        return (
            <Card className="w-[600px] mx-auto">
                <CardHeader className="pb-8">
                    <CardTitle>Quiz #{quiz.id}</CardTitle>
                    <CardDescription>{quiz.name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>This quiz has {questions.length} questions.</p>
                </CardContent>
                <CardFooter className="flex justify-end pt-8">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => setShowQuiz(true)}
                    >
                        Take the quiz
                    </button>
                </CardFooter>
            </Card>
        );
    }

	const q = questions[current];

	const pointsSoFar = questions.reduce((sum, q, idx) => {
		console.log("TEESTTT",)
		if (
			answers[idx] !== null &&
			q.correct_choice_index !== null &&
			answers[idx] === q.correct_choice_index
		) {
			return sum + (q.weight || 1);
		}
		return sum;
	}, 0);

	return (
		<Card className="w-[600px] mx-auto">
			<CardHeader className="pb-8">
				<CardTitle>Quiz #{quiz.id}</CardTitle>
				<CardDescription>
					{quiz.name}<br/>
					Question {current + 1} of {questions.length}
				</CardDescription>
			</CardHeader>
			<CardContent>
				    <p className="mb-2 font-semibold">
        Points so far: {pointsSoFar}
    </p>
				{q && (
					<div>
						<div className="mb-4">{q.question_content}</div>
						{q.choices && (
							<ul>
								{q.choices.split(";;").map((choice: string, idx: number) => (
										<li key={idx}>
											<label>
												<input
													type="radio"
													name={`question-${current}`}
													checked={answers[current] === idx}
													onChange={() => {
														const updated = [...answers];
														updated[current] = idx;
														setAnswers(updated);
													}}
												/>
												{choice}
											</label>
										</li>
								))}
							</ul>
						)}
					</div>
				)}
			</CardContent>
			<CardFooter className="flex justify-between pt-8">
				<Link
					to={rootPath.pattern}
					className="text-muted-foreground hover:text-blue-600"
				>
					Back to home page
				</Link>
				<button
					onClick={() => setCurrent((c) => c - 1)}
					disabled={current === 0}
					className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"				
				>
					Back
				</button>
				<button
					onClick={() => setCurrent((c) => c + 1)}
					disabled={current === questions.length - 1}
					className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
				>
					Next
				</button>
			</CardFooter>
		</Card>
	);
}
