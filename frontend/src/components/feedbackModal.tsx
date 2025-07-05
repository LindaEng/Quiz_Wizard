import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, X, CheckCircle, AlertCircle } from "lucide-react";

export interface FeedbackData {
    feedback: string;
    explanation: string;
    suggestions: string[];
}

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    feedback: FeedbackData | null;
    isLoading: boolean;
    question: string;
    userAnswer: string;
    correctAnswer: string;
}

export function FeedbackModal({
    isOpen,
    onClose,
    feedback,
    isLoading,
    question,
    userAnswer,
    correctAnswer,
}: FeedbackModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card className="w-[600px] max-h-[80vh] overflow-y-auto bg-white" style={{ border: '0.5px solid black', borderRadius: '4px' }}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                            <CardTitle>AI Feedback</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardDescription>
                        Here's what you can learn from this question
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    {/* Question and Answers Section */}
                    <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Question:</h4>
                        <p className="text-sm mb-3">{question}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                    <span className="font-medium">Your Answer:</span>
                                </div>
                                <p className="text-red-600">{userAnswer}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="font-medium">Correct Answer:</span>
                                </div>
                                <p className="text-green-600">{correctAnswer}</p>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-2">Generating feedback...</span>
                        </div>
                    )}

                    {/* Feedback Content */}
                    {feedback && !isLoading && (
                        <div className="space-y-4">
                            {/* Main Feedback */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h4 className="font-semibold text-blue-900 mb-2">Feedback:</h4>
                                <p className="text-blue-800">{feedback.feedback}</p>
                            </div>

                            {/* Explanation */}
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <h4 className="font-semibold text-amber-900 mb-2">Why this is incorrect:</h4>
                                <p className="text-amber-800">{feedback.explanation}</p>
                            </div>

                            {/* Suggestions */}
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h4 className="font-semibold text-green-900 mb-2">Suggestions for improvement:</h4>
                                <ul className="list-disc list-inside space-y-1 text-green-800">
                                    {feedback.suggestions.map((suggestion, index) => (
                                        <li key={index}>{suggestion}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-end">
                    <Button onClick={onClose} variant="outline">
                        Close
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
} 