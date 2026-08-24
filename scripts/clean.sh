#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

paths=(
	".secrets.json"
	"tmp"
	".coverage"
	".nyc_output"
	"lib"
	"dist"
	"docs/.docusaurus"
	"docs/api"
	"docs/build"
	"docs/docs/api"
)

for path in "${paths[@]}"; do
	rm -rf "$path"
done

find packages tools \
	-type d -name node_modules -prune -o \
	-type d \( -name coverage -o -name lib -o -name dist \) -prune -exec rm -rf {} +
find . -name '*.tsbuildinfo' -type f -delete
