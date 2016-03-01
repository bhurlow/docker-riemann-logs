

### Tests

```
eval (docker-machine env default)

# need a riemann to point to
docker run -d \
  --name riemann \
  -p 5555:5555 \
  bhurlow/riemann
```
