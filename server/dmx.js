"use strict"

var util = require('util')
var EventEmitter = require('events').EventEmitter
console.log("dmx library loaded");

function DMX() {

	this.universes = {}
	this.drivers   = {}

	this.registerDriver('null',                require('./drivers/null'))
	this.registerDriver('dmx4all',             require('./drivers/dmx4all'))
	this.registerDriver('enttec-usb-dmx-pro',  require('./drivers/enttec-usb-dmx-pro'))
	this.registerDriver('enttec-open-usb-dmx', require('./drivers/enttec-open-usb-dmx'))
	this.registerDriver('artnet',              require('./drivers/artnet'))
	this.registerDriver('bbdmx',               require('./drivers/bbdmx'))
}

util.inherits(DMX, EventEmitter)

DMX.prototype.registerDriver = function(name, module) {
	this.drivers[name] = module
}

DMX.prototype.addUniverse = function(name, driver, device_id) {
	console.log("add universe in dmx.js");
	return this.universes[name] = new this.drivers[driver](device_id)
}

DMX.prototype.update = function(universe, channels) {
	console.log("update universe to be " + universe + " and channels are " + channels);
	this.universes[universe].update(channels)
	this.emit('update', universe, channels)
}

DMX.prototype.updateAll = function(universe, value) {
	this.universes[universe].updateAll(value)
	this.emit('updateAll', universe, value)
}

DMX.prototype.universeToObject = function(universe) {
	var universe = this.universes[universe]
	var u = {}
	for(var i = 0; i < universe.length; i++) {
		u[i] = universe.get(i)
	}
	return u
}

module.exports = DMX
