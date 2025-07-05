import cors from "@fastify/cors";
import fastify from "fastify";
import { quizRoutes } from "./routes/quizRoutes";
import { feedbackRoutes } from "./routes/feedbackRoutes";

const server = fastify();

server.register(cors, {});

const PORT = +(process.env.BACKEND_SERVER_PORT ?? 3001);

server.get("/", async (_request, _reply) => {
	return "hello world\n";
});

server.register(quizRoutes, { prefix: "/api" });
server.register(feedbackRoutes, { prefix: "/api" });

server.listen({ port: PORT }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
});
