import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";

const url = "/fetch-wotd";
const method = "GET";
const schema = {
  operationId: "fetchWOTD",
  tags: ["WOTD"],
  summary: "Given a date, fetches the word of the day for that date",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  // const { wordDate } = request.body as FetchWOTDRequestBodyType;
  //
  // const foundWord = prisma.wordOfTheDay.findFirst({
  //   where: {
  //     date: wordDate,
  //   },
  // });
  //
  // if (!foundWord) {
  //   return reply.status(204).send({
  //     result: "Word Not Found",
  //     message: "A word for that date does not exist.",
  //   });
  // }
  //
  // return reply.status(200).send(foundWord);
};

const fetchWOTD = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    schema: {
      ...schema,
      response: {
        204: $ref("GenericResponse"),
        200: $ref("FetchWOTDResponse"),
      },
    },
    handler,
    preHandler: [fastify.authenticate],
    url,
  });
};

export default fetchWOTD;
