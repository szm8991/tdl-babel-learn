import { describe, expect, it } from 'vitest'
import { docs } from '../../src'

describe('should', () => {
  it('exported', () => {
    expect(docs).toMatchInlineSnapshot(`
      [
        {
          "doc": {
            "description": "say 你好",
            "tags": [
              {
                "description": "名字",
                "name": "name",
                "title": "param",
                "type": null,
              },
              {
                "description": "string",
                "title": "return",
                "type": null,
              },
            ],
          },
          "name": "sayHi",
          "params": [
            {
              "name": "name",
              "type": "string",
            },
            {
              "name": "age",
              "type": "number",
            },
            {
              "name": "a",
              "type": "boolean",
            },
          ],
          "return": "string",
          "type": "function",
        },
        {
          "constructorInfo": {
            "params": [
              {
                "doc": undefined,
                "name": "name",
                "type": "string",
              },
            ],
          },
          "doc": {
            "description": "类测试",
            "tags": [],
          },
          "methodsInfo": [
            {
              "doc": {
                "description": "方法测试",
                "tags": [
                  {
                    "description": "string",
                    "title": "return",
                    "type": null,
                  },
                ],
              },
              "name": "sayHi",
              "params": [],
              "return": undefined,
            },
          ],
          "name": "Ming",
          "propertiesInfo": [
            {
              "doc": [
                [
                  {
                    "description": "name 属性",
                    "tags": [],
                  },
                ],
              ],
              "name": "name",
              "type": "string",
            },
          ],
          "type": "class",
        },
      ]
    `)
  })
})
