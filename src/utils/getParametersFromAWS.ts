import { SSM } from "@aws-sdk/client-ssm";

const ssmClient = new SSM({
  apiVersion: "2014-11-06",
  region: process.env.AWS_REGION,
});

const environmentPath = "/project-wotd-backend/prod";

const getParametersFromAWS = async () => {
  const parameters = await ssmClient.getParametersByPath({
    Path: environmentPath,
    Recursive: true,
    WithDecryption: true,
  });

  if (!parameters.Parameters || parameters.Parameters.length === 0) {
    console.warn(
      "No parameters were returned. Is parameter store setup correctly?",
    );
    return;
  }

  for (const parameter of parameters.Parameters) {
    if (!parameter.Name || !!parameter.Value) {
      console.warn(
        "Parameter retrieved did not have a defined Name or Value. Is parameter store setup correctly",
      );
      console.warn({
        Name: parameter.Name,
        Value: parameter.Value,
      });
      continue;
    }

    process.env[parameter.Name.replace(environmentPath + "/", "")] =
      parameter.Value;
  }
};

export default getParametersFromAWS;
