import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import registerRoutes from "./routes/routes";
import schemas from "./schemas";
import { buildJsonSchemas, register as registerSchemas } from "fastify-zod";
import errorHandler from "./errorHandler";
import fastifyJwt, { FastifyJWT, JWT } from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
}

type UserPayload = { userKey: number; email: string };

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: UserPayload;
  }
}

dotenv.config();

const host = process.env.API_HOST ?? "0.0.0.0";
const port = Number.parseInt(process.env.API_PORT ?? "3000");

const builtJsonSchemas = buildJsonSchemas(schemas);

export const { $ref } = builtJsonSchemas;

export const buildServer = async () => {
  if (!process.env.SECRET_KEY) {
    throw new Error("Must have a SECRET_KEY in the '.env' file.");
  }

  const server = Fastify({
    logger: true,
  });

  server.register(fastifyCookie);

  server.register(fastifyJwt, {
    secret: process.env.SECRET_KEY,
  });

  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.cookies.token;

      if (!token) {
        return reply.status(401).send({
          error: "Unauthorized",
          message: "You are not authorized to use this resource.",
        });
      }

      const decodedToken = server.jwt.verify(token);

      request.user = decodedToken as UserPayload;
    },
  );

  server.setErrorHandler(errorHandler);

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
