#!/bin/bash
set -e

# Use the package.json in the current directory instead of trying to navigate up
VERSION=$(node -p "require('./package.json').version")
BUILD_DATE=$(date)
BUILD_TIMESTAMP=$(date +%s)

echo "{\"version\":\"$VERSION\",\"buildDate\":\"$BUILD_DATE\",\"timestamp\":$BUILD_TIMESTAMP}" > ./dist/version.json