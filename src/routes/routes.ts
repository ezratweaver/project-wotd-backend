import healthCheck from "./healthCheck";
import signUp from "./auth/signUp";
import { FastifyInstance } from "fastify";

const registerRoutes = (server: FastifyInstance) => {
  server.register(healthCheck);
  server.register(signUp);
};

export default registerRoutes;
