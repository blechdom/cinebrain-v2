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
	
		this.registerDriver('null', __webpack_require__(11));
		this.registerDriver('dmx4all', __webpack_require__(12));
		this.registerDriver('enttec-usb-dmx-pro', __webpack_require__(14));
		this.registerDriver('enttec-open-usb-dmx', __webpack_require__(15));
		this.registerDriver('artnet', __webpack_require__(16));
		this.registerDriver('bbdmx', __webpack_require__(18));
	}
	
	util.inherits(DMX, EventEmitter);
	
	DMX.prototype.registerDriver = function (name, module) {
		this.drivers[name] = module;
	};
	
	DMX.prototype.addUniverse = function (name, driver, device_id) {
		console.log("add universe in dmx.js");
		return this.universes[name] = new this.drivers[driver](device_id);
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
//# sourceMappingURL=0.2daa544d3fe93baf213e.hot-update.js.map