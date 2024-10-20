import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import AddWOTDRequestBodyType from "../../schemas/AddWOTDRequestBody";
import { compareSync } from "bcrypt";
import prisma from "../../database";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
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
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.POLLY_ACCESS_KEY ?? "",
      secretAccessKey: process.env.POLLY_SECRET_KEY ?? "",
    },
  });

  const { password, word } = request.body as AddWOTDRequestBodyType;

  if (!compareSync(password, process.env.ADMIN_PASSWORD ?? "")) {
    console.warn(
      "/add-wotd authentication failed, did you forget your password?",
    );
    return reply.status(401).send();
  }

  let pronunciationSoundBuffer: Buffer | undefined;
  if (word.pronunciationSound) {
    const arrayBuffer = await word.pronunciationSound.arrayBuffer();

    pronunciationSoundBuffer = Buffer.from(arrayBuffer);
  } else {
    const voiceCommand = new SynthesizeSpeechCommand({
      OutputFormat: "mp3",
      Text: word.word,
      VoiceId: "Amy",
    });

    try {
      const response = await pollyClient.send(voiceCommand);

      const soundByteArray = await response.AudioStream?.transformToByteArray();

      if (!soundByteArray) {
        throw new Error("Failed to get sound byte array from AWS.");
      }

      pronunciationSoundBuffer = Buffer.from(soundByteArray);
    } catch (error) {
      console.log({
        message: "Failed to get pronunciation sound from AWS Polly.",
        error,
      });
      return reply.status(500).send({
        error: "AWS Polly Failure",
        messge: "Failed to fetch pronunciation sound from AWS Polly.",
      });
    }
  }

  await prisma.wordOfTheDay.create({
    data: {
      ...word,
      pronunciationSound: pronunciationSoundBuffer,
    },
  });
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
