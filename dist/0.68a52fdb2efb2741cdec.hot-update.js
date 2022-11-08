exports.id = 0;
exports.modules = {

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var util = __webpack_require__(9);
	var EventEmitter = __webpack_require__(10).EventEmitter;
	var dmx_usb_pro = __webpack_require__(11);
	console.log("dmx usb pro library loaded");
	
	function DMX() {
		this.universe = {};
		//this.universes = {}
	}
	
	util.inherits(DMX, EventEmitter);
	
	DMX.prototype.initializeDMXUSBPRO = function (device_id) {
		console.log("initalize dmx usb pro");
		return this.universe = new dmx_usb_pro(device_id);
	};
	
	DMX.prototype.update = function (universe, channels) {
		console.log("update universe to be " + universe + " and channels are " + channels);
		this.universe.update(channels);
		this.emit('update', universe, channels);
	};
	
	DMX.prototype.updateAll = function (universe, value) {
		this.universe.updateAll(value);
		this.emit('updateAll', universe, value);
	};
	
	DMX.prototype.universeToObject = function (universe) {
		var universe = this.universe;
		var u = {};
		for (var i = 0; i < universe.length; i++) {
			u[i] = universe.get(i);
		}
		return u;
	};
	
	module.exports = DMX;

/***/ })

};
//# sourceMappingURL=0.68a52fdb2efb2741cdec.hot-update.js.map