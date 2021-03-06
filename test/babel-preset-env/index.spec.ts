import { describe, expect, it } from 'vitest'
import { presetCode } from '../../src'

describe('should', () => {
  it('exported', () => {
    expect(presetCode).toMatchInlineSnapshot(`
      "\\"use strict\\";

      var _interopRequireDefault = require(\\"@babel/runtime-corejs3/helpers/interopRequireDefault\\");

      var _createClass2 = _interopRequireDefault(require(\\"@babel/runtime-corejs3/helpers/createClass\\"));

      var _classCallCheck2 = _interopRequireDefault(require(\\"@babel/runtime-corejs3/helpers/classCallCheck\\"));

      var Song = /*#__PURE__*/(0, _createClass2.default)(function Song() {
        (0, _classCallCheck2.default)(this, Song);
      });"
    `)
  })
})
