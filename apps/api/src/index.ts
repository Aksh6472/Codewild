import Fastify from "fastify";
import cors from "@fastify/cors";
import { learningPathsRoutes } from "./routes/learningPaths.js";
import { levelsRoutes } from "./routes/levels.js";
import { submissionsRoutes } from "./routes/submissions.js";
import { progressRoutes } from "./routes/progress.js";
import { questionsRoutes } from "./routes/questions.js";
import { challengesRoutes } from "./routes/challenges.js";
import { playgroundRoutes } from "./routes/playground.js";
import { dashboardRoutes } from "./routes/dashboard.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: process.env.WEB_ORIGIN ?? "http://localhost:5173" });

app.get("/healthz", async () => ({ ok: true }));

await app.register(learningPathsRoutes);
await app.register(levelsRoutes);
await app.register(submissionsRoutes);
await app.register(progressRoutes);
await app.register(questionsRoutes);
await app.register(challengesRoutes);
await app.register(playgroundRoutes);
await app.register(dashboardRoutes);

const port = Number(process.env.PORT ?? 3000);
app.listen({ port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
