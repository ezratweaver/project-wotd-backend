import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import registerRoutes from "./routes/routes";
import schemas from "./schemas";
import { buildJsonSchemas, register as registerSchemas } from "fastify-zod";
import errorHandler from "./utils/errorHandler";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import authHandler from "./utils/authHandler";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
}

dotenv.config();

const host = process.env.API_HOST ?? "0.0.0.0";
const port = Number.parseInt(process.env.API_PORT ?? "3000");

const builtJsonSchemas = buildJsonSchemas(schemas);

export const { $ref } = builtJsonSchemas;

export const buildServer = async () => {
  if (!process.env.COOKIE_SECRET_KEY || !process.env.JWT_SECRET_KEY) {
    throw new Error(
      "Must have a COOKIE_SECRET_KEY and JWT_SECRET_KEY in the '.env' file.",
    );
  }

  const server = Fastify({
    logger: true,
  });

  server.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET_KEY,
  });

  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET_KEY,
  });

  server.setErrorHandler(errorHandler);

  server.decorate(
    "authenticate",
    (request: FastifyRequest, reply: FastifyReply) =>
      authHandler(server, request, reply),
  );

  registerSchemas(server, {
    jsonSchemas: builtJsonSchemas,
    swaggerOptions: {
      openapi: {
        openapi: "3.0.0",
        info: {
          title: "project-wotd",
          version: "0.0.1",
        },
      },
    },
    swaggerUiOptions: {
      routePrefix: "/documentation",
    },
  });

  registerRoutes(server);

  return { server };
};

const main = async () => {
  const { server } = await buildServer();

  try {
    await server.listen({ port, host });
    console.log(`Server ready at http://localhost:${port}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void main();
