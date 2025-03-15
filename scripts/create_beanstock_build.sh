#!/bin/bash

npm run build

zip -r "../$(git rev-parse HEAD).zip" .git * -x "node_modules/*" ".env"
