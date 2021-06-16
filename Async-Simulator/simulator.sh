#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

  node  "$basedir/src/bin/cli.js" "$@" "-b $basedir"

$SHELL
