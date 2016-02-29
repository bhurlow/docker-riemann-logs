# scepter

send all stderr on a docker host to your inbox or slack channel.

<img src="/test/scepter.jpg" align="center" height="210px"/>

### usage

email:

```
docker run \
  -it \
  --rm \
  --name scepter \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /mnt:/mnt \
  -e MAILGUN_API_KEY="$MAILGUN_API_KEY" \
  -e MAILGUN_DOMAIN="$MAILGUN_DOMAIN" \
  -e MAIL_TO=brian@brianhurlow.com \
  bhurlow/scepter
```

for slack:

```
docker run \
  -it \
  --rm \
  --name scepter \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /mnt:/mnt \
  -e SLACK_TOKEN=$SLACK_TOKEN \
  bhurlow/scepter
```

### tests

```
eval (docker-machine env default)
npm test
```
