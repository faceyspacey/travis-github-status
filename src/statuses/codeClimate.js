require('colors')
const exec = require('child_process').execSync

export default ({ CODECLIMATE_REPO_TOKEN }) => {
  if (!CODECLIMATE_REPO_TOKEN) {
    return console.log(
      'Code Climate Coverage: '.blue,
      'FAIL: please provide the CODECLIMATE_REPO_TOKEN environment variable in Travis'
        .red,
    )
  }

  exec(
    'cat coverage/lcov.info | node_modules/codeclimate-test-reporter/bin/codeclimate.js',
  )

  // colored logging
  console.log('Code Climate Coverage: '.blue, 'success!'.green)
}
