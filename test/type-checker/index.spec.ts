import { describe, expect, it } from 'vitest'
import { basicError, funcError } from '../../src'

describe('should', () => {
  it('basic-checker', () => {
    expect(basicError).toMatchInlineSnapshot(`
      [
        [Error: Assignment:number can not assign to string],
        [Error: Variable:string can not assign to number
        2 | let name: string;
        3 | name = 111;
      > 4 | let age: number = 'szm';
          |                   ^^^^^
        5 |],
      ]
    `)
  })
  it('func-checker', () => {
    expect(funcError).toMatchInlineSnapshot(`
      [
        [Error: undefined can not assign to number
        3 |     return a + b;
        4 | }
      > 5 | add(1, '2');
          |        ^^^
        6 | function sum<T>(a: T, b: T) {
        7 |     return a * b;
        8 | }],
        [Error: undefined can not assign to number
         7 |     return a * b;
         8 | }
      >  9 | add<number>(1, '2');
           |                ^^^
        10 |],
      ]
    `)
  })
})
