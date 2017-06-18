require('colors')
const spawn = require('child_process').spawnSync
const { setStatus } = require('../utils')

export default (status, { SNYK_TOKEN }) => {
  if (!SNYK_TOKEN) {
    return console.log(
      'Snyk Vulberabilities: '.blue,
      'WARNING: please provide the SNYK_TOKEN environment variable in Travis'
        .orange,
    )
  }

  const ret = spawn('node', ['node_modules/snyk/cli/index.js', 'test'])
  const success = parseInt(ret.status) === 0
  const description = success ? 'none' : 'RED ALERT!'

  setStatus(status, 'Snyk Vulnerabilities', description, success)

  if (!success) {
    console.log(ret.output.toString())
  }
}
