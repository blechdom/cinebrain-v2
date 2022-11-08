exports.id = 0;
exports.modules = {

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var util = __webpack_require__(9);
	var EventEmitter = __webpack_require__(10).EventEmitter;
	console.log("dmx library loaded");
	
	function DMX() {
	
		this.universes = {};
		this.drivers = {};
	
		this.registerDriver('null', __webpack_require__(82));
		this.registerDriver('dmx4all', __webpack_require__(83));
		this.registerDriver('enttec-usb-dmx-pro', __webpack_require__(11));
		this.registerDriver('enttec-open-usb-dmx', __webpack_require__(84));
		this.registerDriver('artnet', __webpack_require__(85));
		this.registerDriver('bbdmx', __webpack_require__(86));
	}
	
	util.inherits(DMX, EventEmitter);
	
	DMX.prototype.registerDriver = function (name, module) {
		this.drivers[name] = module;
	};
	
	DMX.prototype.initializeDMXUSBPRO = function (name, device_id) {
		console.log("add universe in dmx.js");
		return this.universes[name] = new this.drivers['enttec-usb-dmx-pro'](device_id);
	};
	
	DMX.prototype.update = function (universe, channels) {
		console.log("update universe to be " + universe + " and channels are " + channels);
		this.universes[universe].update(channels);
		this.emit('update', universe, channels);
	};
	
	DMX.prototype.updateAll = function (universe, value) {
		this.universes[universe].updateAll(value);
		this.emit('updateAll', universe, value);
	};
	
	DMX.prototype.universeToObject = function (universe) {
		var universe = this.universes[universe];
		var u = {};
		for (var i = 0; i < universe.length; i++) {
			u[i] = universe.get(i);
		}
		return u;
	};
	
	module.exports = DMX;

/***/ }),

/***/ 82:
/***/ (function(module, exports) {

	"use strict";
	
	function Null(device_id, options) {
		var self = this;
		options = options || {};
		this.universe = new Buffer(512);
		this.universe.fill(0);
		self.start();
	}
	
	Null.prototype.start = function () {
		var self = this;
		self.timeout = setInterval(function () {
			console.log(self.universe);
		}, 1000);
	};
	
	Null.prototype.stop = function () {
		clearInterval(this.timeout);
	};
	
	Null.prototype.close = function (cb) {
		cb(null);
	};
	
	Null.prototype.update = function (u) {
		for (var c in u) {
			this.universe[c] = u[c];
		}
		console.log(this.universe);
	};
	
	Null.prototype.updateAll = function (v) {
		for (var i = 0; i < 512; i++) {
			this.universe[i] = v;
		}
	};
	
	Null.prototype.get = function (c) {
		return this.universe[c];
	};
	
	module.exports = Null;

/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var SerialPort = __webpack_require__(12);
	
	function DMX4ALL(device_id, options) {
		var self = this;
		options = options || {};
		this.universe = new Buffer(512);
		this.universe.fill(0);
	
		this.dev = new SerialPort(device_id, {
			'baudrate': 38400,
			'databits': 8,
			'stopbits': 1,
			'parity': 'none'
		}, function (err) {
			if (!err) {
				self.send_universe();
			}
		});
		this.dev.on('data', function (data) {
			//process.stdout.write(data.toString('ascii'))
		});
	}
	
	DMX4ALL.prototype.send_universe = function () {
		if (!this.dev.isOpen()) {
			return;
		}
	
		var msg = Buffer(this.universe.length * 3);
		for (var i = 0; i < this.universe.length; i++) {
			msg[i * 3 + 0] = i < 256 ? 0xE2 : 0xE3;
			msg[i * 3 + 1] = i;
			msg[i * 3 + 2] = this.universe[i];
		}
		this.dev.write(msg);
	};
	
	DMX4ALL.prototype.start = function () {};
	DMX4ALL.prototype.stop = function () {};
	
	DMX4ALL.prototype.close = function (cb) {
		this.dev.close(cb);
	};
	
	DMX4ALL.prototype.update = function (u) {
		for (var c in u) {
			this.universe[c] = u[c];
		}
		this.send_universe();
	};
	
	DMX4ALL.prototype.updateAll = function (v) {
		for (var i = 0; i < 512; i++) {
			this.universe[i] = v;
		}
		this.send_universe();
	};
	
	DMX4ALL.prototype.get = function (c) {
		return this.universe[c];
	};
	
	module.exports = DMX4ALL;

/***/ }),

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var SerialPort = __webpack_require__(12);
	
	function EnttecOpenUsbDMX(device_id, options) {
		var self = this;
		options = options || {};
	
		this.universe = new Buffer(512);
		this.universe.fill(0);
	
		self.interval = 46;
	
		this.dev = new SerialPort(device_id, {
			'baudrate': 250000,
			'databits': 8,
			'stopbits': 2,
			'parity': 'none'
		}, function (err) {
			if (err) {
				console.log(err);
				return;
			}
			self.start();
		});
	}
	
	EnttecOpenUsbDMX.prototype.send_universe = function () {
		var self = this;
		if (!this.dev.isOpen()) {
			return;
		}
	
		// toggle break
		self.dev.set({ brk: true }, function (err, r) {
			setTimeout(function () {
				self.dev.set({ brk: false }, function (err, r) {
					setTimeout(function () {
						self.dev.write(Buffer.concat([Buffer([0]), self.universe]));
					}, 1);
				});
			}, 1);
		});
	};
	
	EnttecOpenUsbDMX.prototype.start = function () {
		this.intervalhandle = setInterval(this.send_universe.bind(this), this.interval);
	};
	
	EnttecOpenUsbDMX.prototype.stop = function () {
		clearInterval(this.intervalhandle);
	};
	
	EnttecOpenUsbDMX.prototype.close = function (cb) {
		this.stop();
		this.dev.close(cb);
	};
	
	EnttecOpenUsbDMX.prototype.update = function (u) {
		for (var c in u) {
			this.universe[c] = u[c];
		}
	};
	
	EnttecOpenUsbDMX.prototype.updateAll = function (v) {
		for (var i = 0; i < 512; i++) {
			this.universe[i] = v;
		}
	};
	
	EnttecOpenUsbDMX.prototype.get = function (c) {
		return this.universe[c];
	};
	
	module.exports = EnttecOpenUsbDMX;

/***/ }),

/***/ 85:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var dgram = __webpack_require__(13);
	
	function EnttecODE(device_id, options) {
		var self = this;
	
		self.header = new Buffer([65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14]);
		self.sequence = new Buffer([0]);
		self.physical = new Buffer([0]);
		self.universe_id = new Buffer([0x00, 0x00]);
		self.length = new Buffer([0x02, 0x00]);
	
		self.universe = new Buffer(512);
		self.universe.fill(0);
	
		self.sleepTime = 24;
	
		options = options || {};
		self.universe_id.writeInt16BE(options.universe || 0, 0);
		self.host = device_id || '127.0.0.1';
		self.port = options.port || 6454;
		self.dev = dgram.createSocket('udp4');
		self.start();
	}
	
	EnttecODE.prototype.send_universe = function () {
		var pkg = Buffer.concat([this.header, this.sequence, this.physical, this.universe_id, this.length, this.universe]);
	
		this.dev.send(pkg, 0, pkg.length, this.port, this.host);
	};
	
	EnttecODE.prototype.start = function () {
		this.timeout = setInterval(this.send_universe.bind(this), this.sleepTime);
	};
	
	EnttecODE.prototype.stop = function () {
		clearInterval(this.timeout);
	};
	
	EnttecODE.prototype.close = function (cb) {
		this.stop();
		cb(null);
	};
	
	EnttecODE.prototype.update = function (u) {
		for (var c in u) {
			this.universe[c] = u[c];
		}
	};
	
	EnttecODE.prototype.updateAll = function (v) {
		for (var i = 0; i < 512; i++) {
			this.universe[i] = v;
		}
	};
	
	EnttecODE.prototype.get = function (c) {
		return this.universe[c];
	};
	
	module.exports = EnttecODE;

/***/ }),

/***/ 86:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var dgram = __webpack_require__(13);
	
	function BBDMX(device_id, options) {
		var self = this;
		self.options = options || {};
		self.universe = new Buffer(512);
		self.universe.fill(0);
		self.host = device_id || '127.0.0.1';
		self.port = self.options.port || 9930;
		self.dev = dgram.createSocket('udp4');
		self.sleepTime = 24;
		self.start();
	}
	
	BBDMX.prototype.send_universe = function () {
		var channel;
		var messageBuffer = new Buffer(this.universe.length.toString());
	
		for (var i = 0; i < this.universe.length; i++) {
			channel = new Buffer(' ' + this.universe[i]);
			messageBuffer = Buffer.concat([messageBuffer, channel]);
		}
		this.dev.send(messageBuffer, 0, messageBuffer.length, this.port, this.host);
	};
	
	BBDMX.prototype.start = function () {
		this.timeout = setInterval(this.send_universe.bind(this), this.sleepTime);
	};
	
	BBDMX.prototype.stop = function () {
		clearInterval(this.timeout);
	};
	
	BBDMX.prototype.close = function (cb) {
		this.stop();
		cb(null);
	};
	
	BBDMX.prototype.update = function (u) {
		for (var c in u) {
			this.universe[c] = u[c];
		}
	};
	
	BBDMX.prototype.updateAll = function (v) {
		for (var i = 0; i < 512; i++) {
			this.universe[i] = v;
		}
	};
	
	BBDMX.prototype.get = function (c) {
		return this.universe[c];
	};
	
	module.exports = BBDMX;

/***/ })

};
//# sourceMappingURL=0.c3253864301bb67bf7cc.hot-update.js.map