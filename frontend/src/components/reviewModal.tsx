import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type ReviewModalProps = {
  questions: { question_content: string }[];
  answers: (string | null)[];
  onGoToQuestion: (idx: number) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function ReviewModal({ questions, answers, onGoToQuestion, onClose, onSubmit }: ReviewModalProps) {
  const unanswered = questions
    .map((q, idx) => ({ ...q, idx }))
    .filter((_, idx) => answers[idx] === null || answers[idx] === "");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Review &amp; Submit</CardTitle>
        </CardHeader>
        <CardContent>
          {unanswered.length === 0 ? (
            <p className="mb-4 text-green-600">All questions answered!</p>
          ) : (
            <>
              <p className="mb-2 text-red-600">
                You have {unanswered.length} unanswered question{unanswered.length > 1 ? "s" : ""}:
              </p>
              <ul className="mb-4">
                {unanswered.map((q) => (
                  <li key={q.idx} className="mb-1">
                    <button
                      className="underline text-blue-600"
                      onClick={() => {
                        onGoToQuestion(q.idx);
                        onClose();
                      }}
                    >
                      Go to Question {q.idx + 1}
                    </button>
                    : {q.question_content}
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
        <CardFooter className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 border rounded"
            onClick={onClose}
          >
            Go Back to Review
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            disabled={unanswered.length > 0}
            onClick={onSubmit}
          >
            Submit Quiz
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}