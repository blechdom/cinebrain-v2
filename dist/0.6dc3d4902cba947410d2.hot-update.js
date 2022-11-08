exports.id = 0;
exports.modules = {

/***/ 32:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(12);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(33);
	
	var _lodash = __webpack_require__(34);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _lodash3 = __webpack_require__(35);
	
	var _lodash4 = _interopRequireDefault(_lodash3);
	
	var _lodash5 = __webpack_require__(36);
	
	var _lodash6 = _interopRequireDefault(_lodash5);
	
	var _lodash7 = __webpack_require__(37);
	
	var _lodash8 = _interopRequireDefault(_lodash7);
	
	__webpack_require__(24);
	
	var _reactRouter = __webpack_require__(14);
	
	var _reactBootstrap = __webpack_require__(18);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	
	function generateLayout() {
	  return (0, _lodash2.default)((0, _lodash6.default)(0, 25), function (item, i) {
	    var y = Math.ceil(Math.random() * 4) + 1;
	    return {
	      x: (0, _lodash8.default)(0, 5) * 2 % 12,
	      y: Math.floor(i / 6) * y,
	      w: 2,
	      h: y,
	      i: i.toString(),
	      isDraggable: false,
	      sliderValue: 50
	    };
	  });
	}
	
	class ControllerSetup extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      currentBreakpoint: 'lg',
	      compactType: 'vertical',
	      mounted: false,
	      layouts: { lg: this.props.initialLayout }
	    };
	    this.onNewLayout = this.onNewLayout.bind(this);
	  }
	  handleSliderChange(event) {
	
	    // this.setState({sliderValue: event.target.value});
	    // console.log(event.target.id + ': ' + this.state.i + ' ' + this.state.sliderValue);
	  }
	  componentDidMount() {
	    this.setState({
	      mounted: true
	    });
	  }
	
	  generateDOM() {
	
	    const styles = {
	      background: "#eee"
	    };
	
	    return (0, _lodash2.default)(this.state.layouts.lg, (l, i) => {
	      return _react2.default.createElement(
	        'div',
	        { style: styles, key: i, className: 'static' },
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          i
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '1', max: '100', value: this.state.sliderValue, className: 'slider', id: i, ref: i, onChange: this.handleSliderChange })
	        )
	      );
	    });
	  }
	
	  onBreakPointChange(breakpoint) {
	    this.setState({
	      currentBreakPoint: breakpoint
	    });
	  }
	
	  onLayoutChange(layout, layouts) {
	    console.log(layout, layouts);
	  }
	
	  onNewLayout() {
	    this.setState({
	      layouts: {
	        lg: generateLayout()
	      }
	    });
	  }
	
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        'Current Breakpoint: ',
	        this.state.currentBreakpoint,
	        ' (',
	        this.props.cols[this.state.currentBreakpoint],
	        ' columns)'
	      ),
	      _react2.default.createElement(
	        'button',
	        { onClick: this.onNewLayout },
	        'Generate New Layout'
	      ),
	      _react2.default.createElement(
	        ResponsiveReactGridLayout,
	        _extends({}, this.props, {
	          layouts: this.state.layouts,
	          onBreakpointChange: this.onBreakpointChange,
	          onLayoutChange: this.onLayoutChange,
	          measureBeforeMount: false,
	          useCSSTransforms: this.state.mounted }),
	        this.generateDOM()
	      )
	    );
	  }
	}
	exports.default = ControllerSetup;
	ControllerSetup.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  onLayoutChange: function onLayoutChange() {},
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
	  initialLayout: generateLayout()
	};

/***/ })

};
//# sourceMappingURL=0.6dc3d4902cba947410d2.hot-update.js.map