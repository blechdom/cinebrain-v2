exports.id = 0;
exports.modules = {

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var util = __webpack_require__(9);
	var EventEmitter = __webpack_require__(10).EventEmitter;
	var dmx_usb_pro = __webpack_require__(11);
	console.log("dmx library loaded");
	
	function DMX() {
	
		this.universes = {};
		this.drivers = {};
	
		//this.registerDriver('enttec-usb-dmx-pro',  require('./drivers/enttec-usb-dmx-pro'))
	}
	
	util.inherits(DMX, EventEmitter);
	
	DMX.prototype.registerDriver = function (name, module) {
		this.drivers[name] = module;
	};
	
	DMX.prototype.initializeDMXUSBPRO = function (name, device_id) {
		console.log("add universe in dmx.js");
		return this.universes[name] = new dmx_usb_pro(device_id);
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

/***/ })

};
//# sourceMappingURL=0.2ecb58d55e7891b3853e.hot-update.js.map