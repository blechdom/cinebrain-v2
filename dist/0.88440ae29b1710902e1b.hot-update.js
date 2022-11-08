exports.id = 0;
exports.modules = {

/***/ 49:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(13);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(40);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(41);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(23);
	
	var _reactBootstrap = __webpack_require__(19);
	
	var _socket = __webpack_require__(52);
	
	var _socket2 = _interopRequireDefault(_socket);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	let socket;
	
	class DeviceMenu extends _react2.default.Component {
	
	  static dataFetcher(_ref) {
	    let urlBase = _ref.urlBase,
	        location = _ref.location;
	
	    return fetch(`${urlBase || ''}/api/devices${location.search}`).then(response => {
	      if (!response.ok) return response.json().then(error => Promise.reject(error));
	      return response.json().then(data => ({ DeviceMenu: data }));
	    });
	  }
	
	  constructor(props, context) {
	    super(props, context);
	    const devices = context.initialState.DeviceMenu ? context.initialState.DeviceMenu.records : [];
	    this.state = {
	      devices: devices
	    };
	    this.deviceOptions = [];
	    this.onDeviceSelect = this.onDeviceSelect.bind(this);
	  }
	  componentDidMount() {
	    this.loadData();
	    socket = (0, _socket2.default)();
	    socket.on(this.props.location.pathname, mesg => {
	      this.setState({ text: mesg });
	    });
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  loadData() {
	    DeviceMenu.dataFetcher({ location: this.props.location }).then(data => {
	      const devices = data.DeviceMenu.records;
	      devices.forEach(device => {
	        this.deviceOptions.push(_react2.default.createElement(
	          'option',
	          { key: device._id, value: device.device_number },
	          device.name
	        ));
	      });
	      this.setState({ devices: devices });
	    }).catch(err => {
	      this.showError(`Error in fetching data from server: ${err}`);
	    });
	  }
	
	  onDeviceSelect(event) {
	    console.log("device #" + event.target.value + " called " + event.target.text);
	    socket.emit('device-menu', event.target.value);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        _reactBootstrap.FormControl,
	        { componentClass: 'select', onChange: this.onDeviceSelect },
	        this.deviceOptions
	      )
	    );
	  }
	}
	exports.default = DeviceMenu;
	DeviceMenu.propTypes = {
	  location: _react2.default.PropTypes.object.isRequired,
	  router: _react2.default.PropTypes.object
	};
	
	DeviceMenu.contextTypes = {
	  initialState: _react2.default.PropTypes.object
	};

/***/ })

};
//# sourceMappingURL=0.88440ae29b1710902e1b.hot-update.js.map