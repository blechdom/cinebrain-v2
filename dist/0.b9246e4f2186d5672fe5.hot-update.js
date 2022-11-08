exports.id = 0;
exports.modules = {

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(13);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(15);
	
	var _App = __webpack_require__(18);
	
	var _App2 = _interopRequireDefault(_App);
	
	var _IssueList = __webpack_require__(22);
	
	var _IssueList2 = _interopRequireDefault(_IssueList);
	
	var _IssueEdit = __webpack_require__(27);
	
	var _IssueEdit2 = _interopRequireDefault(_IssueEdit);
	
	var _DeviceList = __webpack_require__(30);
	
	var _DeviceList2 = _interopRequireDefault(_DeviceList);
	
	var _DeviceEdit = __webpack_require__(32);
	
	var _DeviceEdit2 = _interopRequireDefault(_DeviceEdit);
	
	var _ControllersSetup = __webpack_require__(33);
	
	var _ControllersSetup2 = _interopRequireDefault(_ControllersSetup);
	
	var _NewControllers = __webpack_require__(39);
	
	var _NewControllers2 = _interopRequireDefault(_NewControllers);
	
	var _ControlInterface = __webpack_require__(57);
	
	var _ControlInterface2 = _interopRequireDefault(_ControlInterface);
	
	var _Diagnostics = __webpack_require__(50);
	
	var _Diagnostics2 = _interopRequireDefault(_Diagnostics);
	
	var _Help = __webpack_require__(53);
	
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
	  _react2.default.createElement(_reactRouter.IndexRedirect, { to: '/controllers' }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'control_interface', component: _ControlInterface2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'randomizer', component: _ControllersSetup2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'new_controllers', component: _NewControllers2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'issues', component: (0, _reactRouter.withRouter)(_IssueList2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'issues/:id', component: _IssueEdit2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'devices', component: (0, _reactRouter.withRouter)(_DeviceList2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'devices/:id', component: _DeviceEdit2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'diagnostics', component: _Diagnostics2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'help', component: (0, _reactRouter.withRouter)(_Help2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: '*', component: NoMatch })
	);

/***/ }),

/***/ 57:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(13);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(34);
	
	var _reactDom = __webpack_require__(40);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(41);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(23);
	
	var _reactBootstrap = __webpack_require__(19);
	
	var _lock = __webpack_require__(42);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(43);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _fileUpload = __webpack_require__(44);
	
	var _fileUpload2 = _interopRequireDefault(_fileUpload);
	
	var _fileDownload = __webpack_require__(45);
	
	var _fileDownload2 = _interopRequireDefault(_fileDownload);
	
	var _edit = __webpack_require__(46);
	
	var _edit2 = _interopRequireDefault(_edit);
	
	var _close = __webpack_require__(47);
	
	var _close2 = _interopRequireDefault(_close);
	
	var _Toast = __webpack_require__(26);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	var _AddController = __webpack_require__(48);
	
	var _AddController2 = _interopRequireDefault(_AddController);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	
	const DeviceRow = props => {
	  return _react2.default.createElement(
	    'option',
	    { value: props.device.device_number },
	    props.device.name
	  );
	};
	
	DeviceRow.propTypes = {
	  device: _react2.default.PropTypes.object.isRequired
	};
	
	function DeviceTable(props) {
	  const deviceRows = props.devices.map(device => _react2.default.createElement(DeviceRow, { key: device._id, device: device }));
	  return _react2.default.createElement(
	    _reactBootstrap.FormControl,
	    { componentClass: 'select',
	      onChange: props.onDeviceSelect },
	    deviceRows
	  );
	}
	
	DeviceTable.propTypes = {
	  devices: _react2.default.PropTypes.array.isRequired,
	  onDeviceSelect: _react2.default.PropTypes.func.isRequired
	};
	
	class NewControllers extends _react2.default.Component {
	
	  static dataFetcher(_ref) {
	    let urlBase = _ref.urlBase,
	        location = _ref.location;
	
	    return fetch(`${urlBase || ''}/api/devices${location.search}`).then(response => {
	      if (!response.ok) return response.json().then(error => Promise.reject(error));
	      return response.json().then(data => ({ NewControllers: data }));
	    });
	  }
	
	  constructor(props, context) {
	    super(props, context);
	    const devices = context.initialState.NewControllers ? context.initialState.NewControllers.records : [];
	    this.state = {
	      devices: devices,
	      toastVisible: false,
	      toastMessage: '',
	      toastType: 'success',
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
	      buttonCounter: 0,
	      sliderCounter: 0,
	      xyCounter: 0,
	      lock: true
	    };
	    this.onAddButton = this.onAddButton.bind(this);
	    this.onAddSlider = this.onAddSlider.bind(this);
	    this.onAddXY = this.onAddXY.bind(this);
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.onEditItem = this.onEditItem.bind(this);
	    this.handleSliderChange = this.handleSliderChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleOnDownload = this.handleOnDownload.bind(this);
	    this.handleOnUpload = this.handleOnUpload.bind(this);
	    this.showError = this.showError.bind(this);
	    this.dismissToast = this.dismissToast.bind(this);
	  }
	  componentDidMount() {
	    this.loadData();
	  }
	
	  componentDidUpdate(prevProps) {
	    const oldQuery = prevProps.location.query;
	    const newQuery = this.props.location.query;
	    if (oldQuery.status === newQuery.status && oldQuery.effort_gte === newQuery.effort_gte && oldQuery.effort_lte === newQuery.effort_lte) {
	      return;
	    }
	    this.loadData();
	  }
	  showError(message) {
	    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
	  }
	
	  dismissToast() {
	    this.setState({ toastVisible: false });
	  }
	
	  loadData() {
	    NewControllers.dataFetcher({ location: this.props.location }).then(data => {
	      const devices = data.NewControllers.records;
	      devices.forEach(device => {
	        device.created = new Date(device.created);
	        if (device.completionDate) {
	          device.completionDate = new Date(device.completionDate);
	        }
	      });
	      this.setState({ devices: devices });
	    }).catch(err => {
	      this.showError(`Error in fetching data from server: ${err}`);
	    });
	  }
	
	  handleSliderChange(event) {
	    //not updating correct object
	    this.setState({ sliderValue: event.target.value });
	    console.log(event.target.id + ': ' + this.state.sliderValue);
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
	  handleOnDownload() {
	    console.log("download file with data to be loaded again later ");
	  }
	  handleOnUpload() {
	    console.log("upload previously saved file to use");
	  }
	  createElement(el) {
	    const removeStyle = {
	      position: "absolute",
	      right: "2px",
	      top: 0,
	      cursor: "pointer"
	    };
	    const editStyle = {
	      position: "absolute",
	      right: "2px",
	      bottom: 0,
	      cursor: "pointer"
	    };
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
	      background: "#EEE"
	    };
	    const i = el.add ? "+" : el.i;
	    let typeCode = _react2.default.createElement(
	      'button',
	      null,
	      i
	    );
	    if (el.type == 1) {
	      //type is slider
	      typeCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          i
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '1', max: '100', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliderChange })
	        )
	      );
	    } else if (el.type == 2) {
	      //type is xy area
	      typeCode = _react2.default.createElement(
	        'span',
	        { className: 'text' },
	        i
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      typeCode,
	      _react2.default.createElement(
	        'span',
	        { style: lockStyle },
	        _react2.default.createElement(
	          'span',
	          { className: 'edit',
	            onClick: this.onEditItem.bind(this, i) },
	          _react2.default.createElement(_edit2.default, null)
	        ),
	        _react2.default.createElement(
	          'span',
	          { className: 'remove',
	            onClick: this.onRemoveItem.bind(this, i) },
	          _react2.default.createElement(_close2.default, null)
	        )
	      )
	    );
	  }
	
	  onAddButton() {
	
	    console.log("adding ", "button " + this.state.buttonCounter);
	    this.setState({
	      items: this.state.items.concat({
	        type: 0,
	        i: "button-" + this.state.buttonCounter,
	        x: this.state.items.length * 2 % (this.state.cols || 12),
	        y: Infinity,
	        w: 2,
	        h: 2
	      }),
	      buttonCounter: this.state.buttonCounter + 1
	    });
	  }
	  onAddSlider() {
	    console.log("adding ", "slider " + this.state.sliderCounter);
	    this.setState({
	      items: this.state.items.concat({
	        type: 1,
	        i: "slider-" + this.state.sliderCounter,
	        x: this.state.items.length * 2 % (this.state.cols || 12),
	        y: Infinity,
	        w: 2,
	        h: 2
	      }),
	      sliderCounter: this.state.sliderCounter + 1
	    });
	  }
	  onAddXY() {
	    console.log("adding ", "xy " + this.state.xyCounter);
	    this.setState({
	      items: this.state.items.concat({
	        type: 2,
	        i: "xy-" + this.state.xyCounter,
	        x: this.state.items.length * 2 % (this.state.cols || 12),
	        y: Infinity,
	        w: 2,
	        h: 2
	      }),
	      xyCounter: this.state.xyCounter + 1
	    });
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
	  onRemoveItem(i) {
	    console.log("removing", i);
	    this.setState({ items: _lodash2.default.reject(this.state.items, { i: i }) });
	  }
	  onEditItem(i) {
	    console.log("edit item: " + i);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        _reactBootstrap.Row,
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          { xs: 6, sm: 3, md: 2, lg: 1 },
	          _react2.default.createElement(_AddController2.default, null),
	          _react2.default.createElement(DeviceTable, { devices: this.state.devices, onDeviceSelect: this.onAddButton }),
	          _react2.default.createElement(_Toast2.default, {
	            showing: this.state.toastVisible, message: this.state.toastMessage,
	            onDismiss: this.dismissToast, bsStyle: this.state.toastType
	          })
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          { xs: 6, sm: 3, md: 2, lg: 1 },
	          _react2.default.createElement(
	            'button',
	            { onClick: this.onAddSlider },
	            'Add Slider'
	          ),
	          _react2.default.createElement(
	            'button',
	            { onClick: this.onAddXY },
	            'Add X/Y Area'
	          )
	        ),
	        _react2.default.createElement(_reactBootstrap.Col, { xs: 6, sm: 3, md: 2, lg: 1 }),
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          { xs: 6, sm: 3, md: 2, lg: 1 },
	          _react2.default.createElement(
	            'button',
	            { className: 'pull-right', onClick: this.handleOnLock },
	            lockIcon
	          ),
	          _react2.default.createElement(
	            'button',
	            { className: 'pull-right', onClick: this.handleOnDownload },
	            _react2.default.createElement(_fileDownload2.default, null)
	          ),
	          _react2.default.createElement(
	            'button',
	            { className: 'pull-right', onClick: this.handleOnUpload },
	            _react2.default.createElement(_fileUpload2.default, null)
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
	    );
	  }
	}
	exports.default = NewControllers;
	NewControllers.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};
	NewControllers.propTypes = {
	  location: _react2.default.PropTypes.object.isRequired,
	  router: _react2.default.PropTypes.object
	};
	
	NewControllers.contextTypes = {
	  initialState: _react2.default.PropTypes.object
	};

/***/ })

};
//# sourceMappingURL=0.b9246e4f2186d5672fe5.hot-update.js.map