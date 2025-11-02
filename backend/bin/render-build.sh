#!/usr/bin/env bash
set -o errexit

# Ruby
bundle install --without development test --path vendor/bundle --jobs 4 --retry 3

# Node (esbuild)
yarn install --frozen-lockfile || yarn install
yarn build

# Sprockets / Importmap 資産
bundle exec rails assets:precompile
