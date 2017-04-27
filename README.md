# travis-github-status 

<p align="center">
  <a href="https://www.npmjs.com/package/travis-github-status">
    <img src="https://img.shields.io/npm/v/travis-github-status.svg" alt="Version" />
  </a>

  <a href="https://travis-ci.org/faceyspacey/travis-github-status">
    <img src="https://travis-ci.org/faceyspacey/travis-github-status.svg?branch=master" alt="Build Status" />
  </a>

  <a href="https://lima.codeclimate.com/github/faceyspacey/travis-github-status/coverage">
    <img src="https://lima.codeclimate.com/github/faceyspacey/travis-github-status/badges/coverage.svg" alt="Coverage Status"/>
  </a>

  <a href="https://greenkeeper.io">
    <img src="https://badges.greenkeeper.io/faceyspacey/travis-github-status.svg" alt="Green Keeper" />
  </a>

  <a href="https://lima.codeclimate.com/github/faceyspacey/travis-github-status">
    <img src="https://lima.codeclimate.com/github/faceyspacey/travis-github-status/badges/gpa.svg" alt="GPA" />
  </a>

  <a href="https://www.npmjs.com/package/travis-github-status">
    <img src="https://img.shields.io/npm/dt/travis-github-status.svg" alt="Downloads" />
  </a>
  
  <a href="https://snyk.io/test/github/faceyspacey/travis-github-status">
    <img src="https://snyk.io/test/github/faceyspacey/travis-github-status/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/faceyspacey/travis-github-status">
  </a>

  <a href="https://www.npmjs.com/package/travis-github-status">
    <img src="https://img.shields.io/npm/l/travis-github-status.svg" alt="License" />
  </a>
</p>


Use this as your primary means of running tests, linting and flow type checking
in your `.travis.yml` file. If any tools have errors, they will properly insure an exit code of `1` is used.

But more importantly, they will provide 3 additional numeric reports to your pushes and pull requests, indicating
the # of errors or tests passed of each service right there within github. That's its purpose :).

*note: all 3 tools will get a chance to run even if an earlier one fails--that way you have as much information as available
within github.*

***NEW: codeclimate + snyk have been added, just make sure you add the tokens as `env` variables to Travis***

## Installation
```yarn add --dev travis-github-status```

Grab a personal access token with `public_repo` scope from https://github.com/settings/tokens and set it as
the `GH_TOKEN` *env* variable in the ***settings*** page of your Travis repo. If you are using [semantic-release](https://github.com/semantic-release/semantic-release),
the `semantic-release-cli` will in fact create the token for you, and add it to your repo on Travis! We highly recommend using that:

```
npm install -g semantic-release-cli

cd your-module
semantic-release-cli setup
```

## Usage
```yml
language: node_js

node_js:
  - stable

cache: yarn

script:
  - node_modules/.bin/travis-github-status lint flow jest snyk codeclimate #omit tools you don't want statuses for
```


## Contributing
Feel free to add more services such as Typescript, other test runners, etc. And better error checking, e.g.
that all the `env` tokens are available.

### Tests
Yea, it's pretty much self-testing. It runs itself in the ci server (Travis), and if it can't run itself, it's failing,
but feel free to add some offitial unit tests and perhaps breakup the individual functions into individual files.
