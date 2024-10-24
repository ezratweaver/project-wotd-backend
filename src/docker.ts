import { execa } from "execa";

const DB_DOCKER_IMAGE_NAME = process.env.DB_DOCKER_IMAGE_NAME;
const DB_PORT = process.env.DB_PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;
const SMTP4DEV_WEB_PORT = process.env.SMTP4DEV_WEB_PORT;
const SMTP4DEV_SMTP_PORT = process.env.SMTP4DEV_SMTP_PORT;
const SMTP4DEV_NAME = process.env.SMTP4DEV_NAME;

const $ = execa({ verbose: "short" });

if (
  !DB_DOCKER_IMAGE_NAME ||
  !DB_PORT ||
  !DB_PASSWORD ||
  !SMTP4DEV_WEB_PORT ||
  !SMTP4DEV_NAME ||
  !SMTP4DEV_SMTP_PORT
) {
  throw new Error(
    "Must have a DB_DOCKER_IMAGE_NAME, DB_PORT, DB_PASSWORD, SMTP4DEV_WEB_PORT, SMTP4DEV_NAME, SMTP4DEV_SMTP_PORT in the '.env' file.",
  );
}

const containerIsRunning = async (containerName: string) => {
  try {
    await $`docker top ${containerName}`;
    return true;
  } catch (error) {
    return false;
  }
};

const containerExists = async (containerName: string) => {
  try {
    const response = await $`docker ps -a --filter name=${containerName}`;

    return response.stdout.includes(containerName);
  } catch (error) {
    console.log(error);
    return false;
  }
};

const startContainer = async (containerName: string) => {
  await $`docker start /${containerName}`;
};

const buildPostgresContainer = async () => {
  await $`docker run --name ${DB_DOCKER_IMAGE_NAME} -p ${DB_PORT}:${DB_PORT} -e POSTGRES_PASSWORD=${DB_PASSWORD} -d postgres`;
};

const buildSMTP4DevContainer = async () => {
  await $`docker run --name ${SMTP4DEV_NAME} -p ${SMTP4DEV_WEB_PORT}:80 -p ${SMTP4DEV_SMTP_PORT}:25 -d rnwood/smtp4dev`;
};

const startOrBuildContainer = async (
  containerName: string,
  buildCallback: () => Promise<void>,
) => {
  if (!(await containerIsRunning(containerName))) {
    if (!(await containerExists(containerName))) {
      await buildCallback();
    }
    await startContainer(containerName);
  }
};

export const startDockerContainers = async () => {
  // Start postgres
  await startOrBuildContainer(DB_DOCKER_IMAGE_NAME, buildPostgresContainer);

  // Start smtp4dev
  await startOrBuildContainer(SMTP4DEV_NAME, buildSMTP4DevContainer);

  console.log(`SMTP4Dev ready at http://localhost:${SMTP4DEV_WEB_PORT}`);
};
