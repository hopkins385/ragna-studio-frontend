#!/bin/bash
set -e

# Use the package.json in the current directory instead of trying to navigate up
VERSION=$(node -p "require('./package.json').version")
BUILD_DATE=$(date)

echo "Build Date: $BUILD_DATE" > ./dist/version.txt
echo "Version: $VERSION" >> ./dist/version.txt

echo "Generated version.txt:"
cat ./dist/version.txt