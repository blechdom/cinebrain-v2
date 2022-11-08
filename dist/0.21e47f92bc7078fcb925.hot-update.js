exports.id = 0;
exports.modules = {

/***/ 62:
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
	
	var _Toast = __webpack_require__(33);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
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
	
	class DMXSpotGroup1 extends _react2.default.Component {
	
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
	      toastVisible: false, toastMessage: '', toastType: 'success',
	      lock: true,
	      compactType: null,
	      instrument_id: "spot_1",
	      dmx_offset: 1,
	      dmx_data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleSliders = this.handleSliders.bind(this);
	    this.savePreset = this.savePreset.bind(this);
	    this.loadPreset = this.loadPreset.bind(this);
	    this.showError = this.showError.bind(this);
	    this.dismissToast = this.dismissToast.bind(this);
	  }
	  showError(message) {
	    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
	  }
	  dismissToast() {
	    this.setState({ toastVisible: false });
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
	          _react2.default.createElement('input', { type: 'range', min: '1', max: '255', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
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
	    let dmx_data = this.state.dmx_data;
	
	    switch (event.target.value) {
	
	      case 'spot_on':
	        dmx_data[5] = 0;
	        dmx_data[6] = 216;
	        dmx_data[7] = 255;
	        socket.emit('dmx-go', { 6: 0, 7: 216, 8: 255 });
	        break;
	      case 'spot_off':
	        dmx_data[6] = 0;
	        dmx_data[7] = 0;
	        socket.emit('dmx-go', { 7: 0, 8: 0 });
	        break;
	      case 'save_preset_1':
	        this.savePreset(1);
	        break;
	      case 'save_preset_3':
	        this.savePreset(3);
	        break;
	      case 'save_preset_4':
	        this.savePreset(4);
	        break;
	      case 'save_preset_5':
	        this.savePreset(5);
	        break;
	      case 'save_preset_6':
	        this.savePreset(6);
	        break;
	      case 'save_preset_2':
	        this.savePreset(2);
	        break;
	      case 'recall_preset_1':
	        this.loadPreset(1);
	        break;
	      case 'recall_preset_2':
	        this.loadPreset(2);
	        break;
	      case 'recall_preset_3':
	        this.loadPreset(3);
	        break;
	      case 'recall_preset_4':
	        this.loadPreset(4);
	        break;
	      case 'recall_preset_5':
	        this.loadPreset(5);
	        break;
	      case 'recall_preset_6':
	        this.loadPreset(6);
	        break;
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = event.target.value;
	
	    let items = this.state.items;
	    for (let i = 0; i < items.length; i++) {
	      if (items[i].i == event.target.id) {
	        items[i].sliderValue = slider_value;
	      }
	    }
	    this.setState({ items: items });
	
	    switch (event.target.id) {
	      case 'spot_pan':
	        this.setState({ spotPan: slider_value });
	        socket.emit('dmx-go', { 0: slider_value });
	        break;
	      case 'spot_tilt':
	        this.setState({ spotTilt: slider_value });
	        socket.emit('dmx-go', { 1: slider_value });
	        break;
	      case 'spot_speed':
	        this.setState({ spotSpeed: slider_value });
	        socket.emit('dmx-go', { 4: slider_value });
	        break;
	      case 'spot_fine_pan':
	        this.setState({ spotFinePan: slider_value });
	        socket.emit('dmx-go', { 2: slider_value });
	        break;
	      case 'spot_fine_tilt':
	        this.setState({ spotFineTilt: slider_value });
	        socket.emit('dmx-go', { 3: slider_value });
	        break;
	      case 'spot_intensity':
	        this.setState({ spotIntensity: slider_value });
	        socket.emit('dmx-go', { 7: slider_value });
	        break;
	
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	  }
	  savePreset(preset) {
	    let presets = this.state.presets;
	    console.log("save preset " + preset + ": " + presets[preset]);
	    presets[preset].spotIntensity = this.state.spotIntensity;
	    presets[preset].spotPan = this.state.spotPan;
	    presets[preset].spotTilt = this.state.spotTilt;
	    presets[preset].spotFinePan = this.state.spotFinePan;
	    presets[preset].spotFineTilt = this.state.spotFineTilt;
	    presets[preset].spotSpeed = this.state.spotSpeed;
	    this.setState({ presets: presets });
	  }
	  loadPreset(preset) {
	    let items = this.state.items;
	    let presets = this.state.presets;
	    for (let i = 0; i < items.length; i++) {
	      if (items[i].i == "spot_pan") {
	        items[i].sliderValue = presets[preset].spotPan;
	        socket.emit('dmx-go', { 80: presets[preset].spotPan });
	      }
	      if (items[i].i == "spot_tilt") {
	        items[i].sliderValue = presets[preset].spotTilt;
	        socket.emit('dmx-go', { 82: presets[preset].spotTilt });
	      }
	      if (items[i].i == "spot_fine_pan") {
	        items[i].sliderValue = presets[preset].spotFinePan;
	        socket.emit('dmx-go', { 81: presets[preset].spotFinePan });
	      }
	      if (items[i].i == "spot_fine_tilt") {
	        items[i].sliderValue = presets[preset].spotFineTilt;
	        socket.emit('dmx-go', { 83: presets[preset].spotFineTilt });
	      }
	      if (items[i].i == "spot_speed") {
	        items[i].sliderValue = presets[preset].spotSpeed;
	        socket.emit('dmx-go', { 84: presets[preset].spotSpeed });
	      }
	      if (items[i].i == "spot_intensity") {
	        items[i].sliderValue = presets[preset].spotIntensity;
	        socket.emit('dmx-go', { 89: presets[preset].spotIntensity });
	      }
	    }
	    this.setState({ items: items });
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
	              'Group 1: Spot LIGHT'
	            ),
	            ' DMX: 1'
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
	        i: "spot_on",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 2,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Spot On'
	      }, {
	        type: 0,
	        i: "spot_off",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 2,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Spot Off'
	      }, {
	        type: 1,
	        i: "spot_intensity",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Intensity'
	      }, {
	        type: 1,
	        i: "spot_tilt",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Tilt'
	      }, {
	        type: 1,
	        i: "spot_pan",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Pan'
	      }, {
	        type: 1,
	        i: "spot_speed",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Speed'
	      }, {
	        type: 1,
	        i: "spot_fine_tilt",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Fine Tilt'
	      }, {
	        type: 1,
	        i: "spot_fine_pan",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Fine Pan'
	      }, {
	        type: 0,
	        i: "recall_preset_1",
	        x: 0,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 1'
	      }, {
	        type: 0,
	        i: "recall_preset_2",
	        x: 1,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 2'
	      }, {
	        type: 0,
	        i: "recall_preset_3",
	        x: 2,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 3'
	      }, {
	        type: 0,
	        i: "recall_preset_4",
	        x: 3,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 4'
	      }, {
	        type: 0,
	        i: "recall_preset_5",
	        x: 4,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 5'
	      }, {
	        type: 0,
	        i: "recall_preset_6",
	        x: 5,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 6'
	      }, {
	        type: 0,
	        i: "save_preset_1",
	        x: 0,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 1'
	      }, {
	        type: 0,
	        i: "save_preset_2",
	        x: 1,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 2'
	      }, {
	        type: 0,
	        i: "save_preset_3",
	        x: 2,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 3'
	      }, {
	        type: 0,
	        i: "save_preset_4",
	        x: 3,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 4'
	      }, {
	        type: 0,
	        i: "save_preset_5",
	        x: 4,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 5'
	      }, {
	        type: 0,
	        i: "save_preset_6",
	        x: 5,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 6'
	      }],
	      presets: [{
	        spotIntensity: '127',
	        spotPan: '0',
	        spotFinePan: '127',
	        spotTilt: '0',
	        spotFineTilt: '127',
	        spotSpeed: '215'
	      }, {}, {}, {}, {}, {}, {}]
	    });
	  }
	}
	exports.default = DMXSpotGroup1;
	DMXSpotGroup1.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ })

};
//# sourceMappingURL=0.21e47f92bc7078fcb925.hot-update.js.map