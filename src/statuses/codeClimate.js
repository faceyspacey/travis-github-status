const exec = require('child_process').execSync

export default ({ CODECLIMATE_REPO_TOKEN }) => {
  if (!CODECLIMATE_REPO_TOKEN) {
    return console.log(
      'Code Climate Coverage: '.blue,
      'WARNING: please provide the CODECLIMATE_REPO_TOKEN environment variable in Travis'
        .orange,
    )
  }

  try {
    exec(
      'cat coverage/lcov.info | node_modules/codeclimate-test-reporter/bin/codeclimate.js',
    )

    // colored logging
    console.log('Code Climate Coverage: '.blue, 'success!'.green)
  }
  catch (error) {
    console.log(
      'WARNING: coverage failed to report to Code Climate (probably because you have no tests which import source code)'
        .orange,
      error,
    )
  }
}
