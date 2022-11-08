exports.id = 0;
exports.modules = {

/***/ 71:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(28);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(30);
	
	var _reactGridLayout = __webpack_require__(50);
	
	var _reactDom = __webpack_require__(51);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(52);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(38);
	
	var _Toast = __webpack_require__(41);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	var _reactBootstrap = __webpack_require__(34);
	
	var _lock = __webpack_require__(53);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(54);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(65);
	
	var _socket2 = __webpack_require__(62);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class DMXWashGroup1 extends _react2.default.Component {
	
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
	          washColor: { 17: 0, 18: 0, 19: 0, 20: 255 }
	        };
	      }),
	      toastVisible: false, toastMessage: '', toastType: 'success',
	      lock: true,
	      compactType: null,
	      washIntensity: '127',
	      washPan: '0',
	      washFinePan: '127',
	      washTilt: '0',
	      washFineTilt: '127',
	      washZoom: '0',
	      washColor: { 17: 0, 18: 0, 19: 0, 20: 255 },
	      presets: [].map(function (i, key, list) {
	        return {
	          i: i.toString(),
	          washIntensity: '127',
	          washPan: '0',
	          washFinePan: '127',
	          washTilt: '0',
	          washFineTilt: '127',
	          washZoom: '0',
	          washColor: { 17: 0, 18: 0, 19: 0, 20: 255 },
	          add: i === (list.length - 1).toString()
	        };
	      })
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
	
	    switch (event.target.value) {
	
	      case 'wash_on':
	        socket.emit('dmx-go', { 16: 255 });
	        break;
	      case 'wash_off':
	        socket.emit('dmx-go', { 16: 0 });
	        break;
	      case 'wash_white':
	        this.setState({ washColor: { 17: 0, 18: 0, 19: 0, 20: 255 } });
	        socket.emit('dmx-go', { 17: 0, 18: 0, 19: 0, 20: 255 });
	        break;
	      case 'wash_red':
	        this.setState({ washColor: { 17: 255, 18: 0, 19: 0, 20: 0 } });
	        socket.emit('dmx-go', { 17: 255, 18: 0, 19: 0, 20: 0 });
	        break;
	      case 'wash_green':
	        this.setState({ washColor: { 17: 0, 18: 255, 19: 0, 20: 0 } });
	        socket.emit('dmx-go', { 17: 0, 18: 255, 19: 0, 20: 0 });
	        break;
	      case 'wash_blue':
	        this.setState({ washColor: { 17: 0, 18: 0, 19: 255, 20: 0 } });
	        socket.emit('dmx-go', { 17: 0, 18: 0, 19: 255, 20: 0 });
	        break;
	      case 'wash_yellow':
	        this.setState({ washColor: { 17: 255, 18: 255, 19: 0, 20: 0 } });
	        socket.emit('dmx-go', { 17: 255, 18: 255, 19: 0, 20: 0 });
	        break;
	      case 'save_preset_1':
	        this.savePreset(1);
	        break;
	      case 'save_preset_2':
	        this.savePreset(2);
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
	
	      case 'wash_intensity':
	        this.setState({ washIntensity: slider_value });
	        socket.emit('dmx-go', { 16: slider_value });
	        break;
	      case 'wash_pan':
	        this.setState({ washPan: slider_value });
	        socket.emit('dmx-go', { 22: slider_value });
	        break;
	      case 'wash_tilt':
	        this.setState({ washTilt: slider_value });
	        socket.emit('dmx-go', { 23: slider_value });
	        break;
	      case 'wash_fine_pan':
	        this.setState({ washFinePan: slider_value });
	        socket.emit('dmx-go', { 24: slider_value });
	        break;
	      case 'wash_fine_tilt':
	        this.setState({ washFineTilt: slider_value });
	        socket.emit('dmx-go', { 25: slider_value });
	        break;
	      case 'wash_zoom':
	        this.setState({ washZoom: slider_value });
	        socket.emit('dmx-go', { 27: slider_value });
	        break;
	
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	  }
	  savePreset(preset) {
	    let presets = this.state.presets;
	    console.log("save preset " + preset + ": " + presets[preset]);
	    presets[preset].washIntensity = this.state.washIntensity;
	    presets[preset].washPan = this.state.washPan;
	    presets[preset].washTilt = this.state.washTilt;
	    presets[preset].washFinePan = this.state.washFinePan;
	    presets[preset].washFineTilt = this.state.washFineTilt;
	    presets[preset].washZoom = this.state.washZoom;
	    presets[preset].washColor = this.state.washColor;
	    this.setState({ presets: presets });
	    const newIssue = {
	      owner: "Preset " + preset, title: "save this",
	      status: "New", created: new Date()
	    };
	    fetch('/api/dmx_presets', {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify(newIssue)
	    }).then(response => {
	      if (response.ok) {
	        response.json().then(updatedIssue => {
	          //success? this.props.router.push(`/issues/${updatedIssue._id}`);
	        });
	      } else {
	        response.json().then(error => {
	          this.showError(`Failed to add issue: ${error.message}`);
	        });
	      }
	    }).catch(err => {
	      this.showError(`Error in sending data to server: ${err.message}`);
	    });
	  }
	  loadPreset(preset) {
	    let items = this.state.items;
	    let presets = this.state.presets;
	    for (let i = 0; i < items.length; i++) {
	      if (items[i].i == "wash_pan") {
	        items[i].sliderValue = presets[preset].washPan;
	        socket.emit('dmx-go', { 22: presets[preset].washPan });
	      }
	      if (items[i].i == "wash_tilt") {
	        items[i].sliderValue = presets[preset].washTilt;
	        socket.emit('dmx-go', { 23: presets[preset].washTilt });
	      }
	      if (items[i].i == "wash_fine_pan") {
	        items[i].sliderValue = presets[preset].washFinePan;
	        socket.emit('dmx-go', { 24: presets[preset].washFinePan });
	      }
	      if (items[i].i == "wash_fine_tilt") {
	        items[i].sliderValue = presets[preset].washFineTilt;
	        socket.emit('dmx-go', { 25: presets[preset].washFineTilt });
	      }
	      if (items[i].i == "wash_zoom") {
	        items[i].sliderValue = presets[preset].washZoom;
	        socket.emit('dmx-go', { 27: presets[preset].washZoom });
	      }
	      if (items[i].i == "wash_intensity") {
	        items[i].sliderValue = presets[preset].washIntensity;
	        socket.emit('dmx-go', { 16: presets[preset].washIntensity });
	      }
	      if (items[i].i == "wash_color") {
	        items[i].sliderValue = presets[preset].washColor;
	        socket.emit('dmx-go', { 16: presets[preset].washColor });
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
	              'Group 1: Wash LIGHT'
	            ),
	            ' DMX: 17'
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            null,
	            _react2.default.createElement(_Toast2.default, {
	              showing: this.state.toastVisible, message: this.state.toastMessage,
	              onDismiss: this.dismissToast, bsStyle: this.state.toastType
	            })
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
	        i: "wash_on",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 2,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Wash On'
	      }, {
	        type: 0,
	        i: "wash_off",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 2,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Wash Off'
	      }, {
	        type: 1,
	        i: "wash_intensity",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Wash Intensity'
	      }, {
	        type: 1,
	        i: "wash_pan",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Wash Pan'
	      }, {
	        type: 1,
	        i: "wash_tilt",
	        x: 0, // (this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, // Infinity,
	        w: 12,
	        h: 2,
	        text: 'Wash Tilt'
	      }, {
	        type: 1,
	        i: "wash_fine_pan",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Wash Fine Pan'
	      }, {
	        type: 1,
	        i: "wash_fine_tilt",
	        x: 0, // (this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, // Infinity,
	        w: 12,
	        h: 2,
	        text: 'Wash Fine Tilt'
	      }, {
	        type: 1,
	        i: "wash_zoom",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Wash Zoom'
	      }, {
	        type: 0,
	        i: "wash_white",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 14, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Wash White'
	      }, {
	        type: 0,
	        i: "wash_red",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 14, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Wash Red'
	      }, {
	        type: 0,
	        i: "wash_green",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 14, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Wash Green'
	      }, {
	        type: 0,
	        i: "wash_blue",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 14, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'Wash Blue'
	      }, {
	        type: 0,
	        i: "wash_yellow",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 14, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Wash Yellow'
	      }, {
	        type: 0,
	        i: "recall_preset_1",
	        x: 0,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 1'
	      }, {
	        type: 0,
	        i: "recall_preset_2",
	        x: 1,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 2'
	      }, {
	        type: 0,
	        i: "recall_preset_3",
	        x: 2,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 3'
	      }, {
	        type: 0,
	        i: "recall_preset_4",
	        x: 3,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 4'
	      }, {
	        type: 0,
	        i: "recall_preset_5",
	        x: 4,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 5'
	      }, {
	        type: 0,
	        i: "recall_preset_6",
	        x: 5,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 6'
	      }, {
	        type: 0,
	        i: "save_preset_1",
	        x: 0,
	        y: 16,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 1'
	      }, {
	        type: 0,
	        i: "save_preset_2",
	        x: 1,
	        y: 16,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 2'
	      }, {
	        type: 0,
	        i: "save_preset_3",
	        x: 2,
	        y: 16,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 3'
	      }, {
	        type: 0,
	        i: "save_preset_4",
	        x: 3,
	        y: 16,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 4'
	      }, {
	        type: 0,
	        i: "save_preset_5",
	        x: 4,
	        y: 16,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 5'
	      }, {
	        type: 0,
	        i: "save_preset_6",
	        x: 5,
	        y: 16,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 6'
	      }],
	      presets: [{
	        washIntensity: '127',
	        washPan: '0',
	        washFinePan: '127',
	        washTilt: '0',
	        washFineTilt: '127',
	        washZoom: '215',
	        washColor: { 17: 0, 18: 0, 19: 255, 20: 0 }
	      }, {}, {}, {}, {}, {}, {}]
	
	    });
	  }
	}
	exports.default = DMXWashGroup1;
	DMXWashGroup1.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ })

};
//# sourceMappingURL=0.db351e415e13cff18954.hot-update.js.map