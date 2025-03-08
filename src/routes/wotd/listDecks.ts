import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import ListDecksRequestQueryType from "../../schemas/ListDecksRequestQuery";
import { $ref } from "../../app";
import prisma from "../../database";

const url = "/list-decks";
const method = "GET";
const schema = {
  operationId: "listDecks",
  tags: ["WOTD"],
  summary: "Lists all decks logged in user has created.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const word = (request.query as ListDecksRequestQueryType)?.word;

  const userKey = request.user.userKey;

  const wotd = word
    ? await prisma.wordOfTheDay.findUnique({
        where: {
          word,
        },
        select: {
          wotdKey: true,
        },
      })
    : undefined;

  const result: {
    deckKey: number;
    deckName: string;
    wordIncluded?: boolean;
    wordCount: number;
  }[] = await prisma.$queryRaw`
    SELECT
      d."deckKey",
      d."name" AS "deckName",
      COALESCE(BOOL_OR(dw."wotdKey" = ${wotd?.wotdKey ?? -1}), FALSE) AS "wordIncluded",
      COUNT(dw."deckWordKey")::INTEGER AS "wordCount"
    FROM
      "Deck" d
    LEFT JOIN "DeckWord" dw ON
      dw."deckKey" = d."deckKey"
    WHERE
      d."userKey" = ${userKey}
    GROUP BY
      d."deckKey", d."name";
  `;

  if (!word) {
    result.map((deckInfo) => (deckInfo.wordIncluded = undefined));
  }

  return reply.status(200).send(result);
};

const listDecks = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    schema: {
      ...schema,
      querystring: $ref("ListDecksRequestQuery"),
      response: {
        200: $ref("ListDecksResponse"),
      },
    },
    preHandler: [fastify.authenticate],
    handler,
    url,
  });
};

export default listDecks;
