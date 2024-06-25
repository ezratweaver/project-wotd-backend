import { server } from "../app";
import healthCheck from "./healthCheck";

const registerRoutes = () => {
  server.register(healthCheck);
};

export default registerRoutes;
