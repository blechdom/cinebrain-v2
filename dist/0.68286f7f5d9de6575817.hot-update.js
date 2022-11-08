exports.id = 0;
exports.modules = {

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var SerialPort = __webpack_require__(13);
	console.log("enttec driver loaded");
	
	var ENTTEC_PRO_DMX_STARTCODE = 0x00,
	    ENTTEC_PRO_START_OF_MSG = 0x7e,
	    ENTTEC_PRO_END_OF_MSG = 0xe7,
	    ENTTEC_PRO_SEND_DMX_RQ = 0x06,
	    ENTTEC_PRO_RECV_DMX_PKT = 0x05;
	
	function EnttecUSBDMXPRO(device_id, options) {
		var self = this;
		options = options || {};
		this.universe = new Buffer(512);
	
		this.dev = new SerialPort(device_id, {
			'baudrate': 250000,
			'databits': 8,
			'stopbits': 2,
			'parity': 'none'
		}, function (err) {
			console.log("dmx enttec driver device error");
		});
		console.log("in driver: this.dev: " + JSON.stringify(this.dev));
	}
	
	EnttecUSBDMXPRO.prototype.send_universe = function () {
		if (!this.dev.isOpen()) {
			console.log("in driver, this.dev is NOT open");
			return;
		}
		var hdr = Buffer([ENTTEC_PRO_START_OF_MSG, ENTTEC_PRO_SEND_DMX_RQ, this.universe.length + 1 & 0xff, this.universe.length + 1 >> 8 & 0xff, ENTTEC_PRO_DMX_STARTCODE]);
		console.log("in driver hdr: " + JSON.stringify(hdr));
		var msg = Buffer.concat([hdr, this.universe, Buffer([ENTTEC_PRO_END_OF_MSG])]);
		console.log("in driver message: " + JSON.stringify(msg));
		this.dev.write(msg);
	};
	
	EnttecUSBDMXPRO.prototype.start = function () {
		console.log("in driver, start");
	};
	EnttecUSBDMXPRO.prototype.stop = function () {
		console.log("in driver, stop");
	};
	
	EnttecUSBDMXPRO.prototype.close = function (cb) {
		this.dev.close(cb);
		console.log("in driver, close dev");
	};
	
	EnttecUSBDMXPRO.prototype.update = function (u) {
		console.log("in enttec update what is u: " + JSON.stringify(u));
		for (var c in u) {
			this.universe[c] = u[c];
			console.log("c: " + c + " u: " + JSON.stringify(u));
		}
		console.log("update enttec this.universe: " + JSON.stringify(this.universe));
		this.send_universe();
	};
	
	EnttecUSBDMXPRO.prototype.updateAll = function (v) {
		for (var i = 0; i < 512; i++) {
			this.universe[i] = v;
		}
		this.send_universe();
	};
	
	EnttecUSBDMXPRO.prototype.get = function (c) {
		return this.universe[c];
	};
	
	module.exports = EnttecUSBDMXPRO;

/***/ })

};
//# sourceMappingURL=0.68286f7f5d9de6575817.hot-update.js.map