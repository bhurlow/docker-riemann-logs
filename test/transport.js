
var test = require('tape')
var url = require('url')

// tests assumes you have a riemann server 
// running in the default docker-machine box
const host = url.parse(process.env.DOCKER_HOST).hostname
const port = 5555

var event = {
  log: '5c2d27efa07f horse might location memory tune shape join loose\n',
  stream: 'stdout',
  time: '2016-03-01T00:59:18.708917846Z',
  name: '/lonely_shaw',
  id: '5c2d27efa07f71783d9f02e59f8a36472d79c9a8d4eb794a8747088222ee284e'
}
