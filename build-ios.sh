#!/bin/bash
## build and copy the site into ios
target="../geoapp/ios/build"
npm run build:ios

function build_status()
{
status='./build/status.json'
COMMIT_ID=$(git rev-parse --verify HEAD)
branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
echo "{" > ${status}
echo "\"branch\":\"${branch}\"," >> ${status}
echo "\"commit\":\"${COMMIT_ID}\"" >> ${status}
echo "}" >> ${status}
}

echo ">>>>>>> start to build ${status} file"
build_status
echo "${status} file built done, result as:"
cat ${status}

rm -fr $target/*
cp -r build/* $target