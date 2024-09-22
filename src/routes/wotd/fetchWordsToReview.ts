import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import prisma from "../../database";
import { isDateXDaysFromNowOrFarther } from "../../helper/dateHelpers";
import { $ref } from "../../app";

const url = "/fetch-words-to-review";
const method = "GET";
const schema = {
  operationId: "fetchWordsToReview",
  tags: ["WOTD"],
  summary: "Returns set of words for user to review.",
} as FastifySchema;

interface LearnedWordsQuery {
  word: {
    wotdKey: number;
    word: string;
    definition: string;
    pronunciation: string;
    partOfSpeech: string;
    usage: string;
    date: Date;
  } | null;
  userLearnedKey: number;
  wotdKey: number;
  userKey: number;
  dateLearned: Date;
  lastReviewed: Date | null;
}

const determineWhichWordsAreReadyForReview = (
  words: LearnedWordsQuery[],
  maxReviewLength: number = 10,
  daysSinceLastReviewOffset: number = 3,
) => {
  const wordsToReview = [];
  /*
   * First, go through every word, and if it hasn't been
   * reviewed yet, add it to the array
   */
  for (const learnedWord of words) {
    if (wordsToReview.length >= maxReviewLength) {
      return wordsToReview;
    }

    if (!learnedWord.lastReviewed && learnedWord.word) {
      wordsToReview.push(learnedWord.word);
    }
  }

  /*
   * Then, if we still have space left, find words that haven't been
   * reviewed since our daysSinceLastReviewOffset.
   */
  for (const learnedWord of words) {
    if (wordsToReview.length >= maxReviewLength) {
      return wordsToReview;
    }

    if (
      learnedWord.lastReviewed &&
      learnedWord.word &&
      isDateXDaysFromNowOrFarther(
        learnedWord.lastReviewed,
        daysSinceLastReviewOffset,
      )
    ) {
      wordsToReview.push(learnedWord.word);
    }
  }

  /*
   * Lastly, if there still aren't any words in the array, just add them
   * to the array in the order we recieved them from the database.
   */
  if (wordsToReview.length > 0) {
    return wordsToReview;
  } else {
    for (const learnedWord of words) {
      if (wordsToReview.length >= maxReviewLength) {
        return wordsToReview;
      }

      if (learnedWord.word) wordsToReview.push(learnedWord.word);
    }
    return wordsToReview;
  }
};

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const userKey = request.user.userKey;

  const learnedWordsQuery = await prisma.userLearned.findMany({
    where: {
      userKey,
    },
    include: {
      word: true,
    },
    orderBy: {
      lastReviewed: "asc",
    },
  });

  const wordsReadyForReview =
    determineWhichWordsAreReadyForReview(learnedWordsQuery);

  return reply.status(202).send({ words: wordsReadyForReview });
};

const fetchWordsToReview = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    schema: {
      ...schema,
      response: {
        202: $ref("FetchWordsToReviewResponse"),
      },
    },
    handler,
    preHandler: [fastify.authenticate],
    url,
  });
};

export default fetchWordsToReview;
