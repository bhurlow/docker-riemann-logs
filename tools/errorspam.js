
var x = 100

function tick() {
  x--
  if (x) {
    if (x % 5) {
      console.log('ok')
    }
    else {
      process.stderr.write(Date.now() + ' error text \n')
    }
  }
}

setInterval(tick, 500)
