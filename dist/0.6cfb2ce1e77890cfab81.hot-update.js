exports.id = 0;
exports.modules = {

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var util = __webpack_require__(9);
	var EventEmitter = __webpack_require__(10).EventEmitter;
	var SerialPort = __webpack_require__(11);
	var enttec = __webpack_require__(81);
	console.log("dmx usb pro library loaded");
	
	var ENTTEC_PRO_DMX_STARTCODE = 0x00,
	    ENTTEC_PRO_START_OF_MSG = 0x7e,
	    ENTTEC_PRO_END_OF_MSG = 0xe7,
	    ENTTEC_PRO_SEND_DMX_RQ = 0x06,
	    ENTTEC_PRO_RECV_DMX_PKT = 0x05;
	
	function DMX(device_id) {
		console.log("initalize dmx usb pro");
		this.dmx_usb_pro = {};
		return this.dmx_usb_pro = new enttec(device_id);
		//this.universe = {};
	}
	
	util.inherits(DMX, EventEmitter);
	
	/*DMX.prototype.initializeDMXUSBPRO = function(device_id) {
		console.log("initalize dmx usb pro");
		return this.universe = new dmx_usb_pro(device_id)
	}
	*/
	DMX.prototype.update = function (universe, channels) {
		console.log("update universe to be " + dmx_usb_pro + " and channels are " + channels);
		this.dmx_usb_pro.update(channels);
		this.emit('update', dmx_usb_pro, channels);
	};
	
	DMX.prototype.updateAll = function (universe, value) {
		this.dmx_usb_pro.updateAll(value);
		this.emit('updateAll', dmx_usb_pro, value);
	};
	
	DMX.prototype.universeToObject = function (universe) {
		//var universe = this.universe
		var u = {};
		for (var i = 0; i < this.dmx_usb_pro.length; i++) {
			u[i] = this.dmx_usb_pro.get(i);
		}
		return u;
	};
	
	module.exports = DMX;

/***/ })

};
//# sourceMappingURL=0.6cfb2ce1e77890cfab81.hot-update.js.map