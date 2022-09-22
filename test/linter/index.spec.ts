import { describe, expect, it } from 'vitest'
import {
  forDirectionLintError,
  forDirError,
  noFuncAssignLintError,
  noFuncAssignError,
  eqLintError,
  doubleEqError,
} from '../../src'

describe('should', () => {
  it('for-direction-lint-entry', () => {
    expect(forDirError).toBe(true)
    expect(forDirectionLintError).toMatchInlineSnapshot(`
      [
        [Error: for direction error
         5 | for (var i = 10; i >= 0; i--) {
         6 | }
      >  7 | for (var i = 0; i < 10; i--) {
           |                         ^^^
         8 | }
         9 |
        10 | for (var i = 10; i >= 0; i++) {],
        [Error: for direction error
         8 | }
         9 |
      > 10 | for (var i = 10; i >= 0; i++) {
           |                          ^^^
        11 | }
        12 |],
      ]
    `)
  })
  it('no-func-assign-lint-entry', () => {
    expect(noFuncAssignError).toBe(true)
    expect(noFuncAssignLintError).toMatchInlineSnapshot(`
      [
        [Error: can not reassign to function
        1 |
        2 |     function foo() {
      > 3 |         foo = bar;
          |         ^^^^^^^^^
        4 |     }
        5 |
        6 |     var a = function hello() {],
        [Error: can not reassign to function
        5 |
        6 |     var a = function hello() {
      > 7 |     hello = 123;
          |     ^^^^^^^^^^^
        8 |     };
        9 |],
      ]
    `)
  })
  it('no-func-assign-lint-entry', () => {
    expect(doubleEqError).toBe(true)
    expect(eqLintError).toMatchInlineSnapshot(`
      [
        [Error: please replace == with ===
        1 |
      > 2 | a == b;
          | ^^^^^^
        3 | foo == true
        4 | bananas != 1;
        5 | value == undefined],
        [Error: please replace == with ===
        1 |
        2 | a == b;
      > 3 | foo == true
          | ^^^^^^^^^^^
        4 | bananas != 1;
        5 | value == undefined
        6 | typeof foo == 'undefined'],
        [Error: please replace != with !==
        2 | a == b;
        3 | foo == true
      > 4 | bananas != 1;
          | ^^^^^^^^^^^^
        5 | value == undefined
        6 | typeof foo == 'undefined'
        7 | 'hello' != 'world'],
        [Error: please replace == with ===
        3 | foo == true
        4 | bananas != 1;
      > 5 | value == undefined
          | ^^^^^^^^^^^^^^^^^^
        6 | typeof foo == 'undefined'
        7 | 'hello' != 'world'
        8 | 0 == 0],
        [Error: please replace == with ===
        4 | bananas != 1;
        5 | value == undefined
      > 6 | typeof foo == 'undefined'
          | ^^^^^^^^^^^^^^^^^^^^^^^^^
        7 | 'hello' != 'world'
        8 | 0 == 0
        9 | true == true],
      ]
    `)
  })
})
