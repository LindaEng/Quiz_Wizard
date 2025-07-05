import cors from "@fastify/cors";
import session from "@fastify/session";
import cookie from "@fastify/cookie";
import fastify from "fastify";
import { quizRoutes } from "./routes/quizRoutes";
import { feedbackRoutes } from "./routes/feedbackRoutes";
import { userRoutes } from "./routes/userRoutes";
import { db } from "./db-client";

const server = fastify();

server.register(cors, {
	origin: true,
	credentials: true
});

// Register cookie plugin before session
server.register(cookie);

// Session configuration
server.register(session, {
    secret: "your-secret-key-change-in-production",
    cookieName: "sessionId",
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
});

server.register(quizRoutes, { prefix: "/api" });
server.register(feedbackRoutes, { prefix: "/api" });
server.register(userRoutes, { prefix: "/api" });

const PORT = +(process.env.BACKEND_SERVER_PORT ?? 3001);

server.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log("Server listening on port 3001");
});
