exports.id = 0;
exports.modules = {

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(22);
	
	var _App = __webpack_require__(25);
	
	var _App2 = _interopRequireDefault(_App);
	
	var _IssueList = __webpack_require__(29);
	
	var _IssueList2 = _interopRequireDefault(_IssueList);
	
	var _IssueEdit = __webpack_require__(34);
	
	var _IssueEdit2 = _interopRequireDefault(_IssueEdit);
	
	var _IssueAddNavItem = __webpack_require__(37);
	
	var _IssueAddNavItem2 = _interopRequireDefault(_IssueAddNavItem);
	
	var _DeviceList = __webpack_require__(38);
	
	var _DeviceList2 = _interopRequireDefault(_DeviceList);
	
	var _DeviceEdit = __webpack_require__(40);
	
	var _DeviceEdit2 = _interopRequireDefault(_DeviceEdit);
	
	var _NewControllers = __webpack_require__(41);
	
	var _NewControllers2 = _interopRequireDefault(_NewControllers);
	
	var _ControlInterface = __webpack_require__(52);
	
	var _ControlInterface2 = _interopRequireDefault(_ControlInterface);
	
	var _Demo = __webpack_require__(58);
	
	var _Demo2 = _interopRequireDefault(_Demo);
	
	var _MediaGroup = __webpack_require__(59);
	
	var _MediaGroup2 = _interopRequireDefault(_MediaGroup);
	
	var _MediaGroup3 = __webpack_require__(60);
	
	var _MediaGroup4 = _interopRequireDefault(_MediaGroup3);
	
	var _MediaGroup5 = __webpack_require__(61);
	
	var _MediaGroup6 = _interopRequireDefault(_MediaGroup5);
	
	var _DMXSpotGroup = __webpack_require__(62);
	
	var _DMXSpotGroup2 = _interopRequireDefault(_DMXSpotGroup);
	
	var _DMXWashGroup = __webpack_require__(63);
	
	var _DMXWashGroup2 = _interopRequireDefault(_DMXWashGroup);
	
	var _DMX155Group = __webpack_require__(64);
	
	var _DMX155Group2 = _interopRequireDefault(_DMX155Group);
	
	var _DMX255Group = __webpack_require__(65);
	
	var _DMX255Group2 = _interopRequireDefault(_DMX255Group);
	
	var _PTZGroup = __webpack_require__(66);
	
	var _PTZGroup2 = _interopRequireDefault(_PTZGroup);
	
	var _PTZGroup3 = __webpack_require__(68);
	
	var _PTZGroup4 = _interopRequireDefault(_PTZGroup3);
	
	var _ATEMGroup = __webpack_require__(69);
	
	var _ATEMGroup2 = _interopRequireDefault(_ATEMGroup);
	
	var _ATEMGroup3 = __webpack_require__(70);
	
	var _ATEMGroup4 = _interopRequireDefault(_ATEMGroup3);
	
	var _ATEMGroup5 = __webpack_require__(71);
	
	var _ATEMGroup6 = _interopRequireDefault(_ATEMGroup5);
	
	var _Diagnostics = __webpack_require__(72);
	
	var _Diagnostics2 = _interopRequireDefault(_Diagnostics);
	
	var _MidiLooper = __webpack_require__(73);
	
	var _MidiLooper2 = _interopRequireDefault(_MidiLooper);
	
	var _Home = __webpack_require__(74);
	
	var _Home2 = _interopRequireDefault(_Home);
	
	var _Help = __webpack_require__(75);
	
	var _Help2 = _interopRequireDefault(_Help);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const NoMatch = () => _react2.default.createElement(
	  'p',
	  null,
	  'Page Not Found'
	);
	
	exports.default = _react2.default.createElement(
	  _reactRouter.Route,
	  { path: '/', component: _App2.default },
	  _react2.default.createElement(_reactRouter.IndexRedirect, { to: '/home' }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'media_group1', component: _MediaGroup2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'media_group2', component: _MediaGroup4.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'media_group3', component: _MediaGroup6.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'demo', component: _Demo2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'dmx_spot_group1', component: _DMXSpotGroup2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'dmx_wash_group1', component: _DMXWashGroup2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'dmx_155_group2', component: _DMX155Group2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'dmx_255_group2', component: _DMX255Group2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'ptz_group1', component: _PTZGroup2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'ptz_group2', component: _PTZGroup4.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'atem_group1', component: _ATEMGroup2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'atem_group2', component: _ATEMGroup4.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'atem_group3', component: _ATEMGroup6.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'midi_looper', component: _MidiLooper2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'control_interface', component: _ControlInterface2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'new_controllers', component: _NewControllers2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'issues', component: (0, _reactRouter.withRouter)(_IssueList2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'issues/:id', component: _IssueEdit2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'issue_add_item', component: _IssueAddNavItem2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'devices', component: (0, _reactRouter.withRouter)(_DeviceList2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'devices/:id', component: _DeviceEdit2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'diagnostics', component: _Diagnostics2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'help', component: (0, _reactRouter.withRouter)(_Help2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'home', component: (0, _reactRouter.withRouter)(_Home2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: '*', component: NoMatch })
	);

/***/ }),

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
	          sliderValue: 0,
	          washColor: { 18: 0, 19: 0, 20: 0, 21: 255 }
	        };
	      }),
	      toastVisible: false, toastMessage: '', toastType: 'success',
	      lock: true,
	      compactType: null,
	      //dmx_data: {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
	      washIntensity: '127',
	      washPan: '0',
	      washFinePan: '127',
	      washTilt: '0',
	      washFineTilt: '127',
	      washZoom: '0',
	      washColor: { 18: 0, 19: 0, 20: 0, 21: 255 },
	      instrument_id: "wash_1",
	      dmx_offset: 17,
	      dmx_data: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0 },
	      presets: [].map(function (i, key, list) {
	        return {
	          i: i.toString(),
	          dmx_data: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0 },
	          washIntensity: '127',
	          washPan: '0',
	          washFinePan: '127',
	          washTilt: '0',
	          washFineTilt: '127',
	          washZoom: '0',
	          washColor: { 18: 0, 19: 0, 20: 0, 21: 255 },
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
	        let dmx_data = this.state.dmx_data;
	        socket.emit('dmx-go', { 17: 255 });
	        console.log("dmx_data: " + dmx_data);
	        break;
	      case 'wash_off':
	        socket.emit('dmx-go', { 17: 0 });
	        break;
	      case 'wash_white':
	        this.setState({ washColor: { 18: 0, 19: 0, 20: 0, 21: 255 } });
	        socket.emit('dmx-go', { 18: 0, 19: 0, 20: 0, 21: 255 });
	        break;
	      case 'wash_red':
	        this.setState({ washColor: { 18: 255, 19: 0, 20: 0, 21: 0 } });
	        socket.emit('dmx-go', { 18: 255, 19: 0, 20: 0, 21: 0 });
	        break;
	      case 'wash_green':
	        this.setState({ washColor: { 18: 0, 19: 255, 20: 0, 21: 0 } });
	        socket.emit('dmx-go', { 18: 0, 19: 255, 20: 0, 21: 0 });
	        break;
	      case 'wash_blue':
	        this.setState({ washColor: { 18: 0, 19: 0, 20: 255, 21: 0 } });
	        socket.emit('dmx-go', { 18: 0, 19: 0, 20: 255, 21: 0 });
	        break;
	      case 'wash_yellow':
	        this.setState({ washColor: { 18: 255, 19: 255, 20: 0, 21: 0 } });
	        socket.emit('dmx-go', { 18: 255, 19: 255, 20: 0, 21: 0 });
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
	        socket.emit('dmx-go', { 17: slider_value });
	        break;
	      case 'wash_pan':
	        this.setState({ washPan: slider_value });
	        socket.emit('dmx-go', { 23: slider_value });
	        break;
	      case 'wash_tilt':
	        this.setState({ washTilt: slider_value });
	        socket.emit('dmx-go', { 24: slider_value });
	        break;
	      case 'wash_fine_pan':
	        this.setState({ washFinePan: slider_value });
	        socket.emit('dmx-go', { 25: slider_value });
	        break;
	      case 'wash_fine_tilt':
	        this.setState({ washFineTilt: slider_value });
	        socket.emit('dmx-go', { 26: slider_value });
	        break;
	      case 'wash_zoom':
	        this.setState({ washZoom: slider_value });
	        socket.emit('dmx-go', { 28: slider_value });
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
	    const newDMXPreset = {
	      instrument: "Monoprice Wash", dmx_offset: 17, preset_num: preset,
	      dmx_data: presets[preset], created: new Date()
	    };
	    fetch('/api/dmx_presets', {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify(newDMXPreset)
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
	        socket.emit('dmx-go', { 23: presets[preset].washPan });
	      }
	      if (items[i].i == "wash_tilt") {
	        items[i].sliderValue = presets[preset].washTilt;
	        socket.emit('dmx-go', { 24: presets[preset].washTilt });
	      }
	      if (items[i].i == "wash_fine_pan") {
	        items[i].sliderValue = presets[preset].washFinePan;
	        socket.emit('dmx-go', { 25: presets[preset].washFinePan });
	      }
	      if (items[i].i == "wash_fine_tilt") {
	        items[i].sliderValue = presets[preset].washFineTilt;
	        socket.emit('dmx-go', { 26: presets[preset].washFineTilt });
	      }
	      if (items[i].i == "wash_zoom") {
	        items[i].sliderValue = presets[preset].washZoom;
	        socket.emit('dmx-go', { 28: presets[preset].washZoom });
	      }
	      if (items[i].i == "wash_intensity") {
	        items[i].sliderValue = presets[preset].washIntensity;
	        socket.emit('dmx-go', { 17: presets[preset].washIntensity });
	      }
	      if (items[i].i == "wash_color") {
	        items[i].sliderValue = presets[preset].washColor;
	        //socket.emit('dmx-go', {17: presets[preset].washColor});
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
//# sourceMappingURL=0.054a50e498f473f0b634.hot-update.js.map