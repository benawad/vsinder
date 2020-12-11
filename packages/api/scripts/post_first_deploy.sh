#!/bin/bash
set -e

export $(cat ./.env | xargs)

dokku config:set --no-restart api DOKKU_LETSENCRYPT_EMAIL=$EMAIL
dokku config:set --no-restart api $(cat .env.app)
dokku postgres:link pg1 api
dokku redis:link redis1 api
dokku tags:deploy api latest

sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
dokku domains:clear api
dokku domains:clear-global
dokku domains:add-global vsinder.com
dokku letsencrypt api