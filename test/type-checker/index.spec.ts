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
        [Error: string can not assign to number
        3 |     return a + b;
        4 | }
      > 5 | add(1, '2');
          |        ^^^
        6 | function sum<T>(a: T, b: T) {
        7 |     return a * b;
        8 | }],
        [Error: string can not assign to number
         7 |     return a * b;
         8 | }
      >  9 | add<number>(1, '2');
           |                ^^^
        10 | type Res<Param> = Param extends 1 ? number : string;
        11 | function doubleAdd<T>(a: T, b: T) {
        12 |     return 2 * (a + b);],
        [Error: number can not assign to string
        12 |     return 2 * (a + b);
        13 | }
      > 14 | doubleAdd<Res<2>>(1, '2');
           |                   ^
        15 |],
      ]
    `)
  })
})
