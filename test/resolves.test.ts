import { expect, test } from 'vitest'
import type { DependencyFilter, RawDep } from '../src'
import { resolveDependency } from '../src'

const filter: DependencyFilter = () => true

const makePkg = (ver: string): RawDep => {
  const pkg: RawDep = {
    name: 'typescript',
    currentVersion: ver,
    source: 'dependencies',
    update: true,
  }
  return pkg
}

test('resolveDependency', async () => {
  // default
  expect(false).toBe((await resolveDependency(makePkg(''), 'default', filter)).update)
  expect(false).toBe((await resolveDependency(makePkg('*'), 'default', filter)).update)
  expect(false).toBe((await resolveDependency(makePkg('4.0.0'), 'default', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('^4.0.0'), 'default', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('>4.0.0'), 'default', filter)).update)

  // major
  expect(false).toBe((await resolveDependency(makePkg(''), 'major', filter)).update)
  expect(false).toBe((await resolveDependency(makePkg('*'), 'major', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('4.0.0'), 'major', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('^4.0.0'), 'major', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('>4.0.0'), 'major', filter)).update)

  // minor
  expect(false).toBe((await resolveDependency(makePkg(''), 'minor', filter)).update)
  expect(false).toBe((await resolveDependency(makePkg('*'), 'minor', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('4.0.0'), 'minor', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('^4.0.0'), 'minor', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('>4.0.0'), 'minor', filter)).update)

  // patch
  expect(false).toBe((await resolveDependency(makePkg(''), 'patch', filter)).update)
  expect(false).toBe((await resolveDependency(makePkg('*'), 'patch', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('4.0.0'), 'patch', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('^4.0.0'), 'patch', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('>4.0.0'), 'patch', filter)).update)

  // latest
  expect(false).toBe((await resolveDependency(makePkg(''), 'latest', filter)).update)
  expect(false).toBe((await resolveDependency(makePkg('*'), 'latest', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('4.0.0'), 'latest', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('^4.0.0'), 'latest', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('>4.0.0'), 'latest', filter)).update)

  // newest
  expect(false).toBe((await resolveDependency(makePkg(''), 'newest', filter)).update)
  expect(false).toBe((await resolveDependency(makePkg('*'), 'newest', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('4.0.0'), 'newest', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('^4.0.0'), 'newest', filter)).update)
  expect(true).toBe((await resolveDependency(makePkg('>4.0.0'), 'newest', filter)).update)

  expect((await resolveDependency(makePkg(''), 'newest', filter)).targetVersion)
    .toMatch('')
  expect((await resolveDependency(makePkg('workspace:*'), 'newest', filter)).targetVersion)
    .toMatch('workspace:*')
  expect((await resolveDependency(makePkg('workspace:*'), 'newest', filter)).resolveError)
    .toBeUndefined()
  expect((await resolveDependency(makePkg('random'), 'newest', filter)).targetVersion)
    .toMatch('random')
  expect((await resolveDependency(makePkg('random'), 'newest', filter)).resolveError)
    .toBeUndefined()
})
