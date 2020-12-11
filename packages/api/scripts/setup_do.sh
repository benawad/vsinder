#!/bin/bash
set -e

export $(cat ./.env | xargs)

# user
useradd ben --create-home --password "$(openssl passwd -1 "$USER_PASSWORD")" --shell /bin/bash --uid 5012 --user-group
usermod -aG sudo ben
cp -R .ssh /home/ben
chown -R ben /home/ben/.ssh

# docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ben

# dokku
wget https://raw.githubusercontent.com/dokku/dokku/v0.21.4/bootstrap.sh;
sudo DOKKU_TAG=v0.21.4 bash bootstrap.sh
echo vsinder.com > /home/dokku/VHOST

echo 'ben ALL=(ALL:ALL) NOPASSWD:SETENV: /usr/bin/dokku' | sudo EDITOR='tee -a' visudo

# pg
sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres
dokku postgres:create pg1
dokku postgres:backup-auth pg1 $AWS_ACCESS_KEY_ID $AWS_SECRET_ACCESS_KEY
dokku postgres:backup-schedule pg1 "0 3 * * *" $S3_BUCKET_NAME

# redis
sudo dokku plugin:install https://github.com/dokku/dokku-redis.git redis
dokku redis:create redis1

# app
dokku apps:create api