#!/bin/bash

rm -rf src/core
if [ ! -d "src" ]; then
    echo "[LOG]: src directory not found"
    echo "[LOG]: attempting to create boilerplate src directory from core"
    cp -r ../core/src src
    echo "[LOG]: src directory created"
fi
cd src
ln -s ../../core/src/core core
cd ..

rm -rf .husky
ln -s ../core/.husky .husky

rm -rf scripts
ln -s ../core/scripts scripts

rm -rf node_modules
ln -s ../core/node_modules node_modules

rm -rf package.json
ln -s ../core/package.json package.json

rm -rf eslint.config.js
ln -s ../core/eslint.config.js eslint.config.js

rm -rf .prettierrc
ln -s ../core/.prettierrc .prettierrc

rm -rf .prettierignore
ln -s ../core/.prettierignore .prettierignore

rm -rf tsconfig.json
ln -s ../core/tsconfig.json tsconfig.json

rm -rf .swcrc
ln -s ../core/.swcrc .swcrc

rm -rf .env.example
ln -s ../core/.env.example .env.example

rm -rf pnpm-lock.yaml
ln -s ../core/pnpm-lock.yaml pnpm-lock.yaml

rm -rf .gitignore
ln -s ../core/.gitignore .gitignore
