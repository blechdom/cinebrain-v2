exports.id = 0;
exports.modules = {

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(12);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(14);
	
	var _App = __webpack_require__(17);
	
	var _App2 = _interopRequireDefault(_App);
	
	var _IssueList = __webpack_require__(23);
	
	var _IssueList2 = _interopRequireDefault(_IssueList);
	
	var _IssueEdit = __webpack_require__(26);
	
	var _IssueEdit2 = _interopRequireDefault(_IssueEdit);
	
	var _DeviceList = __webpack_require__(29);
	
	var _DeviceList2 = _interopRequireDefault(_DeviceList);
	
	var _DeviceEdit = __webpack_require__(31);
	
	var _DeviceEdit2 = _interopRequireDefault(_DeviceEdit);
	
	var _ControllersSetup = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./ControllersSetup.jsx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	var _ControllersSetup2 = _interopRequireDefault(_ControllersSetup);
	
	var _NewControllers = __webpack_require__(38);
	
	var _NewControllers2 = _interopRequireDefault(_NewControllers);
	
	var _Help = __webpack_require__(42);
	
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
	  _react2.default.createElement(_reactRouter.Route, { path: 'controllers', component: _ControllersSetup2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'new_controllers', component: _NewControllers2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'issues', component: (0, _reactRouter.withRouter)(_IssueList2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'issues/:id', component: _IssueEdit2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'devices', component: (0, _reactRouter.withRouter)(_DeviceList2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'devices/:id', component: _DeviceEdit2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'help', component: (0, _reactRouter.withRouter)(_Help2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: '*', component: NoMatch })
	);

/***/ })

};
//# sourceMappingURL=0.228f932c30153335607c.hot-update.js.map