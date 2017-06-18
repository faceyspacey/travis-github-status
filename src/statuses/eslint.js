require('colors')
const exec = require('child_process').execSync
const { setStatus } = require('../utils')
const eslint = require('eslint')

const cli = new eslint.CLIEngine()

export default status => {
  const stdout = exec(
    `git diff --name-only ${process.env.TRAVIS_COMMIT_RANGE} -- '*.js'`,
    { encoding: 'utf8' },
  )
  const files = stdout // paths of *.js files that changed in the commit/PR
    .split('\n')
    .slice(0, -1) // Remove the extra "" caused by the last newline

  const { errorCount, warningCount, results } = cli.executeOnFiles(
    cli.resolveFileGlobPatterns(files),
  )

  const description = `errors: ${errorCount} warnings: ${warningCount}`
  const success = errorCount === 0
  setStatus(status, 'ESLint Report', description, success)

  // colored logging
  const format = cli.getFormatter()
  const log = format(results)
  console.log(`${'ESLINT:'.blue} ${log || 'all good'.blue}`)
}
