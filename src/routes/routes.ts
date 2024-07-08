import { FastifyInstance } from "fastify";
import healthCheck from "./healthCheck";
import signUp from "./auth/signUp";
import login from "./auth/login";
import signOut from "./auth/signOut";

const registerRoutes = (server: FastifyInstance) => {
  server.register(healthCheck);
  server.register(signUp);
  server.register(login);
  server.register(signOut);
};

export default registerRoutes;
