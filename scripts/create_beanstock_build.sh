#!/bin/bash

npm run build

zip -r "../$(git rev-parse HEAD).zip" * -x "node_modules/*" ".env"
