#!/bin/bash
yarn build
cd src/packages/excalidraw
yarn pack
yarn publish

./build-editor.sh