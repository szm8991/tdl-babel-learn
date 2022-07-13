import { describe, expect, it } from 'vitest'
import { autoI18nPluginCode, shouldNotI18n } from '../../src'

describe('should', () => {
  it('exported', () => {
    expect(shouldNotI18n).toBe(6)
    expect(autoI18nPluginCode).toMatchInlineSnapshot(`
      "import _intl from 'intl';
      import intl2 from 'intl2'; // import intl from 'intl'
      // import { t } from 'intl'

      /**
       * App
       */

      function App() {
        const title = _intl.t('intl1');

        const desc = _intl.t('intl2');

        const desc2 = \`desc\`;

        const desc3 = _intl.t('intl3', title + desc, desc2);

        return <div className=\\"app\\" title={_intl.t('intl4')}>
            <img className={showImg + ' img'} src={Logo} />
            <h1>\${title}</h1>
            <p>\${desc}</p>
            <div>{'中文'}</div>
          </div>;
      }"
    `)
  })
})
