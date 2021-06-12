#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")
echo "$basedir"
echo "$@"
  node  "$basedir/src/bin/cli.js" "$@" "-b $basedir"

$SHELL
