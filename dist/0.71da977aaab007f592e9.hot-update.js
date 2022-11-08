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
					_reactBootstrap.Tab.Container,
					{ id: 'tabs-with-dropdown', defaultActiveKey: 'telnet-tab' },
					_react2.default.createElement(
						_reactBootstrap.Row,
						{ className: 'clearfix' },
						_react2.default.createElement(
							_reactBootstrap.Col,
							{ sm: 12 },
							_react2.default.createElement(
								_reactBootstrap.Nav,
								{ bsStyle: 'tabs' },
								_react2.default.createElement(
									_reactBootstrap.NavItem,
									{ eventKey: 'telnet-tab' },
									'Telnet'
								),
								_react2.default.createElement(
									_reactBootstrap.NavItem,
									{ eventKey: 'dmx-tab' },
									'DMX'
								),
								_react2.default.createElement(
									_reactBootstrap.NavItem,
									{ eventKey: 'midi-tab' },
									'MIDI'
								),
								_react2.default.createElement(
									_reactBootstrap.NavItem,
									{ eventKey: 'osc-tab' },
									'OSC'
								),
								_react2.default.createElement(
									_reactBootstrap.NavDropdown,
									{ eventKey: '3', title: 'Dropdown', id: 'nav-dropdown-within-tab' },
									_react2.default.createElement(
										_reactBootstrap.MenuItem,
										{ eventKey: '3.1' },
										'Action'
									),
									_react2.default.createElement(
										_reactBootstrap.MenuItem,
										{ eventKey: '3.2' },
										'Another action'
									),
									_react2.default.createElement(
										_reactBootstrap.MenuItem,
										{ eventKey: '3.3' },
										'Something else here'
									),
									_react2.default.createElement(_reactBootstrap.MenuItem, { divider: true }),
									_react2.default.createElement(
										_reactBootstrap.MenuItem,
										{ eventKey: '3.4' },
										'Separated link'
									)
								)
							)
						),
						_react2.default.createElement(
							_reactBootstrap.Col,
							{ sm: 12 },
							_react2.default.createElement(
								_reactBootstrap.Tab.Content,
								{ animation: true },
								_react2.default.createElement(_reactBootstrap.Tab.Pane, { eventKey: 'telnet-tab' }),
								_react2.default.createElement(
									_reactBootstrap.Tab.Pane,
									{ eventKey: 'dmx-tab' },
									'Tab 2 content'
								),
								_react2.default.createElement(
									_reactBootstrap.Tab.Pane,
									{ eventKey: 'midi-tab' },
									'Tab 2 content'
								),
								_react2.default.createElement(
									_reactBootstrap.Tab.Pane,
									{ eventKey: 'osc-tab' },
									'Tab 2 content'
								),
								_react2.default.createElement(
									_reactBootstrap.Tab.Pane,
									{ eventKey: '3.1' },
									'Tab 3.1 content'
								),
								_react2.default.createElement(
									_reactBootstrap.Tab.Pane,
									{ eventKey: '3.2' },
									'Tab 3.2 content'
								),
								_react2.default.createElement(
									_reactBootstrap.Tab.Pane,
									{ eventKey: '3.3' },
									'Tab 3.3 content'
								),
								_react2.default.createElement(
									_reactBootstrap.Tab.Pane,
									{ eventKey: '3.4' },
									'Tab 3.4 content'
								)
							)
						)
					)
				),
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
	exports.default = Diagnostics;

/***/ })

};
//# sourceMappingURL=0.71da977aaab007f592e9.hot-update.js.map