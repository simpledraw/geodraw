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

while getopts "b" option; do
    case ${option} in
        b) build="1";;
        *) usage;;
    esac
done

function build()
{
pushd
cd src/packages/excalidraw
yarn pack
popd
}

cd ${cwd}

if [ "${build}" == "1" ];
then
build
fi

function copy_geoeditor()
{
target="../geoeditor/public/js/"
rm -fr ${target}
mkdir -p ${target}
cp -r src/packages/excalidraw/dist/* ${target}
}

copy_geoeditor
echo "done"