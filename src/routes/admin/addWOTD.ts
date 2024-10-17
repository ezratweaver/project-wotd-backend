import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import AddWOTDRequestBodyType from "../../schemas/AddWOTDRequestBody";
import { compareSync } from "bcrypt";
import prisma from "../../database";

const url = "/add-wotd";
const method = "POST";
const schema = {
  operationId: "addWOTD",
  tags: ["Admin"],
  summary:
    "Add a word of the day to be put into the database, for users to learn and review.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { password, word } = request.body as AddWOTDRequestBodyType;

  if (!compareSync(password, process.env.ADMIN_PASSWORD ?? "")) {
    console.warn(
      "/add-wotd authentication failed, did you forget your password?",
    );
    return reply.status(401).send();
  }

  let pronunciationSoundBuffer: Buffer;
  if (word.pronunciationSound) {
    const arrayBuffer = await word.pronunciationSound.arrayBuffer();

    pronunciationSoundBuffer = Buffer.from(arrayBuffer);
  }

  await prisma.wordOfTheDay.create({
    data: {
      ...word,
      pronunciationSound: {} as Buffer,
    },
  });
};

const addWOTD = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: AddWOTDRequestBodyType }>({
    method,
    schema: {
      ...schema,
    },
    handler,
    url,
  });
};

export default addWOTD;
