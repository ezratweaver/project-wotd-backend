import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import LearnWOTDRequestBodyType from "../../schemas/LearnWOTDRequestBody";
import { $ref } from "../../app";
import prisma from "../../database";

const url = "/learn-wotd";
const method = "POST";
const schema = {
  operationId: "learnWOTD",
  tags: ["WOTD"],
  summary:
    "Updates a WOTD to be marked as learned, for the userKey in the jwt session provided.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { word } = request.body as LearnWOTDRequestBodyType;

  const userKey = request.user.userKey;

  const wordFromDB = await prisma.wordOfTheDay.findUnique({
    where: {
      word,
    },
  });

  if (!wordFromDB)
    return reply.status(400).send({
      error: "Word not found",
      message: "The word provided was not found.",
    });

  const wordAlreadyLearned = await prisma.userLearned.findFirst({
    where: {
      userKey,
      wotdKey: wordFromDB.wotdKey,
    },
  });

  if (wordAlreadyLearned) {
    await prisma.userLearned.delete({
      where: {
        userLearnedKey: wordAlreadyLearned.userLearnedKey,
      },
    });
    return reply.status(201).send({
      result: "Success",
      message: `Word was successfully marked as not learned for userKey: ${userKey}.`,
    });
  } else {
    await prisma.userLearned.create({
      data: {
        userKey,
        wotdKey: wordFromDB.wotdKey,
      },
    });
    return reply.status(201).send({
      result: "Success",
      message: `Word was successfully marked as learned for userKey: ${userKey}.`,
    });
  }
};

const learnWOTD = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: LearnWOTDRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("LearnWOTDRequestBody"),
      response: {
        400: $ref("GenericResponse"),
        201: $ref("GenericResponse"),
      },
    },
    preHandler: [fastify.authenticate],
    handler,
    url,
  });
};

export default learnWOTD;
