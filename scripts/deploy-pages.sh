#!/usr/bin/env bash
# Build the static site and publish it to the gh-pages branch (GitHub Pages → "Deploy from a branch").
# Usage: npm run deploy
set -euo pipefail
cd "$(dirname "$0")/.."
REPO_URL="$(git remote get-url origin)"
REPO_NAME="$(basename -s .git "$REPO_URL")"

rm -rf out
GITHUB_PAGES=true PAGES_BASE_PATH="/$REPO_NAME" npm run build
touch out/.nojekyll

cd out
git init -q
git checkout -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" commit -qm "Deploy $(git -C .. rev-parse --short HEAD)"
git push -f -q "$REPO_URL" gh-pages
cd ..
rm -rf out/.git
echo "Published: https://$(echo "$REPO_URL" | sed -E 's#https://github.com/([^/]+)/.*#\1#').github.io/$REPO_NAME/"
