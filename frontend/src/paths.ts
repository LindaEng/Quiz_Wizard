import { type Params, path as pathFactory } from "static-path";

const SERVER_HOST = import.meta.env.VITE_BACKEND_SERVER || "localhost:3001";
export const SERVER_ORIGIN = `http://${SERVER_HOST}`;

const apiUrlFactory = <T extends string>(pattern: T) => {
	const builder = pathFactory(pattern);
	return (params: Params<T>) => SERVER_ORIGIN + builder(params);
};

// api urls
export const quizApiUrl = apiUrlFactory("/api/quizzes/:id");
export const quizzesApiUrl = apiUrlFactory("/api/quizzes");
export const feedbackApiUrl = apiUrlFactory("/api/feedback");
export const quizAttemptsApiUrl = apiUrlFactory("/api/quiz-attempts");
export const quizAttemptApiUrl = apiUrlFactory("/api/quiz-attempts/:quizId");
export const incompleteAttemptsApiUrl = apiUrlFactory("/api/incomplete-attempts");
export const loginApiUrl = apiUrlFactory("/api/login");
export const registerApiUrl = apiUrlFactory("/api/register");
export const logoutApiUrl = apiUrlFactory("/api/logout");
export const currentUserApiUrl = apiUrlFactory("/api/me");

// local routes
export const rootPath = pathFactory("/");
export const quizPath = pathFactory("/quizzes/:id");
export const quizzesPath = pathFactory("/quizzes");
export const loginPath = pathFactory("/login");
export const registerPath = pathFactory("/register");
