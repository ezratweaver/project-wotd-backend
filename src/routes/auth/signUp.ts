import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { $ref } from "../../app";

const url = "/signup";
const method = "POST";

export const signUpRequestBody = z.object({
  email: z.string().email(),
  firstName: z.string(),
  password: z.string(),
});

type SignUpRequestBody = z.infer<typeof signUpRequestBody>;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, firstName, password } = request.body as SignUpRequestBody;

  // prisma.user.create({
  //   data: {
  //     email,
  //     firstName,
  //     password,
  //   },
  // });

  console.log("signed up!");
};

const signUp = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: SignUpRequestBody }>({
    method,
    schema: {
      body: $ref("signUpRequestBody"),
      response: {
        201: {},
      },
    },
    handler,
    url,
  });
};

export default signUp;
