exports.id = 0;
exports.modules = {

/***/ 87:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var util = __webpack_require__(9);
	var EventEmitter = __webpack_require__(10).EventEmitter;
	var dmx_usb_pro_driver = __webpack_require__(14);
	console.log("dmx library loaded");
	
	function DMX() {
	
		this.universes = {};
		this.drivers = {};
	
		//	this.registerDriver('null',                require('./drivers/null'))
		//	this.registerDriver('dmx4all',             require('./drivers/dmx4all'))
		this.registerDriver('enttec-usb-dmx-pro', __webpack_require__(14));
		//	this.registerDriver('enttec-open-usb-dmx', require('./drivers/enttec-open-usb-dmx'))
		//	this.registerDriver('artnet',              require('./drivers/artnet'))
		//	this.registerDriver('bbdmx',               require('./drivers/bbdmx'))
	}
	
	util.inherits(DMX, EventEmitter);
	
	DMX.prototype.registerDriver = function (name, module) {
		this.drivers[name] = module;
	};
	
	DMX.prototype.initializeDMXUSBPRO = function (name, device_id) {
		console.log("add universe in dmx.js");
		return this.universes[name] = new this.drivers[dmx_usb_pro_driver](device_id);
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
//# sourceMappingURL=0.2ea235aa2313c704ffad.hot-update.js.map