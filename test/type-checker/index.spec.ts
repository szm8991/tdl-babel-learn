import { describe, expect, it } from 'vitest'
import { basicCheckerCode } from '../../src'

describe('should', () => {
  it('basic-checker', () => {
    expect(basicCheckerCode).toMatchInlineSnapshot(`
      "let name: string;
      name = 111;
      let age: number = 'szm';"
    `)
  })
})
