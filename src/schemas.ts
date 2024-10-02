import { readdirSync } from "fs";
import { resolve } from "path";
import { SignUpRequestBody } from "./schemas/SignUpRequestBody";
import { GenericResponse } from "./schemas/GenericResponse";
import { LoginRequestBody } from "./schemas/LoginRequestBody";
import { FetchWOTDResponse } from "./schemas/FetchWOTDResponse";
import { FetchWOTDRequestParams } from "./schemas/FetchWOTDRequestParams";
import { LearnWOTDRequestBody } from "./schemas/LearnWOTDRequestBody";
import { ConfirmEmailTokenRequestBody } from "./schemas/ConfirmEmailTokenRequestBody";
import { ResendEmailTokenRequestBody } from "./schemas/ResendEmailTokenRequestBody";
import { FetchReviewDashboardResponse } from "./schemas/FetchReviewDashboardResponse";
import { FetchWordsToReviewResponse } from "./schemas/FetchWordsToReviewResponse";

const schemasDir = resolve(__dirname, "schemas");

const schemas = {
  SignUpRequestBody,
  GenericResponse,
  LoginRequestBody,
  FetchWOTDResponse,
  FetchWOTDRequestParams,
  LearnWOTDRequestBody,
  ConfirmEmailTokenRequestBody,
  ResendEmailTokenRequestBody,
  FetchAllLearnedWOTDResponse: FetchReviewDashboardResponse,
  FetchWordsToReviewResponse,
};

if (readdirSync(schemasDir).length !== Object.values(schemas).length) {
  throw new Error(
    "Schemas imported do not match schemas in src/schemas directory, did you forgot to import a schema?",
  );
}

export default schemas;
