#! /bin/bash

docker build -t bhurlow/scepter .

docker run \
  -it \
  --rm \
  --name scepter \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /mnt:/mnt \
  -e SLACK_TOKEN=$SLACK_TOKEN \
  bhurlow/scepter


# docker run \
#   -it \
#   --rm \
#   --name scepter \
#   -v /var/run/docker.sock:/var/run/docker.sock \
#   -v /mnt:/mnt \
#   -e MAILGUN_API_KEY="$MAILGUN_API_KEY" \
#   -e MAILGUN_DOMAIN="$MAILGUN_DOMAIN" \
#   -e MAIL_TO=brian@brianhurlow.com \
#   bhurlow/scepter

