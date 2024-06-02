#!/bin/bash

. ../.env

sudo docker run --name $DB_DOCKER_IMAGE_NAME -p $DB_PORT:$DB_PORT -e POSTGRES_PASSWORD=$DB_PASSWORD -d postgres
