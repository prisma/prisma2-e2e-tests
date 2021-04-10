#!/bin/bash

set -e

rm -rf functions-build
mkdir -p functions-build
cp -R ./prisma ./functions/prisma

UNAME=$(uname)
case "${UNAME}" in
  Linux*)
    cd functions/
    zip -r index.zip *
    du -b ./index.zip
    mv index.zip ../functions-build/index.zip
    cd ..
    ;;
  Darwin*)
    cd functions/
    zip -r index.zip *
    du ./index.zip
    mv index.zip ../functions-build/index.zip
    cd ..
    ;;
  MINGW*)
    powershell.exe -nologo -noprofile -command "& { param([String]\$sourceDirectoryName, [String]\$destinationArchiveFileName, [Boolean]\$includeBaseDirectory); Add-Type -A 'System.IO.Compression.FileSystem'; Add-Type -A 'System.Text.Encoding'; [IO.Compression.ZipFile]::CreateFromDirectory(\$sourceDirectoryName, \$destinationArchiveFileName, [IO.Compression.CompressionLevel]::Fastest, \$includeBaseDirectory, [System.Text.Encoding]::UTF8); exit !\$?;}" -sourceDirectoryName "functions" -destinationArchiveFileName "index.zip" -includeBaseDirectory \$false
    du -b ./index.zip
    mv index.zip functions-build/index.zip
    ;;
  *)
    printf 'unknown\n'
    ;;
esac

yarn netlify deploy --dir=. --prod --functions=functions-build
rm -rf functions/prisma
