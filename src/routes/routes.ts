import { FastifyInstance } from "fastify";
import healthCheck from "./healthCheck";
import signUp from "./auth/signUp";
import login from "./auth/login";
import signOut from "./auth/signOut";
import fetchWOTD from "./wotd/fetchWOTD";
import learnWOTD from "./wotd/learnWOTD";
import confirmEmailToken from "./auth/confirmEmailToken";
import resendEmailToken from "./auth/resendEmailToken";
import fetchReviewDashboard from "./wotd/fetchReviewDashboard";
import fetchWordsToReview from "./wotd/fetchWordsToReview";
import markWordsReviewed from "./wotd/markWordsReviewed";
import addWOTD from "./admin/addWOTD";
import playWOTD from "./wotd/playWOTD";

const registerRoutes = (server: FastifyInstance) => {
  server.register(healthCheck);
  server.register(signUp);
  server.register(login);
  server.register(signOut);
  server.register(fetchWOTD);
  server.register(learnWOTD);
  server.register(confirmEmailToken);
  server.register(resendEmailToken);
  server.register(fetchReviewDashboard);
  server.register(fetchWordsToReview);
  server.register(markWordsReviewed);
  server.register(addWOTD);
  server.register(playWOTD);
};

export default registerRoutes;
