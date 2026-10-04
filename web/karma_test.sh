#!/bin/bash
export PATH="/opt/homebrew/bin:$PATH"
set -euo pipefail
./$1 --config $2 \
  --test-files 'plugins/image-diff/web/_bazel_ts_out_tests/**/*_test.js' \
  --ts-config="plugins/image-diff/web/tsconfig.json"
