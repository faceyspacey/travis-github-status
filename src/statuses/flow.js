const spawn = require('child_process').spawnSync
const { setStatus } = require('../utils')

export default status => {
  const { stdout } = spawn('node_modules/.bin/flow', ['check'], {
    encoding: 'utf8',
  })
  const lines = stdout.split('\n')
  const lastLine = lines[lines.length - 2]
  const errorCount = parseInt(lastLine.replace('Found ', ''))

  const description = `errors: ${errorCount}`
  const success = errorCount === 0
  setStatus(status, 'Flow Report', description, success)

  // colored logging
  let log = stdout.replace(/\^(\^+)/g, '^$1'.red) // insure we omit single carets
  log = log.indexOf('Found 0 errors') === 0 ? log.blue : log
  console.log(`${'FLOW:'.blue} ${log}`)
}
