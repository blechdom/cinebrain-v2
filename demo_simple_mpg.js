"use strict"

var DMX = require('dmx');
//var A = DMX.Animation;

var dmx = new DMX();
 var universe = dmx.addUniverse('demo', 'enttec-usb-dmx-pro', 'COM3')
//var universe = dmx.addUniverse('demo', 'null')

var on = false;
setInterval(function(){
  universe.update({ //for some weird ass reason each channel in the map is decrement by 1?
  		0:50,
  		1: 100, // tilt wokring on 1? not working
  		//2:120, //suuposed to be tilt
  		5:12, //sets to magenta
  		6:255, //color = white
  		7:255, //shutter open
  		8:127, //intensity
  		//9:127 //gobo wheel open 
  		16:255, //master intensity
  		21:200, //white 100
  		22:15, //pan
  		23:60, //tilt
  		28: 127, //slight beam angle adjust
  		29:255,
  		
  		}); 
  });
  
//it is just channel:value in a json spit 