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
import { dateWithOffset } from "../../helper/dateHelpers";
import { sendEmailForEmailVerfication } from "../../helper/emailForEmailVerification";
import { generateOTP } from "../../helper/otpHelpers";

const url = "/signup";
const method = "POST";
const schema = {
  operationId: "signUp",
  tags: ["Authentication"],
  summary:
    "Creates user based off given information, then gives user a cookie with a JWT for authentication",
} as FastifySchema;

export interface EmailTokenType {
  token: string;
  email: string;
  expires: Date;
}

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
  const hashedPassword = hashSync(password + salt, 1);

  const createdUser = await prisma.user.create({
    data: {
      email,
      firstName,
      password: hashedPassword,
      salt,
      emailVerified: false,
    },
  });

  const otp = generateOTP(16);

  const tokenToSign: EmailTokenType = {
    token: otp,
    email: createdUser.email,
    expires: dateWithOffset(1),
  };

  const jwtEmailToken = await reply.jwtSign(tokenToSign);

  reply.setCookie("email", jwtEmailToken);

  sendEmailForEmailVerfication({ to: createdUser.email, token: otp });

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
