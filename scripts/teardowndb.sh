#!/bin/bash

. ../.env

sudo docker rm -f $DB_DOCKER_IMAGE_NAME
