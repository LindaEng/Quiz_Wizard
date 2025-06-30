import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { quizPath } from "@/paths";
import { Link } from "react-router-dom";

export type Quiz = {
    id: number;
    name: string;
};


function QuizItem({ quiz }: { quiz: Quiz }) {
    return (
        <TableRow>
            <TableCell>{quiz.id}</TableCell>
            <TableCell>{quiz.name}</TableCell>
            <TableCell>
                <Button asChild>
                    <Link to={quizPath({ id: quiz.id.toString() })}>Take quiz</Link>
                </Button>
            </TableCell>
        </TableRow>
    );
}

export function QuizzesList({ quizzes }: { quizzes?: Quiz[] }) {

    const safeQuizzes = Array.isArray(quizzes) ? quizzes : [];
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {safeQuizzes.map((quiz) => (
                    <QuizItem key={quiz.id} quiz={quiz} />
                ))}
            </TableBody>
        </Table>
    );
}