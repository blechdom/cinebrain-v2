exports.id = 0;
exports.modules = {

/***/ 79:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(22);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	let socket;
	
	class TelnetDiagnostics extends _react2.default.Component {
	
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
					'div',
					null,
					_react2.default.createElement(
						_reactBootstrap.Form,
						{ horizontal: true, onSubmit: this.sendTelnetTest },
						_react2.default.createElement(
							_reactBootstrap.FormGroup,
							null,
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ componentClass: _reactBootstrap.ControlLabel, sm: 3 },
								'Host'
							),
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ sm: 9 },
								_react2.default.createElement(_reactBootstrap.FormControl, { name: 'host', value: this.state.host, onChange: this.onHostChange })
							)
						),
						_react2.default.createElement(
							_reactBootstrap.FormGroup,
							null,
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ componentClass: _reactBootstrap.ControlLabel, sm: 3 },
								'Port'
							),
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ sm: 9 },
								_react2.default.createElement(_reactBootstrap.FormControl, { name: 'port', value: this.state.port, onChange: this.onPortChange })
							)
						),
						_react2.default.createElement(
							_reactBootstrap.FormGroup,
							null,
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ componentClass: _reactBootstrap.ControlLabel, sm: 3 },
								'Telnet Command'
							),
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ sm: 9 },
								_react2.default.createElement(_reactBootstrap.FormControl, { name: 'command', value: this.state.command, onChange: this.onCommandChange })
							)
						),
						_react2.default.createElement(
							_reactBootstrap.FormGroup,
							null,
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ smOffset: 3, sm: 6 },
								_react2.default.createElement(
									_reactBootstrap.ButtonToolbar,
									null,
									_react2.default.createElement(
										_reactBootstrap.Button,
										{ bsStyle: 'primary', type: 'submit' },
										'Send Telnet Command'
									)
								)
							)
						)
					)
				),
				_react2.default.createElement(
					'div',
					null,
					this.state.response
				)
			);
		}
	}
	exports.default = TelnetDiagnostics;

/***/ })

};
//# sourceMappingURL=0.3e773775d4f6e3999313.hot-update.js.map