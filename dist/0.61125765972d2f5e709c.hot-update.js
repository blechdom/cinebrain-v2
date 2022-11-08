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
	
	var _DMXDiagnostics = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./DMXDiagnostics.jsx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
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

/***/ }),

/***/ 81:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class ATEMGroup1 extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      lock: true,
	      host: '127.0.0.1',
	      port: 5250,
	      command: "",
	      response: ''
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleSliders = this.handleSliders.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onClick: this.handleButtons },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '0', max: '100', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	
	    switch (event.target.value) {
	      case 'atem_caspar':
	        socket.emit('atemTV1_changeProgramInput', '1');
	        break;
	      case 'atem_camera':
	        socket.emit('atemTV1_changeProgramInput', '2');
	        break;
	      case 'atem_preview_caspar':
	        socket.emit('atemTV1_changePreviewInput', '1');
	        break;
	      case 'atem_preview_camera':
	        socket.emit('atemTV1_changePreviewInput', '2');
	        break;
	      case 'atem_auto_transition':
	        socket.emit('atemTV1_autoTransition', '');
	        break;
	      case 'atem_transition_mix':
	        socket.emit('atemTV1_transitionType', '0');
	        break;
	      case 'atem_transition_wipe':
	        socket.emit('atemTV1_transitionType', '2');
	        break;
	      case 'atem_50_50':
	        socket.emit('atem1me_runMacro', '0');
	        break;
	
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = event.target.value;
	    switch (event.target.id) {
	      case 'atem_transition_position':
	        socket.emit('atemTV1_transition_position', slider_value * 100);
	        break;
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	  }
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'Group 1: VIDEO Switcher'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	    this.setState({
	      items: [{
	        type: 0,
	        i: "atem_caspar",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Program Media'
	      }, {
	        type: 0,
	        i: "atem_camera",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Program Camera'
	      }, {
	        type: 0,
	        i: "atem_preview_caspar",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Preview Media'
	      }, {
	        type: 0,
	        i: "atem_preview_camera",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Preview Camera'
	      }, {
	        type: 1,
	        i: "atem_transition_position",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 2,
	        h: 2,
	        className: 'btn-block btn',
	        text: 'ATEM Transition'
	      }, {
	        type: 0,
	        i: "atem_auto_transition",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Auto Transition'
	      }, {
	        type: 0,
	        i: "atem_transition_mix",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Mix'
	      }, {
	        type: 0,
	        i: "atem_transition_wipe",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Wipe'
	      }]
	    });
	  }
	}
	exports.default = ATEMGroup1;
	ATEMGroup1.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ })

};
//# sourceMappingURL=0.61125765972d2f5e709c.hot-update.js.map