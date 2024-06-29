import Fastify from "fastify";
import dotenv from "dotenv";
import registerRoutes from "./routes/routes";
import schemas from "./schemas";
import { buildJsonSchemas, register } from "fastify-zod";

dotenv.config();

const host = process.env.API_HOST ?? "0.0.0.0";
const port = Number.parseInt(process.env.API_PORT ?? "8080");

const builtJsonSchemas = buildJsonSchemas(schemas);

export const { $ref } = builtJsonSchemas;

export const buildServer = async () => {
  const server = Fastify({
    logger: true,
  });

  register(server, {
    jsonSchemas: builtJsonSchemas,
    swaggerOptions: {},
    swaggerUiOptions: {},
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
