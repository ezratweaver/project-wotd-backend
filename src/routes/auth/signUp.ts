import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";
import SignUpRequestBodyType from "../../schemas/SignUpRequestBody";
import { hashSync } from "bcrypt";
import { randomBytes } from "crypto";
import sendEmailAndSetCookie from "../../utils/sendEmailAndSetCookie";

const url = "/signup";
const method = "POST";
const schema = {
  operationId: "signUp",
  tags: ["Authentication"],
  summary:
    "Creates user based off given information, then gives user a cookie with a JWT for authentication",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, firstName, password } = request.body as SignUpRequestBodyType;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return reply.status(409).send({
      error: "Email In Use",
      message: "Email is already in use.",
    });
  }

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = hashSync(password + salt, 10);

  const createdUser = await prisma.user.create({
    data: {
      email,
      firstName,
      password: hashedPassword,
      salt,
      emailVerified: false,
    },
  });

  await sendEmailAndSetCookie({
    email: createdUser.email,
    firstName: createdUser.firstName,
    reply,
  });

  return reply.status(201).send({
    result: "Success",
    message:
      "New user was created successfully. A token has been sent to the email address provided.",
  });
};

const signUp = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: SignUpRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("SignUpRequestBody"),
      response: {
        201: $ref("GenericResponse"),
        409: $ref("GenericResponse"),
      },
    },
    handler,
    url,
  });
};

export default signUp;
