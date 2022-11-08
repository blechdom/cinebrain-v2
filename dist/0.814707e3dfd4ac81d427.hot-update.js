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
	
	var _Diagnostics = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./Diagnostics.jsx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
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

/***/ })

};
//# sourceMappingURL=0.814707e3dfd4ac81d427.hot-update.js.map