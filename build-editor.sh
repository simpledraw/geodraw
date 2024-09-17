#!/bin/bash
## build and copy the excalidraw lib into editor project

usage() {
[[ -n $1 ]] && log "$1" ERROR
cat << EOF
Usage:
    $(basename $0)
   -b build

export the geodraw lib to local workdir, editor or ios
EOF
exit 1
}

cwd=$(dirname $0 && pwd)
pub=0

while getopts "p" option; do
    case ${option} in
        p) pub="1";;
        *) usage;;
    esac
done

cd ${cwd}

function build()
{
pushd .
cd src/packages/excalidraw/
rm -fr package/*1
rm -fr  dist/*
yarn build:umd
popd
}

function publish()
{
pushd .
cd src/packages/excalidraw/
yarn publish
popd
}

function copy_asset_geoeditor()
{
echo "cp dist to geo editor js folder ..."
target="../geoeditor/public/js/"
rm -fr ${target}
mkdir -p ${target}
cp -r src/packages/excalidraw/dist/* ${target}
}

function copy_node_module_geoeditor()
{
echo "cp dist to geo editor node_modules folder ..."
target="../geoeditor/node_modules/@simpledraw/geodraw/dist"
rm -fr ${target}
mkdir -p ${target}
cp -r src/packages/excalidraw/dist/* ${target}
}

echo "start build..."
build

if [ "${pub}" == "1" ];
then
echo "start publish..."
publish
else
echo "no publish, just copy to geoeditor node_modules"
copy_node_module_geoeditor
fi

copy_asset_geoeditor
echo "done"