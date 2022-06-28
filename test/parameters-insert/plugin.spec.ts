import { describe, expect, it } from 'vitest'
import { plugin } from '../../src'
import { transformSync } from '@babel/core'
describe('should', () => {
  it('exported', () => {
    const reactCode = `
    console.log(1);

    function func() {
        console.info(2);
    }

    export default class Clazz {
        say() {
            console.debug(3);
        }
        render() {
            return <div>{console.error(4)}</div>
        }
    }
`
    const { code } = transformSync(reactCode, {
      plugins: [plugin],
      parserOpts: {
        sourceType: 'unambiguous',
        plugins: ['jsx'],
      },
    })
    expect(code).toMatchInlineSnapshot(`
      "console.log(\\"unkown filename: (2, 4)\\")
      console.log(1);

      function func() {
        console.log(\\"unkown filename: (5, 8)\\")
        console.info(2);
      }

      export default class Clazz {
        say() {
          console.log(\\"unkown filename: (10, 12)\\")
          console.debug(3);
        }

        render() {
          return <div>{[console.log(\\"unkown filename: (13, 25)\\"), console.error(4)]}</div>;
        }

      }"
    `)
  })
})
