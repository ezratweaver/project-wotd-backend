#!/bin/bash

npm run build

zip -r ../project-wotd-backend.zip * -x ".git/*" "node_modules/*" ".env"
