#!/bin/bash

set -e

source .env

npx expo build:ios --non-interactive

curl -o app.ipa $(expo url:ipa --non-interactive)

fastlane deliver --verbose --ipa "app.ipa" --skip_screenshots --skip_metadata -u $APPLE_EMAIL