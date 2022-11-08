exports.id = 0;
exports.modules = {

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(13);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(23);
	
	var _reactRouter = __webpack_require__(15);
	
	var _reactBootstrap = __webpack_require__(19);
	
	var _socket = __webpack_require__(51);
	
	var _socket2 = __webpack_require__(52);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _React$PropTypes = _react2.default.PropTypes;
	const string = _React$PropTypes.string,
	      bool = _React$PropTypes.bool,
	      object = _React$PropTypes.object;
	class Diagnostics extends _react2.default.Component {
	
		constructor(props) {
			super(props);
			this.state = {
				text: ''
			};
			this.socket;
		}
		componentDidMount() {
			this.socket = (0, _socket3.default)();
			this.socket.on(this.props.location.pathname, mesg => {
				this.setState({ text: mesg });
			});
		}
		componentWillUnmount() {
			socket.off(this.props.page);
		}
		sendSocketData() {
			console.log("socket button pressed");
			this.socket.emit('diagnostics-button', 'Hello world!');
		}
		render() {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					null,
					this.state.text
				),
				_react2.default.createElement(
					_reactBootstrap.Button,
					{ onClick: this.sendSocketData },
					'Send Socket Data'
				)
			);
		}
	}
	exports.default = Diagnostics;

/***/ })

};
//# sourceMappingURL=0.26ee08bb44a9479b7202.hot-update.js.map