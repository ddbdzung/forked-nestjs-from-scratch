#!/bin/bash

cd ..
read -p "Enter the name of the project: " project_name

if [ -d "$project_name" ]; then
    echo "[LOG]: Project already exists"
    exit 1
fi

mkdir $project_name
cd $project_name
# Check if git is installed
if ! [ -x "$(command -v git)" ]; then
    echo "[LOG]: Git is not installed. Please install git and try again"
    exit 1
fi
git init
cd ..
cd core
cp -r src ../$project_name/
cp -r scripts ../$project_name/
cp -r .husky ../$project_name/
cp -r .gitignore ../$project_name/
cp -r .env.example ../$project_name/
cp -r .prettierrc ../$project_name/
cp -r .prettierignore ../$project_name/
cp -r .swcrc ../$project_name/
cp -r eslint.config.js ../$project_name/
cp -r tsconfig.json ../$project_name/
cp -r pnpm-lock.yaml ../$project_name/
cp -r package.json ../$project_name/
cd ..
cd $project_name
echo "[LOG]: Softlinking core files"
bash ./scripts/softlink.sh
echo "[LOG]: Softlinking complete"
git add .
git commit -m ":tada: Initial commit"
echo "[LOG]: Project initialized successfully"

exit 0
