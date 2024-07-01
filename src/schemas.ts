import { readdirSync } from "fs";
import { resolve } from "path";
import { SignUpRequestBody } from "./schemas/SignUpRequestBody";
import { GenericResponse } from "./schemas/GenericResponse";

const schemasDir = resolve(__dirname, "schemas");

const schemas = {
  SignUpRequestBody,
  GenericResponse,
};

if (readdirSync(schemasDir).length > Object.values(schemas).length) {
  throw new Error(
    "More schemas in src/schemas then imported into schemas file, did you forgot to import a schema?",
  );
}

export default schemas;
