'use strict'

var test = require('tape')
var Docker = require('dockerode')
var fs = require('fs')
var url = require('url')

const machinePath = process.env.DOCKER_CERT_PATH + '/'
const host = url.parse(process.env.DOCKER_HOST).hostname
const port = url.parse(process.env.DOCKER_HOST).port

var docker = new Docker({
  host: host,
  port: port,
  ca: fs.readFileSync(machinePath + 'ca.pem'),
  cert: fs.readFileSync(machinePath + 'cert.pem'),
  key: fs.readFileSync(machinePath + 'key.pem')
});

docker.getEvents(function(err, stream) {
  stream.on('data', function(chunk) {
    let event = JSON.parse(chunk.toString())
    console.log(event.id, event.status)
  })
})

// const cmd = 'bash -c while true; do  echo \"YO\"; sleep 1; done'
// const cmd = '/bin/bash -c "echo yooooooo"'
const cmd = 'while true; do echo `date` >&2; sleep 1; done'

docker.createContainer({Image: 'ubuntu', Cmd: ["/bin/bash", "-c", cmd], name: 'yolo'}, function (err, container) {
  if (err) throw err;

  container.start(function(err, data) {
    console.log(data)

    container.attach({stream: true, stdout: false, stderr: true}, function (err, stream) {
      stream.on('data', function(chunk) {
        console.log(chunk.toString())
      })
    });

  })

});


// test('timing test', function (t) {
//     t.plan(2);
//     t.equal(typeof Date.now, 'function');
//     var start = Date.now();
//     setTimeout(function () {
//         t.equal(Date.now() - start, 100);
//     }, 100);
// });
