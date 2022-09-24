import { describe, expect, it } from 'vitest'
import { dependencyGraph } from '../../src'

describe('should', () => {
  it('log dependencyGraphres', () => {
    expect(dependencyGraph).toMatchInlineSnapshot(`
      {
        "resultModules": {
          "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\a.ts": DependencyNode {
            "exports": [
              {
                "exported": "aa1",
                "local": "aa1",
                "type": "named",
              },
              {
                "exported": "aa2",
                "local": "aa2",
                "type": "named",
              },
            ],
            "imports": {
              "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\b.ts": [
                {
                  "local": "b",
                  "type": "default",
                },
              ],
            },
            "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\a.ts",
            "subModules": {
              "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\b.ts": DependencyNode {
                "exports": [
                  {
                    "exported": "b",
                    "type": "default",
                  },
                ],
                "imports": {
                  "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts": [
                    {
                      "imported": "cc",
                      "local": "renamedCc",
                      "type": "deconstruct",
                    },
                  ],
                },
                "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\b.ts",
                "subModules": {
                  "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts": DependencyNode {
                    "exports": [
                      {
                        "exported": "cc",
                        "local": "cc",
                        "type": "named",
                      },
                    ],
                    "imports": {},
                    "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts",
                    "subModules": {},
                  },
                },
              },
            },
          },
          "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\b.ts": DependencyNode {
            "exports": [
              {
                "exported": "b",
                "type": "default",
              },
            ],
            "imports": {
              "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts": [
                {
                  "imported": "cc",
                  "local": "renamedCc",
                  "type": "deconstruct",
                },
              ],
            },
            "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\b.ts",
            "subModules": {
              "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts": DependencyNode {
                "exports": [
                  {
                    "exported": "cc",
                    "local": "cc",
                    "type": "named",
                  },
                ],
                "imports": {},
                "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts",
                "subModules": {},
              },
            },
          },
          "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts": DependencyNode {
            "exports": [
              {
                "exported": "cc",
                "local": "cc",
                "type": "named",
              },
            ],
            "imports": {},
            "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts",
            "subModules": {},
          },
          "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\index.ts": DependencyNode {
            "exports": [],
            "imports": {
              "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\a.ts": [
                {
                  "imported": "aa1",
                  "local": "aa1",
                  "type": "deconstruct",
                },
                {
                  "imported": "aa2",
                  "local": "aa2",
                  "type": "deconstruct",
                },
              ],
            },
            "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\index.ts",
            "subModules": {
              "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\a.ts": DependencyNode {
                "exports": [
                  {
                    "exported": "aa1",
                    "local": "aa1",
                    "type": "named",
                  },
                  {
                    "exported": "aa2",
                    "local": "aa2",
                    "type": "named",
                  },
                ],
                "imports": {
                  "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\b.ts": [
                    {
                      "local": "b",
                      "type": "default",
                    },
                  ],
                },
                "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\a.ts",
                "subModules": {
                  "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\b.ts": DependencyNode {
                    "exports": [
                      {
                        "exported": "b",
                        "type": "default",
                      },
                    ],
                    "imports": {
                      "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts": [
                        {
                          "imported": "cc",
                          "local": "renamedCc",
                          "type": "deconstruct",
                        },
                      ],
                    },
                    "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\b.ts",
                    "subModules": {
                      "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts": DependencyNode {
                        "exports": [
                          {
                            "exported": "cc",
                            "local": "cc",
                            "type": "named",
                          },
                        ],
                        "imports": {},
                        "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts",
                        "subModules": {},
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "root": DependencyNode {
          "exports": [],
          "imports": {
            "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\a.ts": [
              {
                "imported": "aa1",
                "local": "aa1",
                "type": "deconstruct",
              },
              {
                "imported": "aa2",
                "local": "aa2",
                "type": "deconstruct",
              },
            ],
          },
          "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\index.ts",
          "subModules": {
            "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\a.ts": DependencyNode {
              "exports": [
                {
                  "exported": "aa1",
                  "local": "aa1",
                  "type": "named",
                },
                {
                  "exported": "aa2",
                  "local": "aa2",
                  "type": "named",
                },
              ],
              "imports": {
                "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\b.ts": [
                  {
                    "local": "b",
                    "type": "default",
                  },
                ],
              },
              "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\a.ts",
              "subModules": {
                "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\b.ts": DependencyNode {
                  "exports": [
                    {
                      "exported": "b",
                      "type": "default",
                    },
                  ],
                  "imports": {
                    "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts": [
                      {
                        "imported": "cc",
                        "local": "renamedCc",
                        "type": "deconstruct",
                      },
                    ],
                  },
                  "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\b.ts",
                  "subModules": {
                    "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts": DependencyNode {
                      "exports": [
                        {
                          "exported": "cc",
                          "local": "cc",
                          "type": "named",
                        },
                      ],
                      "imports": {},
                      "path": "E:\\\\知识库\\\\babelDemo\\\\babel-learn\\\\src\\\\babel-module-tranverser\\\\test\\\\c\\\\index.ts",
                      "subModules": {},
                    },
                  },
                },
              },
            },
          },
        },
      }
    `)
  })
})
