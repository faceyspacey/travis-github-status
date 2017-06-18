const fetch = require('node-fetch')

export const shouldSet = tool => process.argv.indexOf(tool) > -1

export const getStatus = ({
  RUN_KIT_URL,
  TRAVIS_EVENT_TYPE,
  TRAVIS_REPO_SLUG,
  TRAVIS_JOB_ID,
}) => {
  const sha = getCommitSha(TRAVIS_EVENT_TYPE)
  const repoSlug = TRAVIS_REPO_SLUG
  const target_url = `https://travis-ci.org/${repoSlug}/jobs/${TRAVIS_JOB_ID}`
  const parsedSlug = repoSlug.split('/')
  const owner = parsedSlug[0]
  const repo = parsedSlug[1]

  return {
    sha,
    target_url,
    owner,
    repo,
    RUN_KIT_URL,
  }
}

const getCommitSha = eventType => {
  if (eventType === 'push') {
    return process.env.TRAVIS_COMMIT
  }
  else if (eventType === 'pull_request') {
    const travisCommitRange = process.env.TRAVIS_COMMIT_RANGE
    const parsed = travisCommitRange.split('...')

    return parsed.length === 1 ? travisCommitRange : parsed[1]
  }

  console.error("event type '%s' not supported", eventType)
  return null
}

export const setStatus = (status, context, description, success) => {
  const defaultUrl =
    'https://github-status-reporter-4-travis-w97e064wfjok.runkit.sh/'
  const runKitUrl = status.RUN_KIT_URL || defaultUrl
  delete status.RUN_KIT_URL

  const params = {
    ...status,
    context,
    description,
    state: success ? 'success' : 'failure',
  }

  fetch(runKitUrl, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(params),
  }).then(response => {
    const err = response.success
    const message = response.message
    // colored logging
    context = `${context}:`.blue
    description = description[success ? 'green' : 'red']

    const log = `${context} ${description}`
    console.log(log)

    if (err) {
      console.error(`${context}: Error creating status`, message)
    }
  })

  if (!success) {
    process.exitCode = 1
  }
}
