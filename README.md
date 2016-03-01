# Gazette

this is a mini docker application that streams json logs on a docker host to a [riemann](http://riemann.io/) server. This can replace a docker [logging driver](https://docs.docker.com/engine/admin/logging/overview/) and will still retain the `docker logs` functionality.

### Usage 
```
docker run \
  -d \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /mnt:/mnt \
  --link riemann:riemann \ # (or use --net)
  bhurlow/gazette
```

you may optional specify

`IGNORE_LOGS_FROM` (comma separated image names)

`RIEMANN_HOST`

`RIEMANN_PORT`


### Tests

```
eval (docker-machine env default)

# need a riemann to point to
docker run -d \
  --name riemann \
  -p 5555:5555 \
  bhurlow/riemann
```
