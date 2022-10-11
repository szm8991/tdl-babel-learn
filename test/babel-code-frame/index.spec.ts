import { describe, expect, it } from 'vitest'
import { ast } from '../../src'

describe('should', () => {
  it('exported', () => {
    expect(ast).toMatchInlineSnapshot('undefined')
  })
})
