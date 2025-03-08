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
import forgotPassword from "./auth/forgotPassword";
import confirmForgotPassword from "./auth/confirmForgotPassword";
import resetPassword from "./auth/resetPassword";
import createDeck from "./wotd/createDeck";
import addWordToDeck from "./wotd/addWordToDeck";
import listDecks from "./wotd/listDecks";
import listDeck from "./wotd/listDeck";
import renameDeck from "./wotd/renameDeck";
import deleteDeck from "./wotd/deleteDeck";

const routes = [
  healthCheck,
  signUp,
  login,
  signOut,
  fetchWOTD,
  learnWOTD,
  confirmEmailToken,
  resendEmailToken,
  fetchReviewDashboard,
  fetchWordsToReview,
  markWordsReviewed,
  addWOTD,
  forgotPassword,
  confirmForgotPassword,
  resetPassword,
  createDeck,
  addWordToDeck,
  listDecks,
  listDeck,
  renameDeck,
  deleteDeck,
];

const registerRoutes = (server: FastifyInstance) => {
  for (const route of routes) {
    server.register(route);
  }
};

export default registerRoutes;
