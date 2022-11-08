exports.id = 0;
exports.modules = {

/***/ 63:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(22);
	
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
	          sliderValue: 0
	        };
	      }),
	      toastVisible: false, toastMessage: '', toastType: 'success',
	      lock: true,
	      compactType: null,
	      instrument_id: "wash_1",
	      dmx_offset: 17,
	      dmx_data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
	      case 'wash_on':
	        dmx_data[0] = 255;
	        socket.emit('dmx-go', { dmx: { 1: 255 }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_off':
	        dmx_data[0] = 0;
	        socket.emit('dmx-go', { dmx: { 1: 0 }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_white':
	        dmx_data[1] = 0;
	        dmx_data[2] = 0;
	        dmx_data[3] = 0;
	        dmx_data[4] = 255;
	        socket.emit('dmx-go', { dmx: { 2: 0, 3: 0, 4: 0, 5: 255 }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_red':
	        dmx_data[1] = 255;
	        dmx_data[2] = 0;
	        dmx_data[3] = 0;
	        dmx_data[4] = 0;
	        socket.emit('dmx-go', { dmx: { 2: 255, 3: 0, 4: 0, 5: 0 }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_green':
	        dmx_data[1] = 0;
	        dmx_data[2] = 255;
	        dmx_data[3] = 0;
	        dmx_data[4] = 0;
	        socket.emit('dmx-go', { dmx: { 2: 0, 3: 255, 4: 0, 5: 0 }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_blue':
	        dmx_data[1] = 0;
	        dmx_data[2] = 0;
	        dmx_data[3] = 255;
	        dmx_data[4] = 0;
	        socket.emit('dmx-go', { dmx: { 2: 0, 3: 0, 4: 255, 5: 0 }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_yellow':
	        dmx_data[1] = 255;
	        dmx_data[2] = 255;
	        dmx_data[3] = 0;
	        dmx_data[4] = 0;
	        socket.emit('dmx-go', { dmx: { 2: 255, 3: 255, 4: 0, 5: 0 }, offset: this.state.dmx_offset });
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
	    this.setState({ dmx_data: dmx_data });
	    console.log("dmx_data: " + this.state.dmx_data);
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = Number(event.target.value);
	    let dmx_data = this.state.dmx_data;
	
	    let items = this.state.items;
	    for (let i = 0; i < items.length; i++) {
	      if (items[i].i == event.target.id) {
	        items[i].sliderValue = slider_value;
	      }
	    }
	    this.setState({ items: items });
	
	    switch (event.target.id) {
	
	      case 'wash_intensity':
	        dmx_data[0] = slider_value;
	        socket.emit('dmx-go', { dmx: { 1: slider_value }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_pan':
	        slider_value = Math.floor(slider_value / 255 * 86 + 42);
	        dmx_data[6] = slider_value;
	        socket.emit('dmx-go', { dmx: { 7: slider_value }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_tilt':
	        slider_value = Math.floor(210 - slider_value / 255 * 86);
	        dmx_data[7] = slider_value;
	        socket.emit('dmx-go', { dmx: { 8: slider_value }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_fine_pan':
	        dmx_data[8] = slider_value;
	        socket.emit('dmx-go', { dmx: { 9: slider_value }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_fine_tilt':
	        dmx_data[9] = slider_value;
	        socket.emit('dmx-go', { dmx: { 10: slider_value }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_zoom':
	        dmx_data[11] = slider_value;
	        socket.emit('dmx-go', { dmx: { 12: slider_value }, offset: this.state.dmx_offset });
	        break;
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	    this.setState({ dmx_data: dmx_data });
	    console.log("dmx_data: " + this.state.dmx_data);
	  }
	  savePreset(preset) {
	    const newDMXPreset = {
	      instrument: this.state.instrument_id, dmx_offset: this.state.dmx_offset, preset_num: preset,
	      dmx_data: this.state.dmx_data
	    };
	    fetch('/api/dmx_presets', {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify(newDMXPreset)
	    }).then(response => {
	      if (response.ok) {
	        response.json().then(updatedIssue => {});
	      } else {
	        response.json().then(error => {
	          this.showError(`Failed to add issue: ${error.message}`);
	        });
	      }
	    }).catch(err => {
	      this.showError(`Error in sending data to server: ${err.message}`);
	    });
	  }
	  /*static dataFetcher({ urlBase, parameters }) {
	     return fetch(`${urlBase || ''}/api/dmx_presets${parameters}`).then(response => {
	       if (!response.ok) return response.json().then(error => Promise.reject(error));
	       return response.json().then(data => ({ dmx_data: data }));
	     });
	   }*/
	  loadPreset(preset) {
	    fetch('/api/dmx_presets', {
	      method: 'GET',
	      headers: { 'Content-Type': 'application/json' }
	      //body: JSON.stringify({ preset_num: preset, instrument_id: this.state.instrument_id, dmx_offset:this.state.dmx_offset }),
	    }).then(response => {
	      if (response.ok) {
	        response.json().then(data => {
	          this.setState({ dmx_data: data.dmx_data });
	        });
	      } else {
	        response.json().then(error => {
	          this.showError(`Failed get preset: ${error.message}`);
	        });
	      }
	    }).catch(err => {
	      this.showError(`Error in sending data to server: ${err.message}`);
	    });
	    /* DMXWashGroup1.dataFetcher({ preset_num: preset, instrument_id: this.state.instrument_id, dmx_offset:this.state.dmx_offset })
	      .then(data => {
	       
	         
	        this.setState({ dmx_data: data.dmx_data });
	      }).catch(err => {
	        this.showError(`Error in fetching data from server: ${err}`);
	      });*/
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
	              'Group 1: Wash LIGHT (',
	              this.state.instrument_id,
	              ') '
	            ),
	            ' DMX OFFSET: ',
	            this.state.dmx_offset
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
//# sourceMappingURL=0.2f3d807089850b79b8a4.hot-update.js.map