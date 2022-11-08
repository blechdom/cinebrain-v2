exports.id = 0;
exports.modules = [
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _sourceMapSupport = __webpack_require__(2);
	
	var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);
	
	__webpack_require__(3);
	
	var _http = __webpack_require__(4);
	
	var _http2 = _interopRequireDefault(_http);
	
	var _mongodb = __webpack_require__(5);
	
	var _socket = __webpack_require__(6);
	
	var _socket2 = _interopRequireDefault(_socket);
	
	var _telnetClient = __webpack_require__(7);
	
	var _telnetClient2 = _interopRequireDefault(_telnetClient);
	
	var _dmx_usb_pro = __webpack_require__(8);
	
	var _dmx_usb_pro2 = _interopRequireDefault(_dmx_usb_pro);
	
	var _dgram = __webpack_require__(10);
	
	var _dgram2 = _interopRequireDefault(_dgram);
	
	var _emptyFunction = __webpack_require__(11);
	
	var _emptyFunction2 = _interopRequireDefault(_emptyFunction);
	
	var _atem = __webpack_require__(12);
	
	var _atem2 = _interopRequireDefault(_atem);
	
	var _index = __webpack_require__(13);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_sourceMapSupport2.default.install();
	
	
	let atem1me = new _atem2.default();
	let atemTV1 = new _atem2.default();
	let atemTV2 = new _atem2.default();
	
	//atem1me.connect('192.168.10.240');
	atemTV1.connect('192.168.10.240');
	//atemTV2.connect('192.168.10.242');
	var midiOutA;
	//var midiOutA = new easymidi.Output('MIDIPLUS TBOX 2x2 1');
	
	let appModule = __webpack_require__(14);
	let db;
	let server;
	let websocket;
	let UDPserver;
	let UDPclient;
	
	const PTZ_init = Buffer.from('020000010000000001', 'hex');
	const PTZ_network_setting = Buffer.from('02045d4b9d2eceff1921680102ff255255255000ffrobocam2ff03', 'hex');
	const PTZ_change_IP_Enquiry = Buffer.from('02454e513a6e6574776f726b03ff', 'hex');
	const PTZ_change_IP = Buffer.from('024d41433a30342d35642d34622d39642d32652d6365FF49504144523a3139322e3136382e31302e323030FF4d41534b3a3235352e3235352e302e30FF4e414d453a43414d4552413031FF03', 'hex');
	const PTZ_camera_on = Buffer.from('010000060000000c8101040002ff', 'hex');
	const PTZ_camera_off = Buffer.from('010000060000000c8101040003ff', 'hex');
	
	//atemTV1.on('connect', function() {     
	
	_mongodb.MongoClient.connect('mongodb://localhost/cinebrain').then(connection => {
	  db = connection;
	  server = _http2.default.createServer();
	  appModule.setDb(db);
	  server.on('request', appModule.app);
	  server.listen(80, () => {
	    console.log('App started on port 80');
	  });
	
	  let current_universe_buffer = new Buffer(512);
	  let dmx_usb_pro, current_universe;
	
	  db.collection('last_known_universe', function (err, collection) {
	    collection.findOne({ _id: "last_known_universe" }, { dmx_data: 1, _id: 0 }, function (err, result) {
	      console.log("result " + JSON.stringify(result));
	      current_universe = result.dmx_data;
	      console.log("current_universe is " + JSON.stringify(current_universe.data));
	      current_universe_buffer = Buffer(current_universe.data);
	      dmx_usb_pro = new _dmx_usb_pro2.default('COM3', current_universe_buffer);
	    });
	  });
	
	  //dmx_usb_pro = new DMX('COM3', current_universe);
	
	  UDPserver = _dgram2.default.createSocket('udp4');
	  UDPclient = _dgram2.default.createSocket('udp4');
	
	  UDPserver.on('error', err => {
	    console.log(`UDP server error:\n${err.stack}`);
	    UDPserver.close();
	  });
	
	  UDPserver.on('message', (msg, rinfo) => {
	    console.log(`UDP server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
	  });
	
	  UDPserver.on('listening', () => {
	    const address = '192.168.10.101';
	    console.log(`UDP server listening ${address.address}:${address.port}`);
	  });
	
	  /*UDPclient.send(PTZ_init, 52381, '192.168.0.100', (err) => {
	    console.log("send message " + PTZ_init + " err: " + err);
	    UDPclient.send(PTZ_camera_on, 52381, '192.168.0.100', (err) => {
	      console.log("send message " + PTZ_camera_on + " err: " + err);
	    });
	  });
	  */
	  /* UDPclient.send(PTZ_network_setting, 52380, '192.168.0.100', (err) => {
	     console.log("send message err: " + err);
	   });
	  */
	  UDPserver.bind(62455);
	
	  websocket = (0, _socket2.default)(server);
	  websocket.on('connection', socket => {
	
	    console.log("user connected from: " + socket.id);
	
	    socket.on('disconnect', () => {
	      console.log('user disconnected');
	    });
	    socket.on('diagnostics-send-telnet', function (data) {
	      console.log("received telnet command: " + data.host + ":" + data.port + "-->" + data.command);
	      runTelnet(data.host, data.port, data.command);
	    });
	    socket.on('control-interface-send-telnet', function (data) {
	      console.log("received telnet command: " + data.host + ":" + data.port + "-->" + data.command);
	      runTelnet(data.host, data.port, data.command);
	    });
	    socket.on('atem1me_changeProgramInput', message => {
	      console.log("received atem 1 m/e program input command: " + message);
	      atem1me.changeProgramInput(message);
	    });
	    socket.on('atem1me_changePreviewInput', message => {
	      console.log("received atem 1 m/e preview input command: " + message);
	      atem1me.changePreviewInput(message);
	    });
	    socket.on('atemTV1_changeProgramInput', message => {
	      console.log("received atem TV 1 program input command: " + message);
	      atemTV1.changeProgramInput(message);
	    });
	    socket.on('atemTV1_changePreviewInput', message => {
	      console.log("received atem TV 1 preview input command: " + message);
	      atemTV1.changePreviewInput(message);
	    });
	    socket.on('atemTV1_transition_position', message => {
	      console.log("received atem TV 1 preview input command: " + message);
	      atemTV1.changeTransitionPosition(message);
	    });
	    socket.on('atemTV1_autoTransition', message => {
	      console.log("received atem TV 1 preview input command: " + message);
	      atemTV1.autoTransition();
	    });
	    socket.on('atemTV1_transitionType', message => {
	      console.log("received atem TV 1 preview input command: " + message);
	      atemTV1.changeTransitionType(message);
	    });
	    socket.on('atemTV2_changeProgramInput', message => {
	      console.log("received atem TV 2 program input command: " + message);
	      atemTV2.changeProgramInput(message);
	    });
	    socket.on('atemTV2_changePreviewInput', message => {
	      console.log("received atem TV 2 preview input command: " + message);
	      atemTV2.changePreviewInput(message);
	    });
	    socket.on('atem1me_runMacro', message => {
	      console.log("received atem 1 m/e preview input command: " + message);
	      atem1md.runMacro(2);
	      atem1me.runMacro(message);
	    });
	    socket.on('device-menu', message => {
	      console.log("the device number is: " + message);
	      websocket.sockets.emit("show-parameters", message);
	    });
	    socket.on('parameter-menu', buffer => {
	      console.log("the parameter packet is: " + buffer);
	      websocket.sockets.emit("show-parameter-inputs", buffer);
	    });
	    socket.on('dmx-go', buffer => {
	      dmx_usb_pro.update(buffer.dmx, buffer.offset);
	      console.log("dmx-go: " + JSON.stringify(buffer.dmx));
	      console.log("dmx_usb_pro: " + JSON.stringify(dmx_usb_pro.universe));
	      let updated_dmx = JSON.stringify(dmx_usb_pro.universe);
	      db.collection('last_known_universe').save({ _id: "last_known_universe", dmx_data: JSON.parse(updated_dmx.toString()) });
	    });
	    socket.on('dmx-all', buffer => {
	      dmx_usb_pro.updateAll(buffer);
	    });
	    socket.on('dmx-save-preset', data => {
	      db.collection('dmx_presets').update({ instrument_id: data.instrument_id, preset_num: data.preset_num, dmx_offset: data.dmx_offset }, data, { upsert: true });
	    });
	    socket.on('dmx-load-preset', data => {
	
	      db.collection('dmx_presets', function (err, collection) {
	        collection.findOne({ instrument_id: data.instrument_id, preset_num: data.preset_num, dmx_offset: data.dmx_offset }, function (err, result) {
	          socket.emit('dmx-load-preset-data', result.dmx_data);
	          let DMXArray = result.dmx_data;
	          let DMXObject = {};
	          for (var i = 0, len = DMXArray.length; i < len; i++) {
	            DMXObject[i + 1] = DMXArray[i];
	          }
	          dmx_usb_pro.update(DMXObject, result.dmx_offset);
	        });
	      });
	    });
	    socket.on('ptz-go', function (data) {
	      let UDPmessage = Buffer.from(data.buffer, 'hex');
	      UDPclient.send(PTZ_init, data.port, data.host, err => {
	        UDPclient.send(UDPmessage, data.port, data.host, err => {
	          console.log("send message " + data.buffer + " err: " + err);
	        });
	      });
	    });
	    socket.on('midi-cc', function (data) {
	      midiOutA.send('cc', {
	        controller: data.controller,
	        value: data.value,
	        channel: data.channel
	      });
	    });
	    socket.on('midi-program', function (data) {
	      midiOutA.send('program', {
	        number: data.number,
	        channel: data.channel
	      });
	    });
	
	    const telnetHost = '127.0.0.1';
	    const telnetPort = 5250;
	
	    function runTelnet(telnetHost, telnetPort, command) {
	      var connection = new _telnetClient2.default();
	
	      var params = {
	        host: telnetHost,
	        port: telnetPort,
	        timeout: 1500,
	        negotiationMandatory: false,
	        ors: '\r\n',
	        waitfor: '\n'
	      };
	      connection.on('connect', function () {
	        connection.send(command, function (err, res) {
	          if (err) return err;
	
	          console.log('first message:', res.trim());
	
	          telnetResponse(res);
	
	          connection.send('', {
	            ors: '\r\n',
	            waitfor: '\n'
	          }, function (err, res) {
	            if (err) return err;
	
	            console.log('resp after cmd:', res);
	          });
	        });
	      });
	
	      connection.connect(params);
	    }
	
	    function telnetResponse(res) {
	      websocket.sockets.emit("telnet-response", res);
	    }
	  });
	}).catch(error => {
	  console.log('ERROR:', error);
	});
	
	//});
	
	if (true) {
	  module.hot.accept(14, () => {
	    server.removeListener('request', appModule.app);
	    appModule = __webpack_require__(14); // eslint-disable-line
	    appModule.setDb(db);
	    server.on('request', appModule.app);
	  });
	}

/***/ })
];
//# sourceMappingURL=0.5d37e1a8b80e41884438.hot-update.js.map