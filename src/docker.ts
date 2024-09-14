import { execa } from "execa";

const DB_DOCKER_IMAGE_NAME = process.env.DB_DOCKER_IMAGE_NAME;
const DB_PORT = process.env.DB_PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;
const SMTP4DEV_PORT = process.env.SMTP4DEV_PORT;
const SMTP4DEV_NAME = process.env.SMTP4DEV_NAME;

const $ = execa({ verbose: "short" });

if (
  !DB_DOCKER_IMAGE_NAME ||
  !DB_PORT ||
  !DB_PASSWORD ||
  !SMTP4DEV_PORT ||
  !SMTP4DEV_NAME
) {
  throw new Error(
    "Must have a DB_DOCKER_IMAGE_NAME, DB_PORT, DB_PASSWORD, SMTP4DEV_PORT, and SMTP4DEV_NAME in the '.env' file.",
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
  // Start postgres
  if (!(await containerIsRunning(DB_DOCKER_IMAGE_NAME))) {
    if (!(await containerExists(DB_DOCKER_IMAGE_NAME))) {
      await buildPostgresContainer();
    }
    await $`sudo docker start /${DB_DOCKER_IMAGE_NAME}`;
  }

  // Start smtp4dev
  if (!(await containerIsRunning(SMTP4DEV_NAME)))
    await $`sudo docker run -d --name ${SMTP4DEV_NAME} -p ${SMTP4DEV_PORT}:${SMTP4DEV_PORT} -p 2525:25 rnwood/smtp4dev`;

  console.log(`SMTP4Dev ready at http://localhost:${SMTP4DEV_PORT}`);
};
