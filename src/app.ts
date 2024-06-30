import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import registerRoutes from "./routes/routes";
import schemas from "./schemas";
import { buildJsonSchemas, register as registerSchemas } from "fastify-zod";

dotenv.config();

const host = process.env.API_HOST ?? "0.0.0.0";
const port = Number.parseInt(process.env.API_PORT ?? "3000");

const builtJsonSchemas = buildJsonSchemas(schemas);

export const { $ref } = builtJsonSchemas;

export const buildServer = async () => {
  const server = Fastify({
    logger: true,
  });

  server.setErrorHandler(
    (error: Error, request: FastifyRequest, reply: FastifyReply) => {
      console.error("\n\n", error, "\n\n");
      return reply.status(500).send({
        result: "Internal Server Error",
        message: "An internal server error has occured.",
      });
    },
  );

  registerSchemas(server, {
    jsonSchemas: builtJsonSchemas,
    swaggerOptions: {
      openapi: {
        openapi: "3.0.0",
        info: {
          title: "project-wotd",
          description: "",
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
