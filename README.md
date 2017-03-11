# travis-github-status
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
  - travis-script lint flow jest #omit tools you dont want statuses for
```

## Contributing
Feel free to add more services such as Typescript, other test runners, etc. One thing it needs to do
is properly re-colorize things like the checkmarks and Xes in tests so they are easily readable from the Travis
console. [npm install colors](https://www.npmjs.com/package/colors) should do the trick in combination with `str.replace('checkmark', 'colored-chekmark')`.
Something close to that will end up being it.
