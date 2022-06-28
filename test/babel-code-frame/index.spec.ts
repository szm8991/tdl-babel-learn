import { describe, expect, it } from 'vitest'
import { ast } from '../../src'

describe('should', () => {
  it('exported', () => {
    expect(ast).toMatchInlineSnapshot(`
      Node {
        "body": [
          {
            "end": 9,
            "type": "MingStatement",
            "value": "ming",
          },
          Node {
            "declarations": [
              Node {
                "end": 25,
                "id": Node {
                  "end": 21,
                  "name": "a",
                  "start": 20,
                  "type": "Identifier",
                },
                "init": Node {
                  "end": 25,
                  "raw": "1",
                  "start": 24,
                  "type": "Literal",
                  "value": 1,
                },
                "start": 20,
                "type": "VariableDeclarator",
              },
            ],
            "end": 25,
            "kind": "const",
            "start": 14,
            "type": "VariableDeclaration",
          },
        ],
        "end": 26,
        "sourceType": "script",
        "start": 0,
        "type": "Program",
      }
    `)
  })
})
