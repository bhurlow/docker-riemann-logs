#! /bin/bash

docker build -t bhurlow/gazette .

docker run \
  -it \
  --rm \
  --name scepter \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /mnt:/mnt \
  --link riemann:riemann \
  -e IGNORE_LOGS_FROM=bhurlow/riemann,another/image \
  -e RIEMANN_HOST=riemann \
  -e RIEMANN_PORT=5555 \
  bhurlow/gazette
