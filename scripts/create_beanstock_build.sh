#!/bin/bash
set -xe

npm run build

COMMIT_HASH=$(git rev-parse HEAD)
PATH_TO_STATIC_HASH_FUNCTION="./dist/utils/getHashStatic.js"

cat >"$PATH_TO_STATIC_HASH_FUNCTION" <<EOF
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getHashStatic = () => "$COMMIT_HASH";
exports.default = getHashStatic;
EOF

zip -r "../$COMMIT_HASH.zip" * -x "node_modules/*" ".env"
