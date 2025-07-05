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

// local routes
export const rootPath = pathFactory("/");
export const quizPath = pathFactory("/quizzes/:id");
export const quizzesPath = pathFactory("/quizzes");
