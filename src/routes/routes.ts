import { server } from "../app";
import healthCheck from "./healthCheck";
import signUp from "./auth/signUp";

const registerRoutes = () => {
  server.register(healthCheck);
  server.register(signUp);
};

export default registerRoutes;
