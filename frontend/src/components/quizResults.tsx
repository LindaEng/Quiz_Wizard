import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FeedbackModal, type FeedbackData } from "./feedbackModal";
import { Lightbulb, CheckCircle, AlertCircle, Trophy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { feedbackApiUrl } from "@/paths";

interface Question {
    id: number;
    question_content: string;
    choices?: string;
    correct_choice_index?: number | null;
    weight?: number;
}

interface QuizResultsProps {
    questions: Question[];
    answers: (number | string | null)[];
    quizName: string;
    onRetake: () => void;
    onBackToHome: () => void;
    llmRatings: { [index: number]: number };
    llmSummaries: { [index: number]: string };
}

export function QuizResults({ questions, answers, quizName, onRetake, onBackToHome, llmRatings, llmSummaries }: QuizResultsProps) {
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
    const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

    const totalQuestions = questions.length;
    const getScoreForQuestion = (question: Question, index: number) => {
        const userAnswer = answers[index];
        if (userAnswer === null || userAnswer === "") return 0;
        if (question.correct_choice_index !== null && question.correct_choice_index !== undefined) {
            return userAnswer === question.correct_choice_index ? 1 : 0;
        } else {
            if (llmRatings[index] >= 2) return 1;
            return 0;
        }
    };
    const correctAnswers = questions.reduce((sum, question, index) => sum + getScoreForQuestion(question, index), 0);
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const incorrectAnswers = questions.filter((question, index) => {
        const userAnswer = answers[index];
        if (userAnswer === null || userAnswer === "") return false;
        if (question.correct_choice_index !== null && question.correct_choice_index !== undefined) {
            return userAnswer !== question.correct_choice_index;
        }
        // For text questions, show them for feedback evaluation
        return true;
    });
    const hasIncorrectAnswers = incorrectAnswers.length > 0;

    const getCorrectAnswerText = (question: Question, index?: number): string => {
        if (question.correct_choice_index !== null && question.correct_choice_index !== undefined && question.choices) {
            const choices = question.choices.split(";;");
            return choices[question.correct_choice_index];
        }
        if (typeof index === "number" && llmRatings[index] === 1 && llmSummaries[index]) {
            return llmSummaries[index];
        }
        // For text questions, return an empty string
        return "";
    };

    const getUserAnswerText = (question: Question, index: number): string => {
        const userAnswer = answers[index];
        if (userAnswer === null || userAnswer === "") return "No answer provided";
        if (question.choices && typeof userAnswer === "number") {
            const choices = question.choices.split(";;");
            return choices[userAnswer] || "Invalid answer";
        }
        return String(userAnswer);
    };

    const generateFeedback = async (questionIndex: number) => {
        const question = questions[questionIndex];
        const userAnswer = answers[questionIndex];
        if (userAnswer === null || userAnswer === "") return;
        setIsLoadingFeedback(true);
        setSelectedQuestionIndex(questionIndex);
        try {
            const response = await fetch(feedbackApiUrl({}), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: question.question_content,
                    userAnswer: getUserAnswerText(question, questionIndex),
                    correctAnswer: getCorrectAnswerText(question, questionIndex),
                    choices: question.choices ? question.choices.split(";;") : undefined,
                    questionType: question.choices ? "multiple_choice" : "text"
                }),
            });
            if (response.ok) {
                const feedback = await response.json();
                setFeedbackData(feedback);
            } else {
                setFeedbackData({
                    feedback: "Unable to generate feedback at this time.",
                    explanation: "There was an issue connecting to the feedback service.",
                    suggestions: ["Review the material", "Check your textbook", "Ask your instructor"],
                });
            }
        } catch (error) {
            setFeedbackData({
                feedback: "Unable to generate feedback at this time.",
                explanation: "There was an issue connecting to the feedback service.",
                suggestions: ["Review the material", "Check your textbook", "Ask your instructor"],
            });
        } finally {
            setIsLoadingFeedback(false);
        }
    };

    const closeFeedbackModal = () => {
        setSelectedQuestionIndex(null);
        setFeedbackData(null);
    };

    return (
        <>
            <Card className="w-[800px] mx-auto">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        {score >= 80 ? (
                            <Trophy className="h-8 w-8 text-yellow-500" />
                        ) : (
                            <Lightbulb className="h-8 w-8 text-blue-500" />
                        )}
                        <CardTitle className="text-3xl">Quiz Results</CardTitle>
                    </div>
                    <CardDescription className="text-lg">{quizName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Score Summary */}
                    <div className="text-center space-y-4">
                        <div className="text-4xl font-bold text-primary">{score}%</div>
                        <div className="text-lg text-muted-foreground">
                            {correctAnswers.toFixed(2)} out of {totalQuestions} questions correct
                        </div>
                        <Progress value={score} className="w-full" />
                    </div>
                    {/* Performance Message */}
                    <div className="text-center p-4 rounded-lg bg-muted">
                        {score >= 90 && (
                            <p className="text-green-600 font-semibold">🎉 Excellent work! You've mastered this material!</p>
                        )}
                        {score >= 70 && score < 90 && (
                            <p className="text-blue-600 font-semibold">👍 Good job! You have a solid understanding of the material.</p>
                        )}
                        {score >= 50 && score < 70 && (
                            <p className="text-yellow-600 font-semibold">📚 Not bad! Review the incorrect answers to improve your understanding.</p>
                        )}
                        {score < 50 && (
                            <p className="text-red-600 font-semibold">📖 Keep studying! Review the feedback below to strengthen your knowledge.</p>
                        )}
                    </div>
                    {/* Incorrect Answers Section */}
                    {hasIncorrectAnswers && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                Review Answers ({incorrectAnswers.length})
                            </h3>
                            <div className="space-y-3">
                                {questions.map((question, index) => {
                                    const userAnswer = answers[index];
                                    if (userAnswer === null || userAnswer === "") return null;
                                    const isCorrect = question.correct_choice_index !== null && question.correct_choice_index !== undefined && userAnswer === question.correct_choice_index;
                                    if (isCorrect && question.correct_choice_index !== null) return null;
                                    const isTextQuestion = question.correct_choice_index === null;
                                    const isTextWrong = isTextQuestion && llmRatings[index] === 1;
                                    return (
                                        <Card key={index} className={isTextWrong ? "border-red-200" : isTextQuestion ? "border-blue-200" : "border-red-200"}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold mb-2">
                                                            Question {index + 1}: {question.question_content}
                                                        </h4>
                                                        {isTextQuestion ? (
                                                            <div className="text-sm">
                                                                <span className={`font-medium ${isTextWrong ? "text-red-600" : "text-blue-600"}`}>Your Answer:</span>
                                                                <p className={isTextWrong ? "text-red-600" : "text-blue-600"}>{getUserAnswerText(question, index)}</p>
                                                                {isTextQuestion && llmRatings[index] && (
                                                                    <div className="mt-2 text-xs text-blue-700">
                                                                        <span className="font-semibold">AI Rating:</span> {llmRatings[index]} / 3 ({llmRatings[index] === 1 ? "33%" : llmRatings[index] === 2 ? "65%" : llmRatings[index] === 3 ? "100%" : ""} correct)
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <span className="font-medium text-red-600">Your Answer:</span>
                                                                    <p className="text-red-600">{getUserAnswerText(question, index)}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-green-600">Expected Answer:</span>
                                                                    <p className="text-green-600">{getCorrectAnswerText(question, index)}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        onClick={() => generateFeedback(index)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="ml-4"
                                                    >
                                                        <Lightbulb className="h-4 w-4 mr-1" />
                                                        Get Feedback
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {/* All Correct Message */}
                    {!hasIncorrectAnswers && correctAnswers > 0 && (
                        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                            <h3 className="text-xl font-semibold text-green-800 mb-2">Perfect Score!</h3>
                            <p className="text-green-700">Congratulations! You answered all questions correctly.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={onBackToHome} variant="outline">
                        Back to Home
                    </Button>
                    <Button onClick={onRetake} className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Retake Quiz
                    </Button>
                </CardFooter>
            </Card>
            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={selectedQuestionIndex !== null}
                onClose={closeFeedbackModal}
                feedback={feedbackData}
                isLoading={isLoadingFeedback}
                question={selectedQuestionIndex !== null ? questions[selectedQuestionIndex].question_content : ""}
                userAnswer={selectedQuestionIndex !== null ? getUserAnswerText(questions[selectedQuestionIndex], selectedQuestionIndex) : ""}
                correctAnswer={selectedQuestionIndex !== null ? getCorrectAnswerText(questions[selectedQuestionIndex], selectedQuestionIndex) : ""}
            />
        </>
    );
} 