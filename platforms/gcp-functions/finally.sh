#!/bin/sh

set -eu

sleep 30

func="$(cat func-tmp.txt)"

UNAME=$(uname)
case "${UNAME}" in
  Darwin*)
    source "$(brew --prefix)/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/path.bash.inc"
    source "$(brew --prefix)/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/completion.bash.inc"
    ;;
esac

gcloud functions logs read "$func"
gcloud functions delete "$func" --quiet
