#!/usr/bin/env node
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Github = require('github');
var eslint = require('eslint');
var exec = require('child_process').execSync;
var spawn = require('child_process').spawnSync;

var cli = new eslint.CLIEngine();

var setStatuses = function setStatuses() {
  var gh = new Github();
  var status = authenticateWithGithub(gh, process.env);

  if (shouldSet('lint')) setLintStatus(gh, status);
  if (shouldSet('flow')) setFlowStatus(gh, status);
  if (shouldSet('jest')) setJestStatus(gh, status);
};

var shouldSet = function shouldSet(tool) {
  return process.argv.indexOf(tool) > -1;
};

var authenticateWithGithub = function authenticateWithGithub(gh, _ref) {
  var TRAVIS_EVENT_TYPE = _ref.TRAVIS_EVENT_TYPE,
      TRAVIS_REPO_SLUG = _ref.TRAVIS_REPO_SLUG,
      TRAVIS_JOB_ID = _ref.TRAVIS_JOB_ID,
      GITHUB_TOKEN = _ref.GITHUB_TOKEN;

  var sha = getCommitSha(TRAVIS_EVENT_TYPE);
  var repoSlug = TRAVIS_REPO_SLUG;
  var target_url = 'https://travis-ci.org/' + repoSlug + '/jobs/' + TRAVIS_JOB_ID;
  var parsedSlug = repoSlug.split('/');
  var owner = parsedSlug[0];
  var repo = parsedSlug[1];

  gh.authenticate({
    token: GITHUB_TOKEN,
    type: 'oauth'
  }, function (err) {
    if (err) console.error('Error authenticating GitHub', err);
  });

  return {
    sha: sha,
    target_url: target_url,
    owner: owner,
    repo: repo
  };
};

var getCommitSha = function getCommitSha(eventType) {
  if (eventType === 'push') {
    return process.env.TRAVIS_COMMIT;
  } else if (eventType === 'pull_request') {
    var travisCommitRange = process.env.TRAVIS_COMMIT_RANGE;
    var parsed = travisCommitRange.split('...');

    return parsed.length === 1 ? travisCommitRange : parsed[1];
  }

  console.error('event type \'%s\' not supported', eventType);
  return null;
};

var setLintStatus = function setLintStatus(gh, status) {
  var stdout = exec('git diff --name-only ' + process.env.TRAVIS_COMMIT_RANGE + ' -- \'*.js\'', { encoding: 'utf8' });
  var files = stdout // paths of *.js files that changed in the commit/PR
  .split('\n').slice(0, -1); // Remove the extra "" caused by the last newline

  var _cli$executeOnFiles = cli.executeOnFiles(cli.resolveFileGlobPatterns(files)),
      errorCount = _cli$executeOnFiles.errorCount,
      warningCount = _cli$executeOnFiles.warningCount,
      results = _cli$executeOnFiles.results;

  var description = 'errors: ' + errorCount + ' warnings: ' + warningCount;
  var success = errorCount === 0;
  setStatus(gh, status, 'ESLint Report', description, success);

  var format = cli.getFormatter();
  var log = format(results);
  console.log(log);
};

var setFlowStatus = function setFlowStatus(gh, status) {
  var _spawn = spawn('./node_modules/.bin/flow', ['check'], { encoding: 'utf8' }),
      stdout = _spawn.stdout;

  var lines = stdout.split('\n');
  var lastLine = lines[lines.length - 2];
  var errorCount = parseInt(lastLine.replace('Found ', ''));

  var description = 'errors: ' + errorCount;
  var success = errorCount === 0;
  setStatus(gh, status, 'Flow Report', description, success);

  console.log(stdout);
};

var setJestStatus = function setJestStatus(gh, status) {
  var _spawn2 = spawn('./node_modules/.bin/jest', ['--coverage'], { encoding: 'utf8' }),
      stderr = _spawn2.stderr;

  var regex = /Tests:\s+(\d+)\D+(\d+)\s+total/;

  var _regex$exec$slice$map = regex.exec(stderr).slice(1, 3).map(function (num) {
    return parseInt(num);
  }),
      _regex$exec$slice$map2 = _slicedToArray(_regex$exec$slice$map, 2),
      passedCount = _regex$exec$slice$map2[0],
      testCount = _regex$exec$slice$map2[1];

  var description = passedCount + ' passed, ' + testCount + ' total';
  var success = passedCount === testCount;
  setStatus(gh, status, 'Jest Tests', description, success);

  console.log(stderr);
};

var setStatus = function setStatus(gh, status, context, description, success) {
  gh.repos.createStatus(_extends({}, status, {
    context: context,
    description: description,
    state: success ? 'success' : 'failure'
  }), function (err) {
    console.log(context + ': ' + (err ? 'fail' : 'success!'));

    if (err) {
      console.error(context + ': Error creating status', err);
    }
  });

  if (!success) {
    process.exitCode = 1;
  }
};

setStatuses();