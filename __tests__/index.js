import { shouldSet } from '../src'

it('it works', () => {
  expect(shouldSet('foo')).toEqual(false)
})

it('it does NOT work', () => {
  expect(shouldSet('foo')).toEqual(true)
})

it('it works3', () => {
  expect(shouldSet('foo')).toEqual(false)
})

it('it does NOT work3', () => {
  expect(shouldSet('foo')).toEqual(true)
})
