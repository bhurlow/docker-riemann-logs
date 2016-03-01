#! /bin/bash

docker run -d \
  -p 5555:5555 \
  bhurlow/riemann

docker build -t bhurlow/gazette .

docker run \
  -it \
  --rm \
  --name scepter \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /mnt:/mnt \
  -e RIEMANN_HOST=riemann \
  -e RIEMANN_PORT=5555 \
  bhurlow/gazette
