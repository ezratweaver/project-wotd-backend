#!/bin/bash

npm run build

zip -r "../$(git rev-parse HEAD).zip" .git .ebextensions .platform * -x "node_modules/*" ".env"
