# syntax=docker/dockerfile:1
# check=error=true

ARG RUBY_VERSION=3.3.1
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

WORKDIR /rails

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libjemalloc2 libvips default-libmysqlclient-dev && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development test" \
    BUNDLE_JOBS="4" \
    BUNDLE_RETRY="3"

FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git pkg-config default-libmysqlclient-dev && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

COPY Gemfile Gemfile.lock ./

RUN bundle install

COPY . .

RUN bundle exec bootsnap precompile app/ lib/

# Precompiling assets for production without requiring secret RAILS_MASTER_KEY
RUN echo "=== STEP 4: assets:precompile ===" && \
    DB_USERNAME=dummy \
    DB_PASSWORD=dummy \
    DB_HOST=localhost \
    DB_NAME=dummy \
    SECRET_KEY_BASE_DUMMY=1 \
    ./bin/rails assets:precompile


FROM base


COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --from=build /rails /rails

RUN groupadd -g 1000 rails && \
    useradd rails -u 1000 -g 1000 -m && \
    chown -R rails:rails /rails

USER rails:rails

ENV PORT=3000
EXPOSE 3000

# 本番環境用の Rails サーバーを全てのインターフェース (0.0.0.0) でポート3000番に起動
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

CMD ["./bin/rails", "server", "-b", "0.0.0.0", "-p", "3000"]
