#!/bin/bash

# Check if AWS CLI is installed
if ! command -v aws &>/dev/null; then
	echo "Error: AWS CLI is not installed. Please install the AWS CLI to proceed."
	exit 1
fi

# Define the path in the parameter store
environmentPath="/project-wotd-backend/prod"

# Fetch parameters from AWS SSM Parameter Store
parameters=$(aws ssm get-parameters-by-path \
	--path "$environmentPath" \
	--recursive \
	--with-decryption \
	--query "Parameters[*].[Name,Value]" \
	--output text)

# Check if parameters were returned
if [[ -z "$parameters" ]]; then
	echo "No parameters were returned. Is parameter store set up correctly?"
	exit 1
fi

# Process each parameter and set them as environment variables
while IFS=$'\t' read -r name value; do
	if [[ -z "$name" || -z "$value" ]]; then
		echo "Parameter retrieved did not have a defined Name or Value."
		echo "Name: $name, Value: $value"
		continue
	fi

	# Remove the environment path prefix from the parameter name and set it as an environment variable
	env_var_name=$(echo "$name" | sed "s|^$environmentPath/||")
	export "$env_var_name"="$value"
	echo "Set environment variable $env_var_name"
done <<<"$parameters"
