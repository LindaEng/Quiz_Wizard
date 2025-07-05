import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.STEPFUL_EMAIL || "90lineng@gmail.com", 
});

export interface FeedbackRequest {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    choices?: string[];
    questionType: 'multiple_choice' | 'text';
}

export interface FeedbackResponse {
    feedback: string;
    explanation: string;
    suggestions: string[];
    summary?: string;
    rating?: number;
}

export async function generateFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
    try {
        const prompt = buildPrompt(request);
        if (request.questionType === 'text') {
            console.log('LLM PROMPT (TEXT):', prompt);
        }
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-2024-08-06",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful educational tutor. Provide constructive feedback for incorrect quiz answers. Be encouraging but honest about mistakes. Keep responses concise and educational."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 500,
            temperature: 0.7,
        });
        if (request.questionType === 'text') {
            console.log('LLM RAW RESPONSE (TEXT):', JSON.stringify(completion, null, 2));
        }
        const response = completion.choices[0]?.message?.content || "Unable to generate feedback at this time.";
        return parseFeedbackResponse(response, request);
    } catch (error) {
        if (request.questionType === 'text') {
            console.error('Error generating LLM feedback for TEXT:', error);
        } else {
            console.error('Error generating LLM feedback:', error);
        }
        return {
            feedback: "I'm sorry, I couldn't generate feedback for this answer right now. Please try again later.",
            explanation: "There was an issue connecting to the feedback service.",
            suggestions: ["Review the question carefully", "Check your textbook or notes", "Ask your instructor for clarification"],
            rating: 1
        };
    }
}

function buildPrompt(request: FeedbackRequest): string {
    const { question, userAnswer, correctAnswer, choices, questionType } = request;
    
    let prompt = `Question: ${question}\n\n`;
    
    if (questionType === 'multiple_choice' && choices) {
        prompt += `Available choices:\n${choices.map((choice, index) => `${index + 1}. ${choice}`).join('\n')}\n\n`;
        prompt += `Your answer: ${userAnswer}\n`;
        prompt += `Correct answer: ${correctAnswer}\n\n`;
        
        prompt += `Please provide:\n1. A brief, encouraging feedback message\n2. An explanation of why the answer is incorrect\n3. 2-3 specific suggestions for improvement\n\nFormat your response as:\nFEEDBACK: [your feedback message]\nEXPLANATION: [explanation of the mistake]\nSUGGESTIONS: [suggestion 1, suggestion 2, suggestion 3]`;
    } else {
        prompt += `Your answer: "${userAnswer}"\n\n`;
        
        prompt += `Please evaluate this text answer and provide:\n1. A brief, encouraging feedback message\n2. An assessment of what's good and what could be improved\n3. 2-3 specific suggestions for a more complete or accurate answer\n4. A rating of the answer's correctness using ONLY one of these numbers: 1 (33% correct), 2 (65% correct), or 3 (100% correct).\n5. If the rating is 1, provide a one-line summary of what is missing or incorrect.\n\nConsider:\n- Is the answer relevant to the question?\n- Is it complete and detailed enough?\n- Are there any factual inaccuracies?\n- Could it be more comprehensive?\n\nFormat your response as:\nFEEDBACK: [your feedback message]\nEXPLANATION: [assessment of the answer quality]\nSUGGESTIONS: [suggestion 1, suggestion 2, suggestion 3]\nRATING: [1, 2, or 3]\nSUMMARY: [one-line summary if rating is 1, otherwise leave blank]`;
    }
    
    return prompt;
}

function parseFeedbackResponse(response: string, request: FeedbackRequest): FeedbackResponse {
    const feedbackMatch = response.match(/FEEDBACK:\s*(.+?)(?=\n|$)/i);
    const explanationMatch = response.match(/EXPLANATION:\s*(.+?)(?=\n|$)/i);
    const suggestionsMatch = response.match(/SUGGESTIONS:\s*(.+?)(?=\n|$)/i);
    const ratingMatch = response.match(/RATING:\s*(\d)/i);
    const summaryMatch = response.match(/SUMMARY:\s*(.+?)(?=\n|$)/i);
    
    let rating: number | undefined = undefined;
    if (request.questionType === 'text' && ratingMatch) {
        const parsed = parseInt(ratingMatch[1], 10);
        if ([1, 2, 3].includes(parsed)) {
            rating = parsed;
        }
    }
    
    if (feedbackMatch && explanationMatch && suggestionsMatch) {
        const suggestions = suggestionsMatch[1]
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);
        
        return {
            feedback: feedbackMatch[1].trim(),
            explanation: explanationMatch[1].trim(),
            suggestions: suggestions.length > 0 ? suggestions : ["Review the material", "Practice similar questions"],
            rating,
            summary: summaryMatch ? summaryMatch[1].trim() : undefined,
        };
    }
    
    return {
        feedback: response.trim(),
        explanation: "The answer provided was incorrect. Consider reviewing the material.",
        suggestions: ["Review the question carefully", "Check your textbook or notes", "Ask your instructor for clarification"],
        rating,
        summary: summaryMatch ? summaryMatch[1].trim() : undefined,
    };
} 