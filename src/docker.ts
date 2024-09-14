import { execa } from "execa";

const DB_DOCKER_IMAGE_NAME = process.env.DB_DOCKER_IMAGE_NAME;
const DB_PORT = process.env.DB_PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;

const $ = execa({ verbose: "short" });

if (!DB_DOCKER_IMAGE_NAME || !DB_PORT || !DB_PASSWORD) {
  throw new Error(
    "Must have a DB_DOCKER_IMAGE_NAME, DB_PORT, and DB_PASSWORD in the '.env' file.",
  );
}

const containerIsRunning = async (containerName: string) => {
  try {
    await $`sudo docker top ${containerName}`;
    return true;
  } catch (error) {
    return false;
  }
};

const containerExists = async (containerName: string) => {
  try {
    await $`sudo docker ps -a --filter name=${containerName}`;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const buildPostgresContainer = async () => {
  await $`sudo docker run --name ${DB_DOCKER_IMAGE_NAME} -p ${DB_PORT}:${DB_PORT} -e POSTGRES_PASSWORD=${DB_PASSWORD} -d postgres`;
};

export const startDockerContainers = async () => {
  if (!(await containerIsRunning(DB_DOCKER_IMAGE_NAME))) {
    if (!(await containerExists(DB_DOCKER_IMAGE_NAME))) {
      await buildPostgresContainer();
    }
    await $`sudo docker start /${DB_DOCKER_IMAGE_NAME}`;
  }
};
