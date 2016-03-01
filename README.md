

### Tests

```
eval (docker-machine env default)

# need a riemann to point to
docker run -d \
  -p 5555:5555 \
  bhurlow/riemann
```
