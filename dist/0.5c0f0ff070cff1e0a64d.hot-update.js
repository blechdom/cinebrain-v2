exports.id = 0;
exports.modules = [
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _sourceMapSupport = __webpack_require__(2);
	
	var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);
	
	__webpack_require__(3);
	
	var _http = __webpack_require__(4);
	
	var _http2 = _interopRequireDefault(_http);
	
	var _mongodb = __webpack_require__(5);
	
	var _socket = __webpack_require__(6);
	
	var _socket2 = _interopRequireDefault(_socket);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_sourceMapSupport2.default.install();
	
	
	let appModule = __webpack_require__(7);
	let db;
	let server;
	let websocket;
	
	_mongodb.MongoClient.connect('mongodb://localhost/cinebrain').then(connection => {
	  db = connection;
	  server = _http2.default.createServer();
	  appModule.setDb(db);
	  server.on('request', appModule.app);
	  server.listen(3000, () => {
	    console.log('App started on port 3000');
	  });
	  websocket = (0, _socket2.default)(server);
	  websocket.on('connection', socket => {
	    console.log("user connected from: " + socket.id);
	
	    socket.on('disconnect', () => {
	      console.log('user disconnected');
	    });
	    socket.on('diagnostics-button', message => {
	      console.log("and the message is: " + message);
	    });
	    socket.on('device-menu', message => {
	      console.log("the device number is: " + message);
	    });
	  });
	}).catch(error => {
	  console.log('ERROR:', error);
	});
	
	if (true) {
	  module.hot.accept(7, () => {
	    server.removeListener('request', appModule.app);
	    appModule = __webpack_require__(7); // eslint-disable-line
	    appModule.setDb(db);
	    server.on('request', appModule.app);
	  });
	}

/***/ })
];
//# sourceMappingURL=0.5c0f0ff070cff1e0a64d.hot-update.js.map