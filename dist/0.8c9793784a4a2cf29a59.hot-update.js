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
	
	var _OSCDiagnostics = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./OSCDiagnostics.jsx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
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

/***/ 80:
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
	
	class MIDILooper extends _react2.default.Component {
	
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
	          sliderValue: 0,
	          inputValue: 0
	        };
	      }),
	      lock: true,
	      host: '127.0.0.1',
	      port: 5250,
	      command: "",
	      response: '',
	      compactType: null,
	      spot_speed: 215
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleSliders = this.handleSliders.bind(this);
	    this.handleNumberInput = this.handleNumberInput.bind(this);
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
	          _react2.default.createElement('input', { type: 'range', min: '0', max: '127', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    if (el.type == 2) {
	      //type is text input
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
	          null,
	          _react2.default.createElement('input', { type: 'number', min: '0', max: '99', value: el.inputValue, id: i, onChange: this.handleNumberInput })
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
	
	      case 'push-record':
	        socket.emit('midi-cc', { controller: 102, value: 127, channel: 0 });
	        break;
	      case 'push-play':
	        socket.emit('midi-cc', { controller: 104, value: 127, channel: 0 });
	        break;
	      case 'mute-all':
	        socket.emit('midi-program', { number: 126, channel: 0 });
	        break;
	      case 'push-new':
	        socket.emit('midi-program', { number: 110, channel: 0 });
	        break;
	      case 'loop-up':
	        socket.emit('midi-program', { number: 122, channel: 0 });
	        break;
	      case 'loop-down':
	        socket.emit('midi-program', { number: 121, channel: 0 });
	        break;
	      case 'push-reverse':
	        socket.emit('midi-program', { number: 114, channel: 0 });
	        break;
	      case 'push-octave':
	        socket.emit('midi-program', { number: 119, channel: 0 });
	        break;
	      case 'push-mixdown':
	        socket.emit('midi-program', { number: 120, channel: 0 });
	        break;
	      case 'push-punchin':
	        socket.emit('midi-program', { number: 117, channel: 0 });
	        break;
	      case 'select-track-1':
	        socket.emit('midi-program', { number: 106, channel: 0 });
	        break;
	      case 'select-track-2':
	        socket.emit('midi-program', { number: 107, channel: 0 });
	        break;
	      case 'select-track-3':
	        socket.emit('midi-program', { number: 108, channel: 0 });
	        break;
	      case 'select-track-4':
	        socket.emit('midi-program', { number: 109, channel: 0 });
	        break;
	      case 'mute-track-1':
	        socket.emit('midi-program', { number: 101, channel: 0 });
	        break;
	      case 'mute-track-2':
	        socket.emit('midi-program', { number: 102, channel: 0 });
	        break;
	      case 'mute-track-3':
	        socket.emit('midi-program', { number: 103, channel: 0 });
	        break;
	      case 'mute-track-4':
	        socket.emit('midi-program', { number: 104, channel: 0 });
	        break;
	      case 'mute-dry':
	        socket.emit('midi-program', { number: 124, channel: 0 });
	        break;
	      case 'mute-mixdown':
	        socket.emit('midi-program', { number: 123, channel: 0 });
	        break;
	      case 'push-quantize':
	        socket.emit('midi-program', { number: 111, channel: 0 });
	        break;
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = event.target.value;
	    switch (event.target.id) {
	      case 'track-1-level':
	        socket.emit('midi-cc', { controller: 21, value: slider_value, channel: 0 });
	        break;
	      case 'track-2-level':
	        socket.emit('midi-cc', { controller: 22, value: slider_value, channel: 0 });
	        break;
	      case 'track-3-level':
	        socket.emit('midi-cc', { controller: 23, value: slider_value, channel: 0 });
	        break;
	      case 'track-4-level':
	        socket.emit('midi-cc', { controller: 24, value: slider_value, channel: 0 });
	        break;
	      case 'track-1-pan':
	        socket.emit('midi-cc', { controller: 28, value: slider_value, channel: 0 });
	        break;
	      case 'track-2-pan':
	        socket.emit('midi-cc', { controller: 29, value: slider_value, channel: 0 });
	        break;
	      case 'track-3-pan':
	        socket.emit('midi-cc', { controller: 30, value: slider_value, channel: 0 });
	        break;
	      case 'track-4-pan':
	        socket.emit('midi-cc', { controller: 31, value: slider_value, channel: 0 });
	        break;
	      case 'dry-out-level':
	        socket.emit('midi-cc', { controller: 20, value: slider_value, channel: 0 });
	        break;
	      case 'dry-out-pan':
	        socket.emit('midi-cc', { controller: 27, value: slider_value, channel: 0 });
	        break;
	      case 'mix-down-level':
	        socket.emit('midi-cc', { controller: 25, value: slider_value, channel: 0 });
	        break;
	      case 'tempo':
	        socket.emit('midi-cc', { controller: 26, value: slider_value, channel: 0 });
	        break;
	
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	  }
	  handleNumberInput(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let input_value = event.target.value;
	    switch (event.target.id) {
	      case 'loop-input':
	        socket.emit('midi-program', { number: input_value, channel: 0 });
	        break;
	      default:
	        console.log('ERROR: Input does not exist');
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
	              'MIDI Out for Looper: Electro-Harmonix 45000'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock,
	            compactType: this.state.compactType
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
	        i: "push-record",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'RECORD'
	      }, {
	        type: 0,
	        i: "push-play",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'PLAY/STOP'
	      }, {
	        type: 0,
	        i: "push-new",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'NEW LOOP'
	      }, {
	        type: 0,
	        i: "loop-up",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'LOOP UP'
	      }, {
	        type: 0,
	        i: "loop-down",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'LOOP DOWN'
	      }, {
	        type: 2,
	        i: "loop-input",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        text: 'LOOP INPUT'
	      }, {
	        type: 0,
	        i: "push-reverse",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-info',
	        text: 'REVERSE'
	      }, {
	        type: 0,
	        i: "push-octave",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-info',
	        text: 'OCTAVE'
	      }, {
	        type: 0,
	        i: "push-mixdown",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'MIX DOWN'
	      }, {
	        type: 0,
	        i: "push-quantize",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-info',
	        text: 'QUANTIZE'
	      }, {
	        type: 0,
	        i: "push-punchin",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'PUNCH IN'
	      }, {
	        type: 0,
	        i: "mute-all",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'MUTE ALL'
	      }, {
	        type: 0,
	        i: "select-track-1",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Select 1'
	      }, {
	        type: 0,
	        i: "select-track-2",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Select 2'
	      }, {
	        type: 0,
	        i: "select-track-3",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Select 3'
	      }, {
	        type: 0,
	        i: "select-track-4",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Select 4'
	      }, {
	        type: 0,
	        i: "mute-track-1",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Mute 1'
	      }, {
	        type: 0,
	        i: "mute-track-2",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 5, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Mute 2'
	      }, {
	        type: 0,
	        i: "mute-track-3",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 7, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Mute 3'
	      }, {
	        type: 0,
	        i: "mute-track-4",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Mute 4'
	      }, {
	        type: 0,
	        i: "mute-dry",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Mute Dry'
	      }, {
	        type: 0,
	        i: "mute-mixdown",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 13, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Mute Mix'
	      }, {
	        type: 1,
	        i: "track-1-level",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 1 Level'
	      }, {
	        type: 1,
	        i: "track-2-level",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 2 Level'
	      }, {
	        type: 1,
	        i: "track-3-level",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 3 Level'
	      }, {
	        type: 1,
	        i: "track-4-level",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 4 Level'
	      }, {
	        type: 1,
	        i: "track-1-pan",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 1 Pan'
	      }, {
	        type: 1,
	        i: "track-2-pan",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 2 Pan'
	      }, {
	        type: 1,
	        i: "track-3-pan",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 3 Pan'
	      }, {
	        type: 1,
	        i: "track-4-pan",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 4 Pan'
	      }, {
	        type: 1,
	        i: "dry-out-level",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Dry Level'
	      }, {
	        type: 1,
	        i: "dry-out-pan",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Dry Pan'
	      }, {
	        type: 1,
	        i: "mix-down-level",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Mixdown Level'
	      }, {
	        type: 1,
	        i: "tempo",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Tempo'
	      }]
	    });
	  }
	}
	exports.default = MIDILooper;
	MIDILooper.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ })

};
//# sourceMappingURL=0.8c9793784a4a2cf29a59.hot-update.js.map