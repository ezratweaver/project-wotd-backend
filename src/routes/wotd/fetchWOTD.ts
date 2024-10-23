import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";
import FetchWOTDRequestParamsType from "../../schemas/FetchWOTDRequestParams";
import { dateWithoutHours, dateWithOffset } from "../../helper/dateHelpers";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const url = "/fetch-wotd/:wordDate";
const method = "GET";
const schema = {
  operationId: "fetchWOTD",
  tags: ["WOTD"],
  summary: "Given a date, fetches the word of the day for that date",
} as FastifySchema;

const createPresignedGETUrl = ({ s3Key }: { s3Key: string }) => {
  const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME } =
    process.env;

  if (!AWS_REGION || !AWS_ACCESS_KEY || !AWS_SECRET_KEY || !AWS_BUCKET_NAME) {
    throw new Error("Missing environment variables required for AWS.");
  }

  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
    },
  });

  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: s3Key,
  });

  return getSignedUrl(s3Client, command);
};

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { wordDate } = request.params as FetchWOTDRequestParamsType;

  const userKey = request.user.userKey;

  const wordDateWithoutHours = dateWithoutHours(wordDate);

  const prevWordDate = dateWithoutHours(dateWithOffset(-1, wordDate));

  const foundWord = await prisma.wordOfTheDay.findFirst({
    where: {
      date: wordDateWithoutHours,
    },
  });

  const previousDayWord = await prisma.wordOfTheDay.count({
    where: {
      date: prevWordDate,
    },
  });

  const userLearned = await prisma.userLearned.findFirst({
    where: {
      userKey,
      wotdKey: foundWord?.wotdKey,
    },
  });

  return reply.status(200).send({
    wordData: foundWord
      ? {
          ...foundWord,
          learned: !!userLearned,
          pronunciationUrl: await createPresignedGETUrl({
            s3Key: foundWord.pronunciationS3Key,
          }),
        }
      : undefined,
    wordPrevDay: previousDayWord > 0,
  });
};

const fetchWOTD = async (fastify: FastifyInstance) => {
  fastify.route<{ Params: FetchWOTDRequestParamsType }>({
    method,
    schema: {
      ...schema,
      params: $ref("FetchWOTDRequestParams"),
      response: {
        200: $ref("FetchWOTDResponse"),
      },
    },
    handler,
    preHandler: [fastify.authenticate],
    url,
  });
};

export default fetchWOTD;
