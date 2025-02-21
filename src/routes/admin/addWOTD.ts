import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import AddWOTDRequestBodyType from "../../schemas/AddWOTDRequestBody";
import { compareSync } from "bcrypt";
import prisma from "../../database";
import {
  PollyClient,
  StartSpeechSynthesisTaskCommand,
} from "@aws-sdk/client-polly";
import { $ref } from "../../app";

const url = "/add-wotd";
const method = "POST";
const schema = {
  operationId: "addWOTD",
  tags: ["Admin"],
  summary:
    "Add a word of the day to be put into the database, for users to learn and review.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const pollyClient = new PollyClient({
    region: process.env.AWS_REGION,
  });

  const { password, word } = request.body as AddWOTDRequestBodyType;

  if (!process.env.ADMIN_PASSWORD) {
    return reply.status(404).send();
  }

  if (!compareSync(password, process.env.ADMIN_PASSWORD)) {
    console.warn(
      "/add-wotd authentication failed, did you forget your password?",
    );
    return reply.status(401).send();
  }

  const wordAlreadyExists = await prisma.wordOfTheDay.findUnique({
    where: {
      word: word.word,
    },
  });

  if (wordAlreadyExists) {
    return reply.status(409).send({
      error: "Word Already Exists",
      message: "Word given already exists in database.",
    });
  }

  let pronunciationS3Key: string;
  try {
    const voiceCommand = new StartSpeechSynthesisTaskCommand({
      OutputFormat: "mp3",
      OutputS3BucketName: process.env.AWS_BUCKET_NAME,
      OutputS3KeyPrefix: word.word,
      Text: word.word,
      VoiceId: "Amy",
    });

    const response = await pollyClient.send(voiceCommand);

    if (!response.SynthesisTask)
      throw new Error("No SynthesisTask was returned.");

    if (!response.SynthesisTask.TaskId)
      throw new Error("No TaskId was returned.");

    pronunciationS3Key = `${word.word}.${response.SynthesisTask.TaskId}.mp3`;
  } catch (error) {
    console.log({
      message: "Failed to create pronunciation sound and put it into S3.",
      error,
    });
    return reply.status(500).send({
      error: "AWS Polly Failure",
      messge: "Failed to create pronunciation sound.",
    });
  }

  await prisma.wordOfTheDay.create({
    data: {
      ...word,
      pronunciationS3Key,
    },
  });

  return reply.status(201).send();
};

const addWOTD = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: AddWOTDRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("AddWOTDRequestBody"),
    },
    handler,
    url,
  });
};

export default addWOTD;
