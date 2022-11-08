exports.id = 0;
exports.modules = {

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var util = __webpack_require__(9);
	var EventEmitter = __webpack_require__(10).EventEmitter;
	var SerialPort = __webpack_require__(11);
	var enttec = __webpack_require__(12);
	console.log("dmx usb pro library loaded");
	
	var ENTTEC_PRO_DMX_STARTCODE = 0x00,
	    ENTTEC_PRO_START_OF_MSG = 0x7e,
	    ENTTEC_PRO_END_OF_MSG = 0xe7,
	    ENTTEC_PRO_SEND_DMX_RQ = 0x06,
	    ENTTEC_PRO_RECV_DMX_PKT = 0x05;
	
	function DMX(device_id) {
		console.log("initalizing dmx usb pro...");
		var self = this;
		this.universe = new Buffer(512);
		//this.dmx_usb_pro = {};
	
		this.dev = new SerialPort(device_id, {
			'baudrate': 250000,
			'databits': 8,
			'stopbits': 2,
			'parity': 'none'
		}, function (err) {
			console.log("dmx enttec driver device error");
		});
		console.log("in driver: this.dev: " + JSON.stringify(this.dev));
	
		//return this.dmx_usb_pro = new enttec(device_id)
	}
	
	util.inherits(DMX, EventEmitter);
	
	DMX.prototype.send_universe = function () {
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
	
	DMX.prototype.start = function () {
		console.log("in driver, start");
	};
	DMX.prototype.stop = function () {
		console.log("in driver, stop");
	};
	
	DMX.prototype.close = function (cb) {
		this.dev.close(cb);
		console.log("in driver, close dev");
	};
	
	DMX.prototype.update = function (u) {
		console.log("update universe to be " + dmx_usb_pro + " and channels are " + u);
		//this.dmx_usb_pro.update(channels)
		for (var c in u) {
			this.universe[c] = u[c];
			console.log("c: " + c + " u: " + JSON.stringify(u));
		}
		console.log("update enttec this.universe: " + JSON.stringify(this.universe));
		this.send_universe();
		//this.emit('update', DMX, channels)
	};
	
	DMX.prototype.updateAll = function (v) {
		//this.dmx_usb_pro.updateAll(value)
		//this.emit('updateAll', DMX, value)
		for (var i = 0; i < 512; i++) {
			this.universe[i] = v;
		}
		this.send_universe();
	};
	
	DMX.prototype.universeToObject = function (dmx_usb_pro) {
		//var universe = this.universe
		var u = {};
		for (var i = 0; i < this.dmx_usb_pro.length; i++) {
			u[i] = this.get(i);
		}
		return u;
	};
	
	DMX.prototype.get = function (c) {
		return this.universe[c];
	};
	
	module.exports = DMX;

/***/ })

};
//# sourceMappingURL=0.f8e103e57da82cf682d5.hot-update.js.map