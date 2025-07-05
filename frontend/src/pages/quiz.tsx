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
import { QuizResults } from "@/components/quizResults";
import { quizApiUrl, rootPath, quizAttemptApiUrl, quizAttemptsApiUrl } from "@/paths";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { feedbackApiUrl } from "@/paths";

export function QuizPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    if (!id) throw new Error("Quiz id param is required");

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [current, setCurrent] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [answers, setAnswers] = useState<(number | string | null)[]>([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [llmRatings, setLlmRatings] = useState<{ [index: number]: number }>({});
    const [llmSummaries, setLlmSummaries] = useState<{ [index: number]: string }>({});
    const [isScoring, setIsScoring] = useState(false);
    const [hasExistingAttempt, setHasExistingAttempt] = useState(false);

    // Save progress function
    const saveProgress = async (currentQuestion: number, answersArray: (number | string | null)[]) => {
        try {
            await fetch(quizAttemptsApiUrl({}), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    quizId: Number(id),
                    answers: JSON.stringify(answersArray),
                    currentQuestion,
                    completed: false
                })
            });
        } catch (error) {
            console.error("Failed to save progress:", error);
        }
    };

    // Load existing attempt
    const loadExistingAttempt = async () => {
        try {
            const response = await fetch(quizAttemptApiUrl({ quizId: id }), { credentials: "include" });
            if (response.ok) {
                const attempt = await response.json();
                const savedAnswers = JSON.parse(attempt.answers);
                setAnswers(savedAnswers);
                setCurrent(attempt.current_question);
                setHasExistingAttempt(true);
                return true;
            }
        } catch (error) {
            console.error("Failed to load existing attempt:", error);
        }
        return false;
    };

    useEffect(() => {
        fetch(quizApiUrl({ id }))
            .then((res) => res.json())
            .then(async (data) => {
                setQuiz(data.quiz);
                setQuestions(data.questions);
                const defaultAnswers = Array(data.questions.length).fill(null);
                setAnswers(defaultAnswers);
                
                // Try to load existing attempt
                const hasAttempt = await loadExistingAttempt();
                if (hasAttempt) {
                    setShowQuiz(true);
                }
            })
            .catch(setError);
    }, [id]);

    useEffect(() => {
        // Ensure answers array stays in sync with questions
        if (questions.length > 0 && answers.length !== questions.length) {
            setAnswers(Array(questions.length).fill(null));
        }
    }, [questions.length]);

    // Save progress whenever answers or current question changes
    useEffect(() => {
        if (showQuiz && questions.length > 0 && answers.length === questions.length) {
            saveProgress(current, answers);
        }
    }, [answers, current, showQuiz]);

    if (error)
        return (
            <div className="text-red-500 p-4 font-sans">
                <p className="font-bold mb-1">An error has occurred:</p>
                <p>{error.message}</p>
            </div>
        );

    if (!quiz || questions.length === 0 || answers.length !== questions.length)
        return <div className="text-center p-8 font-sans">Loading...</div>;

    if (!showQuiz) {
        return (
            		<Card className="w-[600px] mx-auto bg-white font-sans" style={{ border: '0.5px solid black' }}>
                <CardHeader className="pb-8">
                    <CardTitle className="font-extrabold text-2xl">Quiz #{quiz.id}</CardTitle>
                    <CardDescription className="font-bold text-lg">{quiz.name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="font-bold">This quiz has {questions.length} questions.</p>
                    {hasExistingAttempt && (
                        <p className="mt-2 text-blue-600 font-bold">
                            You have an incomplete attempt. You can resume from where you left off.
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end pt-8">
                    <button
                        className="px-4 py-2 bg-primary text-white rounded font-bold"
                        onClick={() => setShowQuiz(true)}
                    >
                        {hasExistingAttempt ? "Resume Quiz" : "Take the quiz"}
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

    if (showResults) {
        return (
            <QuizResults
                questions={questions}
                answers={answers}
                quizName={quiz?.name || "Quiz"}
                onRetake={() => {
                    setShowResults(false);
                    setShowQuiz(false);
                    setCurrent(0);
                    setAnswers(Array(questions.length).fill(null));
                    setLlmRatings({});
                    setLlmSummaries({});
                    setHasExistingAttempt(false);
                }}
                onBackToHome={() => navigate(rootPath.pattern)}
                llmRatings={llmRatings}
                llmSummaries={llmSummaries}
            />
        );
    }

    const handleSubmitQuiz = async () => {
        setShowReviewModal(false);
        setIsScoring(true);
        
        // Mark quiz as completed
        try {
            await fetch(quizAttemptsApiUrl({}), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    quizId: Number(id),
                    answers: JSON.stringify(answers),
                    currentQuestion: current,
                    completed: true
                })
            });
        } catch (error) {
            console.error("Failed to mark quiz as completed:", error);
        }
        
        const textQuestions = questions
            .map((q, idx) => ({ ...q, idx }))
            .filter(q => q.correct_choice_index === null && answers[q.idx] && answers[q.idx] !== "");
        if (textQuestions.length === 0) {
            setShowResults(true);
            setIsScoring(false);
            return;
        }
        const payload = {
            incorrectAnswers: textQuestions.map(q => ({
                question: q.question_content,
                userAnswer: answers[q.idx],
                correctAnswer: "",
                choices: undefined,
                questionType: "text"
            }))
        };
        try {
            const res = await fetch(feedbackApiUrl({}) + "/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                const ratings: { [index: number]: number } = {};
                const summaries: { [index: number]: string } = {};
                data.feedback.forEach((fb: any, i: number) => {
                    ratings[textQuestions[i].idx] = fb.rating;
                    if (fb.summary) summaries[textQuestions[i].idx] = fb.summary;
                });
                setLlmRatings(ratings);
                setLlmSummaries(summaries);
            }
        } catch (e) {}
        setIsScoring(false);
        setShowResults(true);
    };

    return (
		<>
			{showReviewModal && (
				<ReviewModal
					questions={questions}
					answers={answers.map(a => (typeof a === "number" ? String(a) : a))}
					onGoToQuestion={setCurrent}
					onClose={() => setShowReviewModal(false)}
					onSubmit={handleSubmitQuiz}
				/>
			)}

            {isScoring && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white p-8 rounded shadow text-xl font-sans">Scoring your answers...</div>
                </div>
            )}

			<Card className="w-[600px] mx-auto bg-white font-sans" style={{ border: '0.5px solid black' }}>
				<CardHeader className="pb-8">
					<CardTitle className="font-extrabold text-2xl">Quiz #{quiz.id}</CardTitle>
					<CardDescription className="font-bold text-lg">
						{quiz.name}
						<br />
						Question {current + 1} of {questions.length}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{q && (
						<div>
							<div className="mb-4 font-bold">{q.question_content}</div>
							{q.choices ? (
								<ol>
									{q.choices.split(";;").map((choice: string, idx: number) => (
										<li key={choice}>
											<label className="font-sans">
												<input
													type="radio"
													name={`question-${current}`}
													checked={answers[current] === idx}
													onChange={() => {
														const updated = [...answers];
														updated[current] = idx;
														setAnswers(updated);
													}}
													className="mr-3"
												/>
												{choice}
											</label>
										</li>
									))}
								</ol>
							) : (
								<textarea
									className="w-full border rounded p-2 font-sans"
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
						className="text-muted-foreground hover:text-primary font-bold"
					>
						Back to home page
					</Link>
					<button
						type="button"
						onClick={() => setCurrent((c) => c - 1)}
						disabled={current === 0}
						className="bg-gray-200 text-black font-bold rounded py-2 px-4 w-32 mr-2"
					>
						Back
					</button>
					{current !== questions.length - 1 ? 
						<button
							type="button"
							onClick={() => setCurrent((c) => c + 1)}
							className="bg-primary text-white font-bold rounded py-2 px-4 w-32"
						>
							Next
						</button> :
						<button
							type="button"
							onClick={() => setShowReviewModal(true)}
							className="px-4 py-2 bg-primary text-white rounded font-bold disabled:opacity-50"
						>
							Submit Quiz
						</button>
					}
				</CardFooter>
			</Card>
		</>
    );
}