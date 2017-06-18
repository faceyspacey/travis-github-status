require('colors')
const spawn = require('child_process').spawnSync

const { setStatus } = require('../utils')

export default status => {
  const { stderr } = spawn('node_modules/.bin/jest', ['--coverage'], {
    encoding: 'utf8',
  })

  const noTests = /Your test suite must contain at least one test/.test(stderr)

  if (noTests) {
    setStatus(status, 'Jest Tests', 'Pass: No Tests Yet', true)
    return console.log('JEST: No Tests Yet (Pass)'.blue)
  }

  const regex = /Tests:.+ (\d+) passed, (\d+) total/
  const [passedCount, testCount] = regex
    .exec(stderr)
    .slice(1, 3)
    .map(num => parseInt(num))

  const description = `${passedCount} passed, ${testCount} total`
  const success = passedCount === testCount
  setStatus(status, 'Jest Tests', description, success)

  // colored logging
  const log = stderr
    .replace(/✓/g, '✓'.green)
    .replace(/✕/g, '✕'.red)
    .replace('Ran all test suites.', 'JEST: Ran all test suites.'.blue)
  console.log(log)
}
