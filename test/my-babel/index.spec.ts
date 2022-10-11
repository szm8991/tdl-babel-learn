import { describe, expect, it } from 'vitest'
import { myParse } from '../../src'

describe('should', () => {
  it('parse', () => {
    const program = `
        ming
        const a = 1
    `
    const myAst = myParse(program, { ecmaVersion: 'latest' })
    expect(myAst).toMatchInlineSnapshot(`
      Node {
        "body": [
          Node {
            "end": 13,
            "expression": Node {
              "end": 13,
              "loc": SourceLocation {
                "end": Position {
                  "column": 12,
                  "line": 2,
                },
                "start": Position {
                  "column": 8,
                  "line": 2,
                },
              },
              "name": "ming",
              "start": 9,
              "type": "Identifier",
            },
            "loc": SourceLocation {
              "end": Position {
                "column": 12,
                "line": 2,
              },
              "start": Position {
                "column": 8,
                "line": 2,
              },
            },
            "start": 9,
            "type": "ExpressionStatement",
          },
          Node {
            "declarations": [
              Node {
                "end": 33,
                "id": Node {
                  "end": 29,
                  "loc": SourceLocation {
                    "end": Position {
                      "column": 15,
                      "line": 3,
                    },
                    "start": Position {
                      "column": 14,
                      "line": 3,
                    },
                  },
                  "name": "a",
                  "start": 28,
                  "type": "Identifier",
                },
                "init": Node {
                  "end": 33,
                  "loc": SourceLocation {
                    "end": Position {
                      "column": 19,
                      "line": 3,
                    },
                    "start": Position {
                      "column": 18,
                      "line": 3,
                    },
                  },
                  "raw": "1",
                  "start": 32,
                  "type": "Literal",
                  "value": 1,
                },
                "loc": SourceLocation {
                  "end": Position {
                    "column": 19,
                    "line": 3,
                  },
                  "start": Position {
                    "column": 14,
                    "line": 3,
                  },
                },
                "start": 28,
                "type": "VariableDeclarator",
              },
            ],
            "end": 33,
            "kind": "const",
            "loc": SourceLocation {
              "end": Position {
                "column": 19,
                "line": 3,
              },
              "start": Position {
                "column": 8,
                "line": 3,
              },
            },
            "start": 22,
            "type": "VariableDeclaration",
          },
        ],
        "end": 38,
        "loc": SourceLocation {
          "end": Position {
            "column": 4,
            "line": 4,
          },
          "start": Position {
            "column": 0,
            "line": 1,
          },
        },
        "sourceType": "script",
        "start": 0,
        "type": "Program",
      }
    `)
  })
})
