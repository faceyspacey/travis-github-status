#!/usr/bin/env node

import {
  setJestStatus,
  setFlowStatus,
  setLintStatus,
  setSnykStatus,
  setCodeClimateStatus,
} from './statuses'

import { shouldSet, getStatus } from './utils'

if (process.env.NODE_ENV !== 'test') {
  const status = getStatus(process.env)

  if (shouldSet('lint')) setLintStatus(status)
  if (shouldSet('flow')) setFlowStatus(status)
  if (shouldSet('jest')) setJestStatus(status)
  if (shouldSet('snyk')) setSnykStatus(status, process.env)
  if (shouldSet('codeclimate')) setCodeClimateStatus(process.env)
}
