import Fastify from "fastify";
import dotenv from "dotenv";
import registerRoutes from "./routes/routes";
import schemas from "./schemas";
import { buildJsonSchemas, register as registerSchemas } from "fastify-zod";
import errorHandler from "./errorHandler";
import fastifyCookie from "@fastify/cookie";

dotenv.config();

const host = process.env.API_HOST ?? "0.0.0.0";
const port = Number.parseInt(process.env.API_PORT ?? "3000");

if (!process.env.SECRET_KEY) {
  throw new Error("Must have a SECRET_KEY in the '.env' file.");
}

const builtJsonSchemas = buildJsonSchemas(schemas);

export const { $ref } = builtJsonSchemas;

export const buildServer = async () => {
  const server = Fastify({
    logger: true,
  });

  server.register(fastifyCookie, {
    secret: process.env.SECRET_KEY,
    parseOptions: {
      secure: true,
      signed: true,
    },
  });

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
