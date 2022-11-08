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
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	var _TelnetDiagnostics = __webpack_require__(79);
	
	var _TelnetDiagnostics2 = _interopRequireDefault(_TelnetDiagnostics);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	let socket;
	
	class Diagnostics extends _react2.default.Component {
	
		constructor(props) {
			super(props);
			this.state = {
				text: '',
				host: '127.0.0.1',
				port: 5250,
				command: "cls",
				response: ''
			};
			this.onHostChange = this.onHostChange.bind(this);
			this.onPortChange = this.onPortChange.bind(this);
			this.onCommandChange = this.onCommandChange.bind(this);
			this.sendTelnetTest = this.sendTelnetTest.bind(this);
		}
		componentDidMount() {
			socket = (0, _socket3.default)();
			socket.on(this.props.location.pathname, mesg => {
				this.setState({ text: mesg });
			});
			socket.on('telnet-response', mesg => {
				this.setState({ response: mesg });
			});
		}
		componentWillUnmount() {
			socket.off(this.props.page);
		}
		onPortChange(event) {
			this.setState({ port: event.target.value });
		}
		onHostChange(event) {
			this.setState({ host: event.target.value });
		}
		onCommandChange(event) {
			this.setState({ command: event.target.value });
		}
		sendTelnetTest() {
			console.log("sending Telnet Test");
			socket.emit('diagnostics-send-telnet', { host: this.state.host, port: this.state.port, command: this.state.command });
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
						_TelnetDiagnostics2.default
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
//# sourceMappingURL=0.8ce97f48bf6b3570f52b.hot-update.js.map