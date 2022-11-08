"use strict"

var DMX = require('dmx');
//var A = DMX.Animation;

var dmx = new DMX();
 var universe = dmx.addUniverse('demo', 'enttec-usb-dmx-pro', 'COM3')
//var universe = dmx.addUniverse('demo', 'null')

var on = false;
setInterval(function(){
  universe.update({
  		1:0,
  		2:0,
  		3:0,
  		4:0,
  		5:0,
  		6:0,
  		7:0,
  		8:0,
  		9:0,
  		10:0,
  		11:0,
  		32:255
  		});
  });
  
//it is just channel:value in a json spit 