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
	
	var _TelnetDiagnostics = __webpack_require__(79);
	
	var _TelnetDiagnostics2 = _interopRequireDefault(_TelnetDiagnostics);
	
	var _MIDIDiagnostics = __webpack_require__(80);
	
	var _MIDIDiagnostics2 = _interopRequireDefault(_MIDIDiagnostics);
	
	var _DMXDiagnostics = __webpack_require__(82);
	
	var _DMXDiagnostics2 = _interopRequireDefault(_DMXDiagnostics);
	
	var _OSCDiagnostics = __webpack_require__(81);
	
	var _OSCDiagnostics2 = _interopRequireDefault(_OSCDiagnostics);
	
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
					'h1',
					null,
					'Diagnostics'
				),
				_react2.default.createElement(
					_reactBootstrap.Tabs,
					{ defaultActiveKey: "telnet-tab", id: 'uncontrolled-tabs' },
					_react2.default.createElement(
						_reactBootstrap.Tab,
						{ eventKey: "telnet-tab", title: 'Telnet' },
						_react2.default.createElement(_TelnetDiagnostics2.default, { path: this.props.location.pathname })
					),
					_react2.default.createElement(
						_reactBootstrap.Tab,
						{ eventKey: "dmx-tab", title: 'DMX' },
						_react2.default.createElement(_DMXDiagnostics2.default, { path: this.props.location.pathname })
					),
					_react2.default.createElement(
						_reactBootstrap.Tab,
						{ eventKey: "midi-tab", title: 'MIDI' },
						_react2.default.createElement(_MIDIDiagnostics2.default, { path: this.props.location.pathname })
					),
					_react2.default.createElement(
						_reactBootstrap.Tab,
						{ eventKey: "osc-tab", title: 'OSC' },
						_react2.default.createElement(_OSCDiagnostics2.default, { path: this.props.location.pathname })
					)
				)
			);
		}
	}
	exports.default = Diagnostics;

/***/ })

};
//# sourceMappingURL=0.fbce990249a46fe59714.hot-update.js.map