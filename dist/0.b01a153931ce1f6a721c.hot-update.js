exports.id = 0;
exports.modules = {

/***/ 72:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _TelnetDiagnostics = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./TelnetDiagnostics.jsx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	var _TelnetDiagnostics2 = _interopRequireDefault(_TelnetDiagnostics);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class Diagnostics extends _react2.default.Component {
	
		constructor(props) {
			super(props);
			this.state = {};
		}
		render() {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					_reactBootstrap.Tabs,
					{ defaultActiveKey: 2, id: 'uncontrolled-tabs' },
					_react2.default.createElement(
						_reactBootstrap.Tab,
						{ eventKey: "telnet-tab", title: 'Telnet' },
						_react2.default.createElement(_TelnetDiagnostics2.default, null)
					),
					_react2.default.createElement(_reactBootstrap.Tab, { eventKey: "dmx-tab", title: 'DMX' }),
					_react2.default.createElement(_reactBootstrap.Tab, { eventKey: "midi-tab", title: 'MIDI' }),
					_react2.default.createElement(_reactBootstrap.Tab, { eventKey: "osc-tab", title: 'OSC' })
				)
			);
		}
	}
	exports.default = Diagnostics;

/***/ })

};
//# sourceMappingURL=0.b01a153931ce1f6a721c.hot-update.js.map