#!/bin/bash

npm run build

zip -r "../$(git rev-parse HEAD).zip" * -x ".git/*" "node_modules/*" ".env"
