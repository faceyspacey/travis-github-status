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
in your `.travis.yml` file. If any tools have errors, they will properly insure an an exit code of `1` is used.

But more importantly, they will provide 3 additional numeric reports to your pushes and pull requests, indicating
the # of errors or tests passed of each service right there within github. That's its purpose :).

*note: all 3 tools will get a chance to run even if an earlier one fails--that way you have as much information as available
within github.*

## Installation
```yarn add --dev travis-github-status```

## Usage
```yml
language: node_js

node_js:
  - stable

cache: yarn

script:
  - node_modules/.bin/travis-script lint flow jest #omit tools you don't want statuses for
```
*new tools: `snyk`, `codeclimate`. Just list them, for example, after `jest` above. You will need to add their tokens to Travis*

## Contributing
Feel free to add more services such as Typescript, other test runners, etc. One thing it needs to do
is properly re-colorize things like the checkmarks and Xes in tests so they are easily readable from the Travis
console. [npm install colors](https://www.npmjs.com/package/colors) should do the trick in combination with `str.replace('checkmark', 'colored-chekmark')`.
Something close to that will end up being it.
