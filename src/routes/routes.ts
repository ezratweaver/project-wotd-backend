import { FastifyInstance } from "fastify";
import healthCheck from "./healthCheck";
import signUp from "./auth/signUp";
import login from "./auth/login";

const registerRoutes = (server: FastifyInstance) => {
  server.register(healthCheck);
  server.register(signUp);
  server.register(login);
};

export default registerRoutes;
