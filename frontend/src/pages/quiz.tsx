import type { Quiz } from "@/components/quiz";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ReviewModal } from "@/components/reviewModal";
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
    const [answers, setAnswers] = useState<(number | string | null)[]>([]);
	const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        fetch(quizApiUrl({ id }))
            .then((res) => res.json())
            .then((data) => {
                setQuiz(data.quiz);
                setQuestions(data.questions);
                setAnswers(Array(data.questions.length).fill(null));
            })
            .catch(setError);
    }, [id]);

    useEffect(() => {
        // Ensure answers array stays in sync with questions
        if (questions.length > 0 && answers.length !== questions.length) {
            setAnswers(Array(questions.length).fill(null));
        }
    }, [questions.length]);

    if (error)
        return (
            <div className="text-red-500 p-4">
                <p className="font-bold mb-1">An error has occurred:</p>
                <p>{error.message}</p>
            </div>
        );

    if (!quiz || questions.length === 0 || answers.length !== questions.length)
        return <div className="text-center p-8">Loading...</div>;

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
		<>
			{showReviewModal && (
				<ReviewModal
					questions={questions}
					answers={answers.map(a => (typeof a === "number" ? String(a) : a))}
					onGoToQuestion={setCurrent}
					onClose={() => setShowReviewModal(false)}
					onSubmit={() => {
						setShowReviewModal(false);
					}}
				/>
			)}

			<Card className="w-[600px] mx-auto">
				<CardHeader className="pb-8">
					<CardTitle>Quiz #{quiz.id}</CardTitle>
					<CardDescription>
						{quiz.name}
						<br />
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
							{q.choices ? (
								<ol>
									{q.choices.split(";;").map((choice: string, idx: number) => (
										<li key={choice}>
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
								</ol>
							) : (
								<textarea
									className="w-full border rounded p-2"
									placeholder="Type your answer here..."
									value={typeof answers[current] === "string" ? answers[current] as string : ""}
									onChange={e => {
										const updated = [...answers];
										updated[current] = e.target.value;
										setAnswers(updated);
									}}
								/>
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
						type="button"
						onClick={() => setCurrent((c) => c - 1)}
						disabled={current === 0}
						className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
					>
						Back
					</button>
					{current !== questions.length - 1 ? 
						<button
							type="button"
							onClick={() => setCurrent((c) => c + 1)}
							className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
						>
								Next
						</button> :
						<button
							type="button"
							onClick={() => setShowReviewModal(true)}
							className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
						>Submit Quiz</button>
					}

				</CardFooter>
			</Card>
		</>
    );
}