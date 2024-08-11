import { FastifyInstance } from "fastify";
import healthCheck from "./healthCheck";
import signUp from "./auth/signUp";
import login from "./auth/login";
import signOut from "./auth/signOut";
import fetchWOTD from "./wotd/fetchWOTD";
import learnWOTD from "./wotd/learnWOTD";

const registerRoutes = (server: FastifyInstance) => {
  server.register(healthCheck);
  server.register(signUp);
  server.register(login);
  server.register(signOut);
  server.register(fetchWOTD);
  server.register(learnWOTD);
};

export default registerRoutes;
