#!/bin/bash
set -xe

EB_APP_STAGING_DIR=$(/opt/elasticbeanstalk/bin/get-config container -k app_staging_dir)
cd "$EB_APP_STAGING_DIR"

yarn install --production
