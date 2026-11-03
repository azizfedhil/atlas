#!/bin/sh
# macOS / Linux: ./launch-atlas.sh        (opens the atlas in its own app window; pass --browser for a normal tab)
cd "$(dirname "$0")" && exec node tools/serve.mjs "$@"
