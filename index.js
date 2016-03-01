'use strict'

const assert = require('assert');
const fs = require('fs')
const es = require('event-stream')
const Docker = require('dockerode')
const url = require('url')
const _ = require('lodash')
const spawn = require('child_process').spawn
const debug = require('debug')
const info = debug('gazette:info')
const riemann = require('riemann')


var client;

// need for cleanup purposes
var streams = []

function ignoreList() {
  let ignore = process.env.IGNORE_LOGS_FROM
  if (ignore) {
    return ignore.split(',')
  }
  else return []
}

function tail(path) {
  let s = spawn('tail',['-n', '10', '-f', path]);
  s.stderr.on('data', (chunk) => console.log(chunk.toString()))
  return s.stdout
}

function sendToRiemann(event) {
  let riemannEvent = client.Event({
    description: event.log,
    host: event.id,
    state: 'log',
    service: event.name, 
    tags: [event.stream],
    time: event.time
  })
  client.send(riemannEvent, client.tcp)
}

function handleLogFile(id, name, logpath) {
  info('streaming logs for', name)
  let stream = tail(logpath)
    .pipe(es.split())
    .pipe(es.parse())
    .pipe(es.map((x, cb) => {
      x.name = name
      x.id = id
      cb(null, x)
    }))
    streams.push(stream)
    stream.on('data', sendToRiemann)
}

// avoid an infinite logging loop
function filterContainers(containers) {
  let ignore = ignoreList()
  console.log("I AM GOING TO IGNORE", ignore)
  return containers
    .filter(x => x.Image != 'bhurlow/gazette')
    .filter(x => !_.includes(ignore, x.Image))
}

function streamLogs(docker) {
  docker.listContainers(function(err, res) {
    if (err) throw err;
    filterContainers(res).forEach((info) => {
      console.log(info)
      let container = docker.getContainer(info.Id)
      container.inspect(function(err, data) {
        if (err) throw err;
        let name = info.Names.join('')
        let logpath = data.LogPath
        let id = data.Id
        handleLogFile(id, name, logpath)
      })
    })
  })
}

function cleanup(docker) {
  info('cleaning streams....')
  streams.map(x => x.destroy())
  info('streams all closed')
  streams = []
  info('resetting stream targets')
  streamLogs(docker)
}

function handleNewContainer(docker, id) {
  info('new container detected', id)
  cleanup(docker)
}

function handleContainerDie(docker, id) {
  info('container die event detected', id)
  cleanup(docker)
}

function watchDockerEvents(docker) {
  docker.getEvents(function(err, stream) {
    stream.on('data', function(chunk) {
      let event = JSON.parse(chunk.toString())
      let type = event.Type
      let status = event.status
      let id = event.Actor.ID
      if (!id) return console.log('no id in event')
      switch (status) {
        case 'die':
          handleContainerDie(docker, id)
          break;
        case 'start':
          handleNewContainer(docker, id)
          break;
      }
    })
  })
}

// maybe provide defaults?
function ensureVars() {
  let host = process.env.RIEMANN_HOST
  let port = process.env.RIEMANN_PORT
  if (!host || !port) {
    throw new Error('Must Specify RIEMANN_HOST RIEMANN_PORT')
  }
}

function init() {
  info('Hi! getting started')
  ensureVars()

  client = riemann.createClient({
    host: 'riemann',
    port: 5555
  })

  client.on('connect', function() {
    info('connected to riemann')
  })

  client.on('data', function(ack) {
    if (!ack.ok) {
      console.error(ack)
      throw new Error('Backpressure detected, aborting')
    }
  })

  info('connecting to docker...')
  let docker = new Docker({socketPath: '/var/run/docker.sock'})

  info('starting log stream')
  streamLogs(docker)
  watchDockerEvents(docker)
}

init()


