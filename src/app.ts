import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import registerRoutes from "./routes/routes";
import schemas from "./schemas";
import { buildJsonSchemas, register as registerSchemas } from "fastify-zod";
import errorHandler from "./utils/errorHandler";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import authHandler from "./utils/authHandler";
import fastifyCors from "@fastify/cors";
import { startDockerContainers } from "./docker";
import prisma from "./database";

export interface UserJWT {
  userKey: number;
  email: string;
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
  interface FastifyRequest {
    decodeToken: (token: string) => Promise<any | null>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: UserJWT;
  }
}

dotenv.config();

const host = process.env.API_HOST ?? "0.0.0.0";
const port = Number.parseInt(process.env.API_PORT ?? "3000");

const builtJsonSchemas = buildJsonSchemas(schemas);

export const { $ref } = builtJsonSchemas;

export const buildServer = async () => {
  if (process.env.NODE_ENV?.toLowerCase() === "test") {
    await startDockerContainers();
  }

  if (!process.env.COOKIE_SECRET_KEY || !process.env.JWT_SECRET_KEY) {
    throw new Error(
      "Must have a COOKIE_SECRET_KEY and JWT_SECRET_KEY in the '.env' file.",
    );
  }

  if (!process.env.APP_NAME) {
    throw new Error("Must have a APP_NAME in the '.env' file ");
  }

  const server = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });

  server.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET_KEY,
    parseOptions: {
      secure: true,
      signed: true,
      httpOnly: true,
      sameSite: "none",
    },
    hook: "preParsing",
  });

  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET_KEY,
  });

  server.register(fastifyCors, {
    origin: true,
    credentials: true,
  });

  server.setErrorHandler(errorHandler);

  server.decorate(
    "authenticate",
    (request: FastifyRequest, reply: FastifyReply) =>
      authHandler(server, request, reply),
  );

  server.decorateRequest("decodeToken", async (token: string) => {
    const isBlacklisted = !!(await prisma.jWTBlacklist.findUnique({
      where: {
        jwt: token,
      },
    }));

    if (isBlacklisted) return null;

    return server.jwt.decode(token);
  });

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
