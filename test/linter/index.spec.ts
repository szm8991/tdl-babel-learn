import { describe, expect, it } from 'vitest'
import {
  forDirectionLintCode,
  forDirError,
  noFuncAssignLintCode,
  noFuncAssignError,
  eqLintCode,
  doubleEqError,
} from '../../src'

describe('should', () => {
  it('for-direction-lint-entry', () => {
    expect(forDirError).toBe(true)
    expect(forDirectionLintCode).toMatchInlineSnapshot(`
      "for (var i = 0; i < 10; i++) {}

      for (var i = 10; i >= 0; i--) {}

      for (var i = 0; i < 10; i--) {}

      for (var i = 10; i >= 0; i++) {}"
    `)
  })
  it('no-func-assign-lint-entry', () => {
    expect(noFuncAssignError).toBe(true)
    expect(noFuncAssignLintCode).toMatchInlineSnapshot(`
      "function foo() {
        foo = bar;
      }

      var a = function hello() {
        hello = 123;
      };"
    `)
  })
  it('no-func-assign-lint-entry', () => {
    expect(doubleEqError).toBe(true)
    expect(eqLintCode).toMatchInlineSnapshot(`
      "a === b;
      foo === true;
      bananas !== 1;
      value === undefined;
      typeof foo === 'undefined';
      'hello' != 'world';
      0 == 0;
      true == true;"
    `)
  })
})
