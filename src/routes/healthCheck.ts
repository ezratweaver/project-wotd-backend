import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import isValidGitHash from "../utils/isValidGitHash";

const url = "/";
const method = "GET";
const schema = {
  operationId: "healthCheck",
  tags: ["System"],
  summary: "Returns the system health",
} as FastifySchema;

const handler = async (_: FastifyRequest, reply: FastifyReply) => {
  const { execa } = await import("execa");

  const { stdout: hash } = await execa("git", ["rev-parse", "HEAD"], {
    shell: false,
  });

  if (!isValidGitHash(hash)) {
    throw new Error("Git command execution did not return a valid git hash.");
  }

  return reply.status(200).send({
    state: "online",
    version: hash,
  });
};

const healthCheck = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    handler,
    url,
    schema,
  });
};

export default healthCheck;
