import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import prisma from "../database";

const url = "/signup";
const method = "POST";

const handler = async (request: FastifyRequest, reply: FastifyReply) => {};

const signUp = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    handler,
    url,
  });
};

export default signUp;
