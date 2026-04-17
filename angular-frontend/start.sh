#!/bin/bash
set -euo pipefail

git config --global --add safe.directory /workspace

echo "Starting Angular Development Server"
npm run start
