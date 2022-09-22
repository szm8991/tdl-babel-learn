import { describe, expect, it } from 'vitest'
import { basicCheckerCode, funcCheckerCode } from '../../src'

describe('should', () => {
  it('basic-checker', () => {
    expect(basicCheckerCode).toMatchInlineSnapshot(`
      "let name: string;
      name = 111;
      let age: number = 'szm';"
    `)
  })
  it('func-checker', () => {
    expect(funcCheckerCode).toMatchInlineSnapshot(`
      "function add(a: number, b: number): number {
        return a + b;
      }

      add(1, '2');"
    `)
  })
})
