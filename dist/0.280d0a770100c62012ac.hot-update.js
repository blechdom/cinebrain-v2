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

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setDb = exports.app = undefined;
	
	var _express = __webpack_require__(15);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _bodyParser = __webpack_require__(16);
	
	var _bodyParser2 = _interopRequireDefault(_bodyParser);
	
	var _mongodb = __webpack_require__(5);
	
	var _issue = __webpack_require__(17);
	
	var _issue2 = _interopRequireDefault(_issue);
	
	var _device = __webpack_require__(18);
	
	var _device2 = _interopRequireDefault(_device);
	
	var _renderedPageRouter = __webpack_require__(19);
	
	var _renderedPageRouter2 = _interopRequireDefault(_renderedPageRouter);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const app = (0, _express2.default)();
	
	app.use(_express2.default.static('static'));
	app.use(_bodyParser2.default.json());
	
	let db;
	
	app.get('/api/issues', (req, res) => {
	  const filter = {};
	  if (req.query.status) filter.status = req.query.status;
	  if (req.query.effort_lte || req.query.effort_gte) filter.effort = {};
	  if (req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte, 10);
	  if (req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte, 10);
	
	  db.collection('issues').find(filter).toArray().then(issues => {
	    const metadata = { total_count: issues.length };
	    res.json({ _metadata: metadata, records: issues });
	  }).catch(error => {
	    console.log(error);
	    res.status(500).json({ message: `Internal Server Error: ${error}` });
	  });
	});
	
	app.get('/api/devices', (req, res) => {
	  const filter = {};
	  if (req.query.status) filter.status = req.query.status;
	  if (req.query.effort_lte || req.query.effort_gte) filter.effort = {};
	  if (req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte, 10);
	  if (req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte, 10);
	
	  db.collection('devices').find(filter).toArray().then(devices => {
	    const metadata = { total_count: devices.length };
	    res.json({ _metadata: metadata, records: devices });
	  }).catch(error => {
	    console.log(error);
	    res.status(500).json({ message: `Internal Server Error: ${error}` });
	  });
	});
	
	app.get('/api/device_1_casparcg', (req, res) => {
	  const filter = {};
	  if (req.query.status) filter.status = req.query.status;
	  if (req.query.effort_lte || req.query.effort_gte) filter.effort = {};
	  if (req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte, 10);
	  if (req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte, 10);
	
	  db.collection('device_1_casparcg').find(filter).toArray().then(device_1_casparcg => {
	    const metadata = { total_count: device_1_casparcg.length };
	    res.json({ _metadata: metadata, records: device_1_casparcg });
	  }).catch(error => {
	    console.log(error);
	    res.status(500).json({ message: `Internal Server Error: ${error}` });
	  });
	});
	
	app.get('/api/dmx_presets', (req, res) => {
	  const instrument = req.query.instrument;
	  console.log("instrument is " + instrument);
	  db.collection('dmx_presets').find(instrument).toArray().then(dmx_presets => {
	    const metadata = { total_count: dmx_presets.length };
	    res.json({ _metadata: metadata, records: dmx_presets });
	  }).catch(error => {
	    console.log(error);
	    res.status(500).json({ message: `Internal Server Error: ${error}` });
	  });
	});
	
	app.post('/api/issues', (req, res) => {
	  const newIssue = req.body;
	  newIssue.created = new Date();
	  if (!newIssue.status) {
	    newIssue.status = 'New';
	  }
	
	  const err = _issue2.default.validateIssue(newIssue);
	  if (err) {
	    res.status(422).json({ message: `Invalid request: ${err}` });
	    return;
	  }
	
	  db.collection('issues').insertOne(_issue2.default.cleanupIssue(newIssue)).then(result => db.collection('issues').find({ _id: result.insertedId }).limit(1).next()).then(savedIssue => {
	    res.json(savedIssue);
	  }).catch(error => {
	    console.log(error);
	    res.status(500).json({ message: `Internal Server Error: ${error}` });
	  });
	});
	
	app.post('/api/devices', (req, res) => {
	  const newDevice = req.body;
	  newDevice.created = new Date();
	  if (!newDevice.status) {
	    newDevice.status = 'New';
	  }
	
	  const err = _device2.default.validateDevice(newDevice);
	  if (err) {
	    res.status(422).json({ message: `Invalid request: ${err}` });
	    return;
	  }
	
	  db.collection('devices').insertOne(_device2.default.cleanupDevice(newDevice)).then(result => db.collection('devices').find({ _id: result.insertedId }).limit(1).next()).then(savedDevice => {
	    res.json(savedDevice);
	  }).catch(error => {
	    console.log(error);
	    res.status(500).json({ message: `Internal Server Error: ${error}` });
	  });
	});
	
	app.post('/api/dmx_presets', (req, res) => {
	  const newDMXPreset = req.body;
	  //db.collection('last_known_universe').save({_id:"last_known_universe", dmx_data:JSON.parse(updated_dmx.toString())});
	  db.collection('dmx_presets').update({ instrument: req.body.instrument, preset_num: req.body.preset_num, dmx_offset: req.body.dmx_offset }, newDMXPreset, { upsert: true }).then(result => db.collection('dmx_presets').find({ _id: result.insertedId }).limit(1).next()).then(savedDMXPreset => {
	    res.json(savedDMXPreset);
	  }).catch(error => {
	    console.log(error);
	    res.status(500).json({ message: `Internal Server Error: ${error}` });
	  });
	});
	
	app.get('/api/issues/:id', (req, res) => {
	  let issueId;
	  try {
	    issueId = new _mongodb.ObjectId(req.params.id);
	  } catch (error) {
	    res.status(422).json({ message: `Invalid issue ID format: ${error}` });
	    return;
	  }
	
	  db.collection('issues').find({ _id: issueId }).limit(1).next().then(issue => {
	    if (!issue) res.status(404).json({ message: `No such issue: ${issueId}` });else res.json(issue);
	  }).catch(error => {
	    console.log(error);
	    res.status(500).json({ message: `Internal Server Error: ${error}` });
	  });
	});
	
	app.get('/api/devices/:id', (req, res) => {
	  let deviceId;
	  try {
	    deviceId = new _mongodb.ObjectId(req.params.id);
	  } catch (error) {
	    res.status(422).json({ message: `Invalid device ID format: ${error}` });
	    return;
	  }
	
	  db.collection('devices').find({ _id: deviceId }).limit(1).next().then(device => {
	    if (!device) res.status(404).json({ message: `No such device: ${deviceId}` });else res.json(device);
	  }).catch(error => {
	    console.log(error);
	    res.status(500).json({ message: `Internal Server Error: ${error}` });
	  });
	});
	
	app.put('/api/issues/:id', (req, res) => {
	  let issueId;
	  try {
	    issueId = new _mongodb.ObjectId(req.params.id);
	  } catch (error) {
	    res.status(422).json({ message: `Invalid issue ID format: ${error}` });
	    return;
	  }
	
	  const issue = req.body;
	  delete issue._id;
	
	  const err = _issue2.default.validateIssue(issue);
	  if (err) {
	    res.status(422).json({ message: `Invalid request: ${err}` });
	    return;
	  }
	
	  db.collection('issues').updateOne({ _id: issueId }, _issue2.default.convertIssue(issue)).then(() => db.collection('issues').find({ _id: issueId }).limit(1).next()).then(savedIssue => {
	    res.json(savedIssue);
	  }).catch(error => {
	    console.log(error);
	    res.status(500).json({ message: `Internal Server Error: ${error}` });
	  });
	});
	
	app.put('/api/devices/:id', (req, res) => {
	  let deviceId;
	  try {
	    deviceId = new _mongodb.ObjectId(req.params.id);
	  } catch (error) {
	    res.status(422).json({ message: `Invalid device ID format: ${error}` });
	    return;
	  }
	
	  const device = req.body;
	  delete device._id;
	
	  const err = _device2.default.validateDevice(device);
	  if (err) {
	    res.status(422).json({ message: `Invalid request: ${err}` });
	    return;
	  }
	
	  db.collection('devices').updateOne({ _id: deviceId }, _device2.default.convertDevice(device)).then(() => db.collection('devices').find({ _id: deviceId }).limit(1).next()).then(savedDevice => {
	    res.json(savedDevice);
	  }).catch(error => {
	    console.log(error);
	    res.status(500).json({ message: `Internal Server Error: ${error}` });
	  });
	});
	app.delete('/api/issues/:id', (req, res) => {
	  let issueId;
	  try {
	    issueId = new _mongodb.ObjectId(req.params.id);
	  } catch (error) {
	    res.status(422).json({ message: `Invalid issue ID format: ${error}` });
	    return;
	  }
	
	  db.collection('issues').deleteOne({ _id: issueId }).then(deleteResult => {
	    if (deleteResult.result.n === 1) res.json({ status: 'OK' });else res.json({ status: 'Warning: object not found' });
	  }).catch(error => {
	    console.log(error);
	    res.status(500).json({ message: `Internal Server Error: ${error}` });
	  });
	});
	app.delete('/api/devices/:id', (req, res) => {
	  let deviceId;
	  try {
	    deviceId = new _mongodb.ObjectId(req.params.id);
	  } catch (error) {
	    res.status(422).json({ message: `Invalid device ID format: ${error}` });
	    return;
	  }
	
	  db.collection('devices').deleteOne({ _id: deviceId }).then(deleteResult => {
	    if (deleteResult.result.n === 1) res.json({ status: 'OK' });else res.json({ status: 'Warning: object not found' });
	  }).catch(error => {
	    console.log(error);
	    res.status(500).json({ message: `Internal Server Error: ${error}` });
	  });
	});
	
	app.use('/', _renderedPageRouter2.default);
	
	function setDb(newDb) {
	  db = newDb;
	}
	
	exports.app = app;
	exports.setDb = setDb;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	module.exports = require("express");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = require("body-parser");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	const validIssueStatus = {
	  New: true,
	  Open: true,
	  Assigned: true,
	  Fixed: true,
	  Verified: true,
	  Closed: true
	};
	
	const issueFieldType = {
	  status: 'required',
	  owner: 'required',
	  effort: 'optional',
	  created: 'required',
	  completionDate: 'optional',
	  title: 'required'
	};
	
	function cleanupIssue(issue) {
	  const cleanedUpIssue = {};
	  Object.keys(issue).forEach(field => {
	    if (issueFieldType[field]) cleanedUpIssue[field] = issue[field];
	  });
	  return cleanedUpIssue;
	}
	
	function convertIssue(issue) {
	  if (issue.created) issue.created = new Date(issue.created);
	  if (issue.completionDate) issue.completionDate = new Date(issue.completionDate);
	  return cleanupIssue(issue);
	}
	
	function validateIssue(issue) {
	  const errors = [];
	  Object.keys(issueFieldType).forEach(field => {
	    if (issueFieldType[field] === 'required' && !issue[field]) {
	      errors.push(`Missing mandatory field: ${field}`);
	    }
	  });
	
	  if (!validIssueStatus[issue.status]) {
	    errors.push(`${issue.status} is not a valid status.`);
	  }
	
	  return errors.length ? errors.join('; ') : null;
	}
	
	exports.default = {
	  validateIssue: validateIssue,
	  cleanupIssue: cleanupIssue,
	  convertIssue: convertIssue
	};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	const validDeviceStatus = {
	  _id: true,
	  device_id: true,
	  name: true,
	  core: true,
	  purpose: true,
	  protocol: true,
	  port: true,
	  specification: true,
	  control_types: true,
	  status: true,
	  who: true,
	  notes: true,
	  example_command: true,
	  manual_link: true
	};
	
	const deviceFieldType = {
	  device_id: 'required',
	  name: 'required',
	  purpose: 'optional',
	  control_types: 'optional',
	  status: 'required'
	};
	
	function cleanupDevice(device) {
	  const cleanedUpDevice = {};
	  Object.keys(device).forEach(field => {
	    if (deviceFieldType[field]) cleanedUpDevice[field] = device[field];
	  });
	  return cleanedUpDevice;
	}
	
	function convertDevice(device) {
	  if (device.status) device.status = new Date(device.created);
	  if (device.completionDate) device.completionDate = new Date(device.completionDate);
	  return cleanupDevice(device);
	}
	
	function validateDevice(device) {
	  const errors = [];
	  Object.keys(deviceFieldType).forEach(field => {
	    if (deviceFieldType[field] === 'required' && !device[field]) {
	      errors.push(`Missing mandatory field: ${field}`);
	    }
	  });
	
	  if (!validDeviceStatus[device.status]) {
	    errors.push(`${device.status} is not a valid status.`);
	  }
	
	  return errors.length ? errors.join('; ') : null;
	}
	
	exports.default = {
	  validateDevice: validateDevice,
	  cleanupDevice: cleanupDevice,
	  convertDevice: convertDevice
	};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _server = __webpack_require__(21);
	
	var _reactRouter = __webpack_require__(22);
	
	var _express = __webpack_require__(15);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _template = __webpack_require__(23);
	
	var _template2 = _interopRequireDefault(_template);
	
	var _Routes = __webpack_require__(24);
	
	var _Routes2 = _interopRequireDefault(_Routes);
	
	var _ContextWrapper = __webpack_require__(76);
	
	var _ContextWrapper2 = _interopRequireDefault(_ContextWrapper);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const renderedPageRouter = new _express2.default();
	
	renderedPageRouter.get('*', (req, res) => {
	  (0, _reactRouter.match)({ routes: _Routes2.default, location: req.url }, (error, redirectLocation, renderProps) => {
	    if (error) {
	      res.status(500).send(error.message);
	    } else if (redirectLocation) {
	      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
	    } else if (renderProps) {
	      const componentsWithData = renderProps.components.filter(c => c.dataFetcher);
	      const dataFetchers = componentsWithData.map(c => c.dataFetcher({
	        params: renderProps.params, location: renderProps.location,
	        urlBase: 'http://localhost'
	      }));
	      Promise.all(dataFetchers).then(dataList => {
	        let initialState = {};
	        dataList.forEach(namedData => {
	          initialState = Object.assign(initialState, namedData);
	        });
	        const html = (0, _server.renderToString)(_react2.default.createElement(
	          _ContextWrapper2.default,
	          { initialState: initialState },
	          _react2.default.createElement(_reactRouter.RouterContext, renderProps)
	        ));
	        res.status(200).send((0, _template2.default)(html, initialState));
	      }).catch(err => {
	        console.log(`Error rendering to string: ${err}`);
	      });
	    } else {
	      res.status(404).send('Not found');
	    }
	  });
	});
	
	exports.default = renderedPageRouter;

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	module.exports = require("react");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = require("react-dom/server");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	module.exports = require("react-router");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = template;
	function template(body, initialState) {
	  return `<!DOCTYPE HTML>
	<html>
	<head>
	  <meta charset="UTF-8" />
	  <title>CINEBRAIN</title>
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <link rel="stylesheet" href="/css/bootstrap.min.css" >
	<link rel="stylesheet" href="/css/react-grid-layout-styles.css" >
	  <link rel="stylesheet" href="/css/react-resizable-styles.css" >
	    <link rel="stylesheet" href="/css/slider.css" />
	<style>
	    .panel-title a {display: block; width: 100%; cursor: pointer; }
	  </style>
	</head>
	
	<body>
	  <div id="contents">${body}</div>    <!-- this is where our component will appear -->
	  <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};</script>
	  <script src="/vendor.bundle.js"></script>
	  <script src="/app.bundle.js"></script>
	
	</body>
	
	</html>
	`;
	}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(22);
	
	var _App = __webpack_require__(25);
	
	var _App2 = _interopRequireDefault(_App);
	
	var _IssueList = __webpack_require__(29);
	
	var _IssueList2 = _interopRequireDefault(_IssueList);
	
	var _IssueEdit = __webpack_require__(34);
	
	var _IssueEdit2 = _interopRequireDefault(_IssueEdit);
	
	var _IssueAddNavItem = __webpack_require__(37);
	
	var _IssueAddNavItem2 = _interopRequireDefault(_IssueAddNavItem);
	
	var _DeviceList = __webpack_require__(38);
	
	var _DeviceList2 = _interopRequireDefault(_DeviceList);
	
	var _DeviceEdit = __webpack_require__(40);
	
	var _DeviceEdit2 = _interopRequireDefault(_DeviceEdit);
	
	var _NewControllers = __webpack_require__(41);
	
	var _NewControllers2 = _interopRequireDefault(_NewControllers);
	
	var _ControlInterface = __webpack_require__(52);
	
	var _ControlInterface2 = _interopRequireDefault(_ControlInterface);
	
	var _Demo = __webpack_require__(58);
	
	var _Demo2 = _interopRequireDefault(_Demo);
	
	var _MediaGroup = __webpack_require__(59);
	
	var _MediaGroup2 = _interopRequireDefault(_MediaGroup);
	
	var _MediaGroup3 = __webpack_require__(60);
	
	var _MediaGroup4 = _interopRequireDefault(_MediaGroup3);
	
	var _MediaGroup5 = __webpack_require__(61);
	
	var _MediaGroup6 = _interopRequireDefault(_MediaGroup5);
	
	var _DMXSpotGroup = __webpack_require__(62);
	
	var _DMXSpotGroup2 = _interopRequireDefault(_DMXSpotGroup);
	
	var _DMXWashGroup = __webpack_require__(63);
	
	var _DMXWashGroup2 = _interopRequireDefault(_DMXWashGroup);
	
	var _DMX155Group = __webpack_require__(64);
	
	var _DMX155Group2 = _interopRequireDefault(_DMX155Group);
	
	var _DMX255Group = __webpack_require__(65);
	
	var _DMX255Group2 = _interopRequireDefault(_DMX255Group);
	
	var _PTZGroup = __webpack_require__(66);
	
	var _PTZGroup2 = _interopRequireDefault(_PTZGroup);
	
	var _PTZGroup3 = __webpack_require__(68);
	
	var _PTZGroup4 = _interopRequireDefault(_PTZGroup3);
	
	var _ATEMGroup = __webpack_require__(69);
	
	var _ATEMGroup2 = _interopRequireDefault(_ATEMGroup);
	
	var _ATEMGroup3 = __webpack_require__(70);
	
	var _ATEMGroup4 = _interopRequireDefault(_ATEMGroup3);
	
	var _ATEMGroup5 = __webpack_require__(71);
	
	var _ATEMGroup6 = _interopRequireDefault(_ATEMGroup5);
	
	var _Diagnostics = __webpack_require__(72);
	
	var _Diagnostics2 = _interopRequireDefault(_Diagnostics);
	
	var _MidiLooper = __webpack_require__(73);
	
	var _MidiLooper2 = _interopRequireDefault(_MidiLooper);
	
	var _Home = __webpack_require__(74);
	
	var _Home2 = _interopRequireDefault(_Home);
	
	var _Help = __webpack_require__(75);
	
	var _Help2 = _interopRequireDefault(_Help);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const NoMatch = () => _react2.default.createElement(
	  'p',
	  null,
	  'Page Not Found'
	);
	
	exports.default = _react2.default.createElement(
	  _reactRouter.Route,
	  { path: '/', component: _App2.default },
	  _react2.default.createElement(_reactRouter.IndexRedirect, { to: '/home' }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'media_group1', component: _MediaGroup2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'media_group2', component: _MediaGroup4.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'media_group3', component: _MediaGroup6.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'demo', component: _Demo2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'dmx_spot_group1', component: _DMXSpotGroup2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'dmx_wash_group1', component: _DMXWashGroup2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'dmx_155_group2', component: _DMX155Group2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'dmx_255_group2', component: _DMX255Group2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'ptz_group1', component: _PTZGroup2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'ptz_group2', component: _PTZGroup4.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'atem_group1', component: _ATEMGroup2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'atem_group2', component: _ATEMGroup4.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'atem_group3', component: _ATEMGroup6.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'midi_looper', component: _MidiLooper2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'control_interface', component: _ControlInterface2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'new_controllers', component: _NewControllers2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'issues', component: (0, _reactRouter.withRouter)(_IssueList2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'issues/:id', component: _IssueEdit2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'issue_add_item', component: _IssueAddNavItem2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'devices', component: (0, _reactRouter.withRouter)(_DeviceList2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'devices/:id', component: _DeviceEdit2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'diagnostics', component: _Diagnostics2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'help', component: (0, _reactRouter.withRouter)(_Help2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'home', component: (0, _reactRouter.withRouter)(_Home2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: '*', component: NoMatch })
	);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	__webpack_require__(3);
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _reactRouterBootstrap = __webpack_require__(27);
	
	var _moreVert = __webpack_require__(28);
	
	var _moreVert2 = _interopRequireDefault(_moreVert);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const Header = () => _react2.default.createElement(
	  _reactBootstrap.Navbar,
	  { fluid: true },
	  _react2.default.createElement(
	    _reactBootstrap.Navbar.Header,
	    null,
	    _react2.default.createElement(
	      _reactBootstrap.Navbar.Brand,
	      null,
	      _react2.default.createElement(
	        'a',
	        { href: '/' },
	        'Cinebrain-Presets-Branch'
	      )
	    )
	  ),
	  _react2.default.createElement(
	    _reactBootstrap.Nav,
	    null,
	    _react2.default.createElement(
	      _reactBootstrap.NavDropdown,
	      { id: 'user-dropdown', title: 'Group 1' },
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/dmx_spot_group1' },
	        _react2.default.createElement(
	          _reactBootstrap.NavItem,
	          null,
	          'Spot Light'
	        )
	      ),
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/dmx_wash_group1' },
	        _react2.default.createElement(
	          _reactBootstrap.NavItem,
	          null,
	          'Wash Light'
	        )
	      ),
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/ptz_group1' },
	        _react2.default.createElement(
	          _reactBootstrap.NavItem,
	          null,
	          'Camera'
	        )
	      ),
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/media_group1' },
	        _react2.default.createElement(
	          _reactBootstrap.MenuItem,
	          null,
	          'Media'
	        )
	      )
	    ),
	    _react2.default.createElement(
	      _reactBootstrap.NavDropdown,
	      { id: 'user-dropdown', title: 'Group 2' },
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/dmx_155_group2' },
	        _react2.default.createElement(
	          _reactBootstrap.NavItem,
	          null,
	          'Spot Light 155'
	        )
	      ),
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/dmx_255_group2' },
	        _react2.default.createElement(
	          _reactBootstrap.NavItem,
	          null,
	          'Spot Light 255'
	        )
	      ),
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/ptz_group2' },
	        _react2.default.createElement(
	          _reactBootstrap.NavItem,
	          null,
	          'Camera'
	        )
	      ),
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/media_group2' },
	        _react2.default.createElement(
	          _reactBootstrap.MenuItem,
	          null,
	          'Media'
	        )
	      )
	    ),
	    _react2.default.createElement(
	      _reactBootstrap.NavDropdown,
	      { id: 'user-dropdown', title: 'Extras' },
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/midi_looper' },
	        _react2.default.createElement(
	          _reactBootstrap.NavItem,
	          null,
	          'MIDI Looper'
	        )
	      )
	    )
	  ),
	  _react2.default.createElement(
	    _reactBootstrap.Nav,
	    { pullRight: true },
	    _react2.default.createElement(
	      _reactBootstrap.NavDropdown,
	      { id: 'user-dropdown', title: _react2.default.createElement(_moreVert2.default, { size: 18 }), noCaret: true },
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/diagnostics' },
	        _react2.default.createElement(
	          _reactBootstrap.MenuItem,
	          null,
	          'Diagnostics'
	        )
	      ),
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/control_interface' },
	        _react2.default.createElement(
	          _reactBootstrap.MenuItem,
	          null,
	          'Control Interface'
	        )
	      ),
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/new_controllers' },
	        _react2.default.createElement(
	          _reactBootstrap.MenuItem,
	          null,
	          'New Controllers'
	        )
	      ),
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/devices' },
	        _react2.default.createElement(
	          _reactBootstrap.MenuItem,
	          null,
	          'Devices'
	        )
	      ),
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/issues' },
	        _react2.default.createElement(
	          _reactBootstrap.MenuItem,
	          null,
	          'Issues'
	        )
	      ),
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/issue_add_item' },
	        _react2.default.createElement(
	          _reactBootstrap.MenuItem,
	          null,
	          'Add Issue'
	        )
	      ),
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/help' },
	        _react2.default.createElement(
	          _reactBootstrap.MenuItem,
	          null,
	          'Help'
	        )
	      )
	    )
	  )
	);
	
	const App = props => _react2.default.createElement(
	  'div',
	  null,
	  _react2.default.createElement(Header, null),
	  _react2.default.createElement(
	    'div',
	    { className: 'container-fluid' },
	    props.children,
	    _react2.default.createElement('hr', null)
	  )
	);
	
	App.propTypes = {
	  children: _react2.default.PropTypes.object.isRequired
	};
	
	exports.default = App;

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	module.exports = require("react-bootstrap");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	module.exports = require("react-router-bootstrap");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	module.exports = require("react-icons/lib/md/more-vert");

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(30);
	
	var _reactRouter = __webpack_require__(22);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _trash = __webpack_require__(31);
	
	var _trash2 = _interopRequireDefault(_trash);
	
	var _IssueFilter = __webpack_require__(32);
	
	var _IssueFilter2 = _interopRequireDefault(_IssueFilter);
	
	var _Toast = __webpack_require__(33);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const IssueRow = props => {
	  function onDeleteClick() {
	    props.deleteIssue(props.issue._id);
	  }
	
	  return _react2.default.createElement(
	    'tr',
	    null,
	    _react2.default.createElement(
	      'td',
	      null,
	      _react2.default.createElement(
	        _reactRouter.Link,
	        { to: `/issues/${props.issue._id}` },
	        props.issue._id.substr(-4)
	      )
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.issue.status
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.issue.owner
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.issue.created.toDateString()
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.issue.effort
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.issue.completionDate ? props.issue.completionDate.toDateString() : ''
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.issue.title
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      _react2.default.createElement(
	        _reactBootstrap.Button,
	        { bsSize: 'xsmall', onClick: onDeleteClick },
	        _react2.default.createElement(_trash2.default, null)
	      )
	    )
	  );
	};
	
	IssueRow.propTypes = {
	  issue: _react2.default.PropTypes.object.isRequired,
	  deleteIssue: _react2.default.PropTypes.func.isRequired
	};
	
	function IssueTable(props) {
	  const issueRows = props.issues.map(issue => _react2.default.createElement(IssueRow, { key: issue._id, issue: issue, deleteIssue: props.deleteIssue }));
	  return _react2.default.createElement(
	    _reactBootstrap.Table,
	    { bordered: true, condensed: true, hover: true, responsive: true },
	    _react2.default.createElement(
	      'thead',
	      null,
	      _react2.default.createElement(
	        'tr',
	        null,
	        _react2.default.createElement(
	          'th',
	          null,
	          'Id'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Status'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Owner'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Created'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Effort'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Completion Date'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Title'
	        ),
	        _react2.default.createElement('th', null)
	      )
	    ),
	    _react2.default.createElement(
	      'tbody',
	      null,
	      issueRows
	    )
	  );
	}
	
	IssueTable.propTypes = {
	  issues: _react2.default.PropTypes.array.isRequired,
	  deleteIssue: _react2.default.PropTypes.func.isRequired
	};
	
	class IssueList extends _react2.default.Component {
	  static dataFetcher(_ref) {
	    let urlBase = _ref.urlBase,
	        location = _ref.location;
	
	    return fetch(`${urlBase || ''}/api/issues${location.search}`).then(response => {
	      if (!response.ok) return response.json().then(error => Promise.reject(error));
	      return response.json().then(data => ({ IssueList: data }));
	    });
	  }
	
	  constructor(props, context) {
	    super(props, context);
	    const issues = context.initialState.IssueList ? context.initialState.IssueList.records : [];
	    issues.forEach(issue => {
	      issue.created = new Date(issue.created);
	      if (issue.completionDate) {
	        issue.completionDate = new Date(issue.completionDate);
	      }
	    });
	    this.state = {
	      issues: issues,
	      toastVisible: false, toastMessage: '', toastType: 'success'
	    };
	
	    this.setFilter = this.setFilter.bind(this);
	    this.deleteIssue = this.deleteIssue.bind(this);
	    this.showError = this.showError.bind(this);
	    this.dismissToast = this.dismissToast.bind(this);
	  }
	
	  componentDidMount() {
	    this.loadData();
	  }
	
	  componentDidUpdate(prevProps) {
	    const oldQuery = prevProps.location.query;
	    const newQuery = this.props.location.query;
	    if (oldQuery.status === newQuery.status && oldQuery.effort_gte === newQuery.effort_gte && oldQuery.effort_lte === newQuery.effort_lte) {
	      return;
	    }
	    this.loadData();
	  }
	
	  setFilter(query) {
	    this.props.router.push({ pathname: this.props.location.pathname, query: query });
	  }
	
	  showError(message) {
	    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
	  }
	
	  dismissToast() {
	    this.setState({ toastVisible: false });
	  }
	
	  loadData() {
	    IssueList.dataFetcher({ location: this.props.location }).then(data => {
	      const issues = data.IssueList.records;
	      issues.forEach(issue => {
	        issue.created = new Date(issue.created);
	        if (issue.completionDate) {
	          issue.completionDate = new Date(issue.completionDate);
	        }
	      });
	      this.setState({ issues: issues });
	    }).catch(err => {
	      this.showError(`Error in fetching data from server: ${err}`);
	    });
	  }
	
	  deleteIssue(id) {
	    fetch(`/api/issues/${id}`, { method: 'DELETE' }).then(response => {
	      if (!response.ok) this.showError('Failed to delete issue');else this.loadData();
	    });
	  }
	
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        _reactBootstrap.Panel,
	        { collapsible: true, header: 'Filter' },
	        _react2.default.createElement(_IssueFilter2.default, { setFilter: this.setFilter, initFilter: this.props.location.query })
	      ),
	      _react2.default.createElement(IssueTable, { issues: this.state.issues, deleteIssue: this.deleteIssue }),
	      _react2.default.createElement(_Toast2.default, {
	        showing: this.state.toastVisible, message: this.state.toastMessage,
	        onDismiss: this.dismissToast, bsStyle: this.state.toastType
	      })
	    );
	  }
	}
	
	exports.default = IssueList;
	IssueList.propTypes = {
	  location: _react2.default.PropTypes.object.isRequired,
	  router: _react2.default.PropTypes.object
	};
	
	IssueList.contextTypes = {
	  initialState: _react2.default.PropTypes.object
	};

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	module.exports = require("isomorphic-fetch");

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = require("react-icons/lib/fa/trash");

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactBootstrap = __webpack_require__(26);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class IssueFilter extends _react2.default.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      status: props.initFilter.status || '',
	      effort_gte: props.initFilter.effort_gte || '',
	      effort_lte: props.initFilter.effort_lte || '',
	      changed: false
	    };
	    this.onChangeStatus = this.onChangeStatus.bind(this);
	    this.onChangeEffortGte = this.onChangeEffortGte.bind(this);
	    this.onChangeEffortLte = this.onChangeEffortLte.bind(this);
	    this.applyFilter = this.applyFilter.bind(this);
	    this.resetFilter = this.resetFilter.bind(this);
	    this.clearFilter = this.clearFilter.bind(this);
	  }
	
	  componentWillReceiveProps(newProps) {
	    this.setState({
	      status: newProps.initFilter.status || '',
	      effort_gte: newProps.initFilter.effort_gte || '',
	      effort_lte: newProps.initFilter.effort_lte || '',
	      changed: false
	    });
	  }
	
	  onChangeStatus(e) {
	    this.setState({ status: e.target.value, changed: true });
	  }
	
	  onChangeEffortGte(e) {
	    const effortString = e.target.value;
	    if (effortString.match(/^\d*$/)) {
	      this.setState({ effort_gte: e.target.value, changed: true });
	    }
	  }
	
	  onChangeEffortLte(e) {
	    const effortString = e.target.value;
	    if (effortString.match(/^\d*$/)) {
	      this.setState({ effort_lte: e.target.value, changed: true });
	    }
	  }
	
	  applyFilter() {
	    const newFilter = {};
	    if (this.state.status) newFilter.status = this.state.status;
	    if (this.state.effort_gte) newFilter.effort_gte = this.state.effort_gte;
	    if (this.state.effort_lte) newFilter.effort_lte = this.state.effort_lte;
	    this.props.setFilter(newFilter);
	  }
	
	  clearFilter() {
	    this.props.setFilter({});
	  }
	
	  resetFilter() {
	    this.setState({
	      status: this.props.initFilter.status || '',
	      effort_gte: this.props.initFilter.effort_gte || '',
	      effort_lte: this.props.initFilter.effort_lte || '',
	      changed: false
	    });
	  }
	
	  render() {
	    return _react2.default.createElement(
	      _reactBootstrap.Row,
	      null,
	      _react2.default.createElement(
	        _reactBootstrap.Col,
	        { xs: 6, sm: 4, md: 3, lg: 2 },
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.ControlLabel,
	            null,
	            'Status'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.FormControl,
	            {
	              componentClass: 'select', value: this.state.status,
	              onChange: this.onChangeStatus
	            },
	            _react2.default.createElement(
	              'option',
	              { value: '' },
	              '(Any)'
	            ),
	            _react2.default.createElement(
	              'option',
	              { value: 'New' },
	              'New'
	            ),
	            _react2.default.createElement(
	              'option',
	              { value: 'Open' },
	              'Open'
	            ),
	            _react2.default.createElement(
	              'option',
	              { value: 'Assigned' },
	              'Assigned'
	            ),
	            _react2.default.createElement(
	              'option',
	              { value: 'Fixed' },
	              'Fixed'
	            ),
	            _react2.default.createElement(
	              'option',
	              { value: 'Verified' },
	              'Verified'
	            ),
	            _react2.default.createElement(
	              'option',
	              { value: 'Closed' },
	              'Closed'
	            )
	          )
	        )
	      ),
	      _react2.default.createElement(
	        _reactBootstrap.Col,
	        { xs: 6, sm: 4, md: 3, lg: 2 },
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.ControlLabel,
	            null,
	            'Effort'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.InputGroup,
	            null,
	            _react2.default.createElement(_reactBootstrap.FormControl, { value: this.state.effort_gte, onChange: this.onChangeEffortGte }),
	            _react2.default.createElement(
	              _reactBootstrap.InputGroup.Addon,
	              null,
	              '-'
	            ),
	            _react2.default.createElement(_reactBootstrap.FormControl, { value: this.state.effort_lte, onChange: this.onChangeEffortLte })
	          )
	        )
	      ),
	      _react2.default.createElement(
	        _reactBootstrap.Col,
	        { xs: 6, sm: 4, md: 3, lg: 2 },
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.ControlLabel,
	            null,
	            '\xA0'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.ButtonToolbar,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Button,
	              { bsStyle: 'primary', onClick: this.applyFilter },
	              'Apply'
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Button,
	              { onClick: this.resetFilter, disabled: !this.state.changed },
	              'Reset'
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Button,
	              { onClick: this.clearFilter },
	              'Clear'
	            )
	          )
	        )
	      )
	    );
	  }
	}
	
	exports.default = IssueFilter;
	IssueFilter.propTypes = {
	  setFilter: _react2.default.PropTypes.func.isRequired,
	  initFilter: _react2.default.PropTypes.object.isRequired
	};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactBootstrap = __webpack_require__(26);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class Toast extends _react2.default.Component {
	  componentDidUpdate() {
	    if (this.props.showing) {
	      clearTimeout(this.dismissTimer);
	      this.dismissTimer = setTimeout(this.props.onDismiss, 5000);
	    }
	  }
	
	  componentWillUnmount() {
	    clearTimeout(this.dismissTimer);
	  }
	
	  render() {
	    return _react2.default.createElement(
	      _reactBootstrap.Collapse,
	      { 'in': this.props.showing },
	      _react2.default.createElement(
	        'div',
	        { style: { position: 'fixed', top: 30, left: 0, right: 0, textAlign: 'center' } },
	        _react2.default.createElement(
	          _reactBootstrap.Alert,
	          {
	            style: { display: 'inline-block', width: 500 }, bsStyle: this.props.bsStyle,
	            onDismiss: this.props.onDismiss
	          },
	          this.props.message
	        )
	      )
	    );
	  }
	}
	
	exports.default = Toast;
	Toast.propTypes = {
	  showing: _react2.default.PropTypes.bool.isRequired,
	  onDismiss: _react2.default.PropTypes.func.isRequired,
	  bsStyle: _react2.default.PropTypes.string,
	  message: _react2.default.PropTypes.any.isRequired
	};
	
	Toast.defaultProps = {
	  bsStyle: 'success'
	};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _reactRouterBootstrap = __webpack_require__(27);
	
	var _NumInput = __webpack_require__(35);
	
	var _NumInput2 = _interopRequireDefault(_NumInput);
	
	var _DateInput = __webpack_require__(36);
	
	var _DateInput2 = _interopRequireDefault(_DateInput);
	
	var _Toast = __webpack_require__(33);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class IssueEdit extends _react2.default.Component {
	  static dataFetcher(_ref) {
	    let params = _ref.params,
	        urlBase = _ref.urlBase;
	
	    return fetch(`${urlBase || ''}/api/issues/${params.id}`).then(response => {
	      if (!response.ok) return response.json().then(error => Promise.reject(error));
	      return response.json().then(data => ({ IssueEdit: data }));
	    });
	  }
	
	  constructor(props, context) {
	    super(props, context);
	    let issue;
	    if (context.initialState.IssueEdit) {
	      issue = context.initialState.IssueEdit;
	      issue.created = new Date(issue.created);
	      issue.completionDate = issue.completionDate != null ? new Date(issue.completionDate) : null;
	    } else {
	      issue = {
	        _id: '', title: '', status: '', owner: '', effort: null,
	        completionDate: null, created: null
	      };
	    }
	    this.state = {
	      issue: issue,
	      invalidFields: {}, showingValidation: false,
	      toastVisible: false, toastMessage: '', toastType: 'success'
	    };
	    this.dismissValidation = this.dismissValidation.bind(this);
	    this.showValidation = this.showValidation.bind(this);
	    this.showSuccess = this.showSuccess.bind(this);
	    this.showError = this.showError.bind(this);
	    this.dismissToast = this.dismissToast.bind(this);
	    this.onChange = this.onChange.bind(this);
	    this.onValidityChange = this.onValidityChange.bind(this);
	    this.onSubmit = this.onSubmit.bind(this);
	  }
	
	  componentDidMount() {
	    this.loadData();
	  }
	
	  componentDidUpdate(prevProps) {
	    if (prevProps.params.id !== this.props.params.id) {
	      this.loadData();
	    }
	  }
	
	  onChange(event, convertedValue) {
	    const issue = Object.assign({}, this.state.issue);
	    const value = convertedValue !== undefined ? convertedValue : event.target.value;
	    issue[event.target.name] = value;
	    this.setState({ issue: issue });
	  }
	
	  onValidityChange(event, valid) {
	    const invalidFields = Object.assign({}, this.state.invalidFields);
	    if (!valid) {
	      invalidFields[event.target.name] = true;
	    } else {
	      delete invalidFields[event.target.name];
	    }
	    this.setState({ invalidFields: invalidFields });
	  }
	
	  onSubmit(event) {
	    event.preventDefault();
	    this.showValidation();
	
	    if (Object.keys(this.state.invalidFields).length !== 0) {
	      return;
	    }
	
	    fetch(`/api/issues/${this.props.params.id}`, {
	      method: 'PUT',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify(this.state.issue)
	    }).then(response => {
	      if (response.ok) {
	        response.json().then(updatedIssue => {
	          updatedIssue.created = new Date(updatedIssue.created);
	          if (updatedIssue.completionDate) {
	            updatedIssue.completionDate = new Date(updatedIssue.completionDate);
	          }
	          this.setState({ issue: updatedIssue });
	          this.showSuccess('Updated issue successfully.');
	        });
	      } else {
	        response.json().then(error => {
	          this.showError(`Failed to update issue: ${error.message}`);
	        });
	      }
	    }).catch(err => {
	      this.showError(`Error in sending data to server: ${err.message}`);
	    });
	  }
	
	  loadData() {
	    IssueEdit.dataFetcher({ params: this.props.params }).then(data => {
	      const issue = data.IssueEdit;
	      issue.created = new Date(issue.created);
	      issue.completionDate = issue.completionDate != null ? new Date(issue.completionDate) : null;
	      this.setState({ issue: issue });
	    }).catch(err => {
	      this.showError(`Error in fetching data from server: ${err.message}`);
	    });
	  }
	
	  showValidation() {
	    this.setState({ showingValidation: true });
	  }
	
	  dismissValidation() {
	    this.setState({ showingValidation: false });
	  }
	
	  showSuccess(message) {
	    this.setState({ toastVisible: true, toastMessage: message, toastType: 'success' });
	  }
	
	  showError(message) {
	    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
	  }
	
	  dismissToast() {
	    this.setState({ toastVisible: false });
	  }
	
	  render() {
	    const issue = this.state.issue;
	    let validationMessage = null;
	    if (Object.keys(this.state.invalidFields).length !== 0 && this.state.showingValidation) {
	      validationMessage = _react2.default.createElement(
	        _reactBootstrap.Alert,
	        { bsStyle: 'danger', onDismiss: this.dismissValidation },
	        'Please correct invalid fields before submitting.'
	      );
	    }
	    return _react2.default.createElement(
	      _reactBootstrap.Panel,
	      { header: 'Edit Issue' },
	      _react2.default.createElement(
	        _reactBootstrap.Form,
	        { horizontal: true, onSubmit: this.onSubmit },
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'ID'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(
	              _reactBootstrap.FormControl.Static,
	              null,
	              issue._id
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Created'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(
	              _reactBootstrap.FormControl.Static,
	              null,
	              issue.created ? issue.created.toDateString() : ''
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Status'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(
	              _reactBootstrap.FormControl,
	              {
	                componentClass: 'select', name: 'status', value: issue.status,
	                onChange: this.onChange
	              },
	              _react2.default.createElement(
	                'option',
	                { value: 'New' },
	                'New'
	              ),
	              _react2.default.createElement(
	                'option',
	                { value: 'Open' },
	                'Open'
	              ),
	              _react2.default.createElement(
	                'option',
	                { value: 'Assigned' },
	                'Assigned'
	              ),
	              _react2.default.createElement(
	                'option',
	                { value: 'Fixed' },
	                'Fixed'
	              ),
	              _react2.default.createElement(
	                'option',
	                { value: 'Verified' },
	                'Verified'
	              ),
	              _react2.default.createElement(
	                'option',
	                { value: 'Closed' },
	                'Closed'
	              )
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Owner'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(_reactBootstrap.FormControl, { name: 'owner', value: issue.owner, onChange: this.onChange })
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Effort'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(_reactBootstrap.FormControl, {
	              componentClass: _NumInput2.default, name: 'effort',
	              value: issue.effort, onChange: this.onChange
	            })
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          { validationState: this.state.invalidFields.completionDate ? 'error' : null },
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Completion Date'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(_reactBootstrap.FormControl, {
	              componentClass: _DateInput2.default, name: 'completionDate',
	              value: issue.completionDate, onChange: this.onChange,
	              onValidityChange: this.onValidityChange
	            }),
	            _react2.default.createElement(_reactBootstrap.FormControl.Feedback, null)
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Title'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(_reactBootstrap.FormControl, { name: 'title', value: issue.title, onChange: this.onChange })
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { smOffset: 3, sm: 6 },
	            _react2.default.createElement(
	              _reactBootstrap.ButtonToolbar,
	              null,
	              _react2.default.createElement(
	                _reactBootstrap.Button,
	                { bsStyle: 'primary', type: 'submit' },
	                'Submit'
	              ),
	              _react2.default.createElement(
	                _reactRouterBootstrap.LinkContainer,
	                { to: '/issues' },
	                _react2.default.createElement(
	                  _reactBootstrap.Button,
	                  { bsStyle: 'link' },
	                  'Back'
	                )
	              )
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { smOffset: 3, sm: 9 },
	            validationMessage
	          )
	        )
	      ),
	      _react2.default.createElement(_Toast2.default, {
	        showing: this.state.toastVisible, message: this.state.toastMessage,
	        onDismiss: this.dismissToast, bsStyle: this.state.toastType
	      })
	    );
	  }
	}
	
	exports.default = IssueEdit;
	IssueEdit.propTypes = {
	  params: _react2.default.PropTypes.object.isRequired
	};
	
	IssueEdit.contextTypes = {
	  initialState: _react2.default.PropTypes.object
	};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class NumInput extends _react2.default.Component {
	  constructor(props) {
	    super(props);
	    this.state = { value: this.format(props.value) };
	    this.onBlur = this.onBlur.bind(this);
	    this.onChange = this.onChange.bind(this);
	  }
	
	  componentWillReceiveProps(newProps) {
	    this.setState({ value: this.format(newProps.value) });
	  }
	
	  onBlur(e) {
	    this.props.onChange(e, this.unformat(this.state.value));
	  }
	
	  onChange(e) {
	    if (e.target.value.match(/^\d*$/)) {
	      this.setState({ value: e.target.value });
	    }
	  }
	
	  format(num) {
	    return num != null ? num.toString() : '';
	  }
	
	  unformat(str) {
	    const val = parseInt(str, 10);
	    return isNaN(val) ? null : val;
	  }
	
	  render() {
	    return _react2.default.createElement('input', _extends({
	      type: 'text' }, this.props, { value: this.state.value,
	      onBlur: this.onBlur, onChange: this.onChange
	    }));
	  }
	}
	
	exports.default = NumInput;
	NumInput.propTypes = {
	  value: _react2.default.PropTypes.number,
	  onChange: _react2.default.PropTypes.func.isRequired
	};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class DateInput extends _react2.default.Component {
	  constructor(props) {
	    super(props);
	    this.state = { value: this.editFormat(props.value), focused: false, valid: true };
	    this.onFocus = this.onFocus.bind(this);
	    this.onBlur = this.onBlur.bind(this);
	    this.onChange = this.onChange.bind(this);
	  }
	
	  componentWillReceiveProps(newProps) {
	    if (newProps.value !== this.props.value) {
	      this.setState({ value: this.editFormat(newProps.value) });
	    }
	  }
	
	  onFocus() {
	    this.setState({ focused: true });
	  }
	
	  onBlur(e) {
	    const value = this.unformat(this.state.value);
	    const valid = this.state.value === '' || value != null;
	    if (valid !== this.state.valid && this.props.onValidityChange) {
	      this.props.onValidityChange(e, valid);
	    }
	    this.setState({ focused: false, valid: valid });
	    if (valid) this.props.onChange(e, value);
	  }
	
	  onChange(e) {
	    if (e.target.value.match(/^[\d-]*$/)) {
	      this.setState({ value: e.target.value });
	    }
	  }
	
	  displayFormat(date) {
	    return date != null ? date.toDateString() : '';
	  }
	
	  editFormat(date) {
	    return date != null ? date.toISOString().substr(0, 10) : '';
	  }
	
	  unformat(str) {
	    const val = new Date(str);
	    return isNaN(val.getTime()) ? null : val;
	  }
	
	  render() {
	    const value = this.state.focused || !this.state.valid ? this.state.value : this.displayFormat(this.props.value);
	    const childProps = Object.assign({}, this.props);
	    delete childProps.onValidityChange;
	    return _react2.default.createElement('input', _extends({
	      type: 'text' }, childProps, { value: value,
	      placeholder: this.state.focused ? 'yyyy-mm-dd' : null,
	      onFocus: this.onFocus, onBlur: this.onBlur, onChange: this.onChange
	    }));
	  }
	}
	
	exports.default = DateInput;
	DateInput.propTypes = {
	  value: _react2.default.PropTypes.object,
	  onChange: _react2.default.PropTypes.func.isRequired,
	  onValidityChange: _react2.default.PropTypes.func,
	  name: _react2.default.PropTypes.string.isRequired
	};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(22);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _Toast = __webpack_require__(33);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class IssueAddNavItem extends _react2.default.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      showing: false,
	      toastVisible: false, toastMessage: '', toastType: 'success'
	    };
	    this.showModal = this.showModal.bind(this);
	    this.hideModal = this.hideModal.bind(this);
	    this.submit = this.submit.bind(this);
	    this.showError = this.showError.bind(this);
	    this.dismissToast = this.dismissToast.bind(this);
	  }
	
	  showModal() {
	    this.setState({ showing: true });
	  }
	
	  hideModal() {
	    this.setState({ showing: false });
	  }
	
	  showError(message) {
	    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
	  }
	
	  dismissToast() {
	    this.setState({ toastVisible: false });
	  }
	
	  submit(e) {
	    e.preventDefault();
	    this.hideModal();
	    const form = document.forms.issueAdd;
	    const newIssue = {
	      owner: form.owner.value, title: form.title.value,
	      status: 'New', created: new Date()
	    };
	    fetch('/api/issues', {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify(newIssue)
	    }).then(response => {
	      if (response.ok) {
	        response.json().then(updatedIssue => {
	          this.props.router.push(`/issues/${updatedIssue._id}`);
	        });
	      } else {
	        response.json().then(error => {
	          this.showError(`Failed to add issue: ${error.message}`);
	        });
	      }
	    }).catch(err => {
	      this.showError(`Error in sending data to server: ${err.message}`);
	    });
	  }
	
	  render() {
	    return _react2.default.createElement(
	      _reactBootstrap.NavItem,
	      { onClick: this.showModal },
	      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'plus' }),
	      ' Create Interface Control',
	      _react2.default.createElement(
	        _reactBootstrap.Modal,
	        { keyboard: true, show: this.state.showing, onHide: this.hideModal },
	        _react2.default.createElement(
	          _reactBootstrap.Modal.Header,
	          { closeButton: true },
	          _react2.default.createElement(
	            _reactBootstrap.Modal.Title,
	            null,
	            'Create Interface Control'
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Modal.Body,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Form,
	            { name: 'issueAdd' },
	            _react2.default.createElement(
	              _reactBootstrap.FormGroup,
	              null,
	              _react2.default.createElement(
	                _reactBootstrap.ControlLabel,
	                null,
	                'Label'
	              ),
	              _react2.default.createElement(_reactBootstrap.FormControl, { name: 'title', autoFocus: true })
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.FormGroup,
	              null,
	              _react2.default.createElement(
	                _reactBootstrap.ControlLabel,
	                null,
	                'Type'
	              ),
	              _react2.default.createElement(_reactBootstrap.FormControl, { name: 'owner' })
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Modal.Footer,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.ButtonToolbar,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Button,
	              { type: 'button', bsStyle: 'primary', onClick: this.submit },
	              'Submit'
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Button,
	              { bsStyle: 'link', onClick: this.hideModal },
	              'Cancel'
	            )
	          )
	        )
	      ),
	      _react2.default.createElement(_Toast2.default, {
	        showing: this.state.toastVisible, message: this.state.toastMessage,
	        onDismiss: this.dismissToast, bsStyle: this.state.toastType
	      })
	    );
	  }
	}
	
	IssueAddNavItem.propTypes = {
	  router: _react2.default.PropTypes.object
	};
	
	exports.default = (0, _reactRouter.withRouter)(IssueAddNavItem);

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(30);
	
	var _reactRouter = __webpack_require__(22);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _DeviceFilter = __webpack_require__(39);
	
	var _DeviceFilter2 = _interopRequireDefault(_DeviceFilter);
	
	var _Toast = __webpack_require__(33);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const DeviceRow = props => {
	
	  return _react2.default.createElement(
	    'tr',
	    null,
	    _react2.default.createElement(
	      'td',
	      null,
	      props.device.device_number
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.device.status
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.device.name
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.device.purpose
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.device.protocol
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.device.port
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.device.control_types
	    )
	  );
	};
	
	DeviceRow.propTypes = {
	  device: _react2.default.PropTypes.object.isRequired
	  //deleteDevice: React.PropTypes.func.isRequired,
	};
	
	function DeviceTable(props) {
	  const deviceRows = props.devices.map(device => _react2.default.createElement(DeviceRow, { key: device._id, device: device }) //deleteDevice={props.deleteDevice} />
	  );
	  return _react2.default.createElement(
	    _reactBootstrap.Table,
	    { bordered: true, condensed: true, hover: true, responsive: true },
	    _react2.default.createElement(
	      'thead',
	      null,
	      _react2.default.createElement(
	        'tr',
	        null,
	        _react2.default.createElement(
	          'th',
	          null,
	          'Number'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Status'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Name'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Purpose'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Protocol'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Port'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Control Types'
	        )
	      )
	    ),
	    _react2.default.createElement(
	      'tbody',
	      null,
	      deviceRows
	    )
	  );
	}
	
	DeviceTable.propTypes = {
	  devices: _react2.default.PropTypes.array.isRequired
	  // deleteDevice: React.PropTypes.func.isRequired,
	};
	
	class DeviceList extends _react2.default.Component {
	  static dataFetcher(_ref) {
	    let urlBase = _ref.urlBase,
	        location = _ref.location;
	
	    return fetch(`${urlBase || ''}/api/devices${location.search}`).then(response => {
	      if (!response.ok) return response.json().then(error => Promise.reject(error));
	      return response.json().then(data => ({ DeviceList: data }));
	    });
	  }
	
	  constructor(props, context) {
	    super(props, context);
	    const devices = context.initialState.DeviceList ? context.initialState.DeviceList.records : [];
	    devices.forEach(device => {
	      device.created = new Date(device.created);
	      if (device.completionDate) {
	        device.completionDate = new Date(device.completionDate);
	      }
	    });
	    this.state = {
	      devices: devices,
	      toastVisible: false, toastMessage: '', toastType: 'success'
	    };
	
	    this.setFilter = this.setFilter.bind(this);
	    //this.deleteDevice = this.deleteDevice.bind(this);
	    this.showError = this.showError.bind(this);
	    this.dismissToast = this.dismissToast.bind(this);
	  }
	
	  componentDidMount() {
	    this.loadData();
	  }
	
	  componentDidUpdate(prevProps) {
	    const oldQuery = prevProps.location.query;
	    const newQuery = this.props.location.query;
	    if (oldQuery.status === newQuery.status && oldQuery.effort_gte === newQuery.effort_gte && oldQuery.effort_lte === newQuery.effort_lte) {
	      return;
	    }
	    this.loadData();
	  }
	
	  setFilter(query) {
	    this.props.router.push({ pathname: this.props.location.pathname, query: query });
	  }
	
	  showError(message) {
	    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
	  }
	
	  dismissToast() {
	    this.setState({ toastVisible: false });
	  }
	
	  loadData() {
	    DeviceList.dataFetcher({ location: this.props.location }).then(data => {
	      const devices = data.DeviceList.records;
	      devices.forEach(device => {
	        device.created = new Date(device.created);
	        if (device.completionDate) {
	          device.completionDate = new Date(device.completionDate);
	        }
	      });
	      this.setState({ devices: devices });
	    }).catch(err => {
	      this.showError(`Error in fetching data from server: ${err}`);
	    });
	  }
	
	  /* deleteDevice(id) {
	     fetch(`/api/devices/${id}`, { method: 'DELETE' }).then(response => {
	       if (!response.ok) this.showError('Failed to delete device');
	       else this.loadData();
	     });
	   }*/
	
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        _reactBootstrap.Panel,
	        { collapsible: true, header: 'Filter' },
	        _react2.default.createElement(_DeviceFilter2.default, { setFilter: this.setFilter, initFilter: this.props.location.query })
	      ),
	      _react2.default.createElement(DeviceTable, { devices: this.state.devices }),
	      _react2.default.createElement(_Toast2.default, {
	        showing: this.state.toastVisible, message: this.state.toastMessage,
	        onDismiss: this.dismissToast, bsStyle: this.state.toastType
	      })
	    );
	  }
	}
	
	exports.default = DeviceList;
	DeviceList.propTypes = {
	  location: _react2.default.PropTypes.object.isRequired,
	  router: _react2.default.PropTypes.object
	};
	
	DeviceList.contextTypes = {
	  initialState: _react2.default.PropTypes.object
	};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactBootstrap = __webpack_require__(26);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class DeviceFilter extends _react2.default.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      status: props.initFilter.status || '',
	      effort_gte: props.initFilter.effort_gte || '',
	      effort_lte: props.initFilter.effort_lte || '',
	      changed: false
	    };
	    this.onChangeStatus = this.onChangeStatus.bind(this);
	    this.onChangeEffortGte = this.onChangeEffortGte.bind(this);
	    this.onChangeEffortLte = this.onChangeEffortLte.bind(this);
	    this.applyFilter = this.applyFilter.bind(this);
	    this.resetFilter = this.resetFilter.bind(this);
	    this.clearFilter = this.clearFilter.bind(this);
	  }
	
	  componentWillReceiveProps(newProps) {
	    this.setState({
	      status: newProps.initFilter.status || '',
	      effort_gte: newProps.initFilter.effort_gte || '',
	      effort_lte: newProps.initFilter.effort_lte || '',
	      changed: false
	    });
	  }
	
	  onChangeStatus(e) {
	    this.setState({ status: e.target.value, changed: true });
	  }
	
	  onChangeEffortGte(e) {
	    const effortString = e.target.value;
	    if (effortString.match(/^\d*$/)) {
	      this.setState({ effort_gte: e.target.value, changed: true });
	    }
	  }
	
	  onChangeEffortLte(e) {
	    const effortString = e.target.value;
	    if (effortString.match(/^\d*$/)) {
	      this.setState({ effort_lte: e.target.value, changed: true });
	    }
	  }
	
	  applyFilter() {
	    const newFilter = {};
	    if (this.state.status) newFilter.status = this.state.status;
	    if (this.state.effort_gte) newFilter.effort_gte = this.state.effort_gte;
	    if (this.state.effort_lte) newFilter.effort_lte = this.state.effort_lte;
	    this.props.setFilter(newFilter);
	  }
	
	  clearFilter() {
	    this.props.setFilter({});
	  }
	
	  resetFilter() {
	    this.setState({
	      status: this.props.initFilter.status || '',
	      effort_gte: this.props.initFilter.effort_gte || '',
	      effort_lte: this.props.initFilter.effort_lte || '',
	      changed: false
	    });
	  }
	
	  render() {
	    return _react2.default.createElement(
	      _reactBootstrap.Row,
	      null,
	      _react2.default.createElement(
	        _reactBootstrap.Col,
	        { xs: 6, sm: 4, md: 3, lg: 2 },
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.ControlLabel,
	            null,
	            'Status'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.FormControl,
	            {
	              componentClass: 'select', value: this.state.status,
	              onChange: this.onChangeStatus
	            },
	            _react2.default.createElement(
	              'option',
	              { value: '' },
	              '(Any)'
	            ),
	            _react2.default.createElement(
	              'option',
	              { value: 'New' },
	              'New'
	            ),
	            _react2.default.createElement(
	              'option',
	              { value: 'Open' },
	              'Open'
	            ),
	            _react2.default.createElement(
	              'option',
	              { value: 'Assigned' },
	              'Assigned'
	            ),
	            _react2.default.createElement(
	              'option',
	              { value: 'Fixed' },
	              'Fixed'
	            ),
	            _react2.default.createElement(
	              'option',
	              { value: 'Verified' },
	              'Verified'
	            ),
	            _react2.default.createElement(
	              'option',
	              { value: 'Closed' },
	              'Closed'
	            )
	          )
	        )
	      ),
	      _react2.default.createElement(
	        _reactBootstrap.Col,
	        { xs: 6, sm: 4, md: 3, lg: 2 },
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.ControlLabel,
	            null,
	            'Effort'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.InputGroup,
	            null,
	            _react2.default.createElement(_reactBootstrap.FormControl, { value: this.state.effort_gte, onChange: this.onChangeEffortGte }),
	            _react2.default.createElement(
	              _reactBootstrap.InputGroup.Addon,
	              null,
	              '-'
	            ),
	            _react2.default.createElement(_reactBootstrap.FormControl, { value: this.state.effort_lte, onChange: this.onChangeEffortLte })
	          )
	        )
	      ),
	      _react2.default.createElement(
	        _reactBootstrap.Col,
	        { xs: 6, sm: 4, md: 3, lg: 2 },
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.ControlLabel,
	            null,
	            '\xA0'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.ButtonToolbar,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Button,
	              { bsStyle: 'primary', onClick: this.applyFilter },
	              'Apply'
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Button,
	              { onClick: this.resetFilter, disabled: !this.state.changed },
	              'Reset'
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Button,
	              { onClick: this.clearFilter },
	              'Clear'
	            )
	          )
	        )
	      )
	    );
	  }
	}
	
	exports.default = DeviceFilter;
	DeviceFilter.propTypes = {
	  setFilter: _react2.default.PropTypes.func.isRequired,
	  initFilter: _react2.default.PropTypes.object.isRequired
	};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _reactRouterBootstrap = __webpack_require__(27);
	
	var _NumInput = __webpack_require__(35);
	
	var _NumInput2 = _interopRequireDefault(_NumInput);
	
	var _DateInput = __webpack_require__(36);
	
	var _DateInput2 = _interopRequireDefault(_DateInput);
	
	var _Toast = __webpack_require__(33);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class DeviceEdit extends _react2.default.Component {
	  static dataFetcher(_ref) {
	    let params = _ref.params,
	        urlBase = _ref.urlBase;
	
	    return fetch(`${urlBase || ''}/api/devices/${params.id}`).then(response => {
	      if (!response.ok) return response.json().then(error => Promise.reject(error));
	      return response.json().then(data => ({ DeviceEdit: data }));
	    });
	  }
	
	  constructor(props, context) {
	    super(props, context);
	    let device;
	    if (context.initialState.DeviceEdit) {
	      device = context.initialState.DeviceEdit;
	      device.created = new Date(device.created);
	      device.completionDate = device.completionDate != null ? new Date(device.completionDate) : null;
	    } else {
	      device = {
	        _id: '', title: '', status: '', owner: '', effort: null,
	        completionDate: null, created: null
	      };
	    }
	    this.state = {
	      device: device,
	      invalidFields: {}, showingValidation: false,
	      toastVisible: false, toastMessage: '', toastType: 'success'
	    };
	    this.dismissValidation = this.dismissValidation.bind(this);
	    this.showValidation = this.showValidation.bind(this);
	    this.showSuccess = this.showSuccess.bind(this);
	    this.showError = this.showError.bind(this);
	    this.dismissToast = this.dismissToast.bind(this);
	    this.onChange = this.onChange.bind(this);
	    this.onValidityChange = this.onValidityChange.bind(this);
	    this.onSubmit = this.onSubmit.bind(this);
	  }
	
	  componentDidMount() {
	    this.loadData();
	  }
	
	  componentDidUpdate(prevProps) {
	    if (prevProps.params.id !== this.props.params.id) {
	      this.loadData();
	    }
	  }
	
	  onChange(event, convertedValue) {
	    const device = Object.assign({}, this.state.device);
	    const value = convertedValue !== undefined ? convertedValue : event.target.value;
	    device[event.target.name] = value;
	    this.setState({ device: device });
	  }
	
	  onValidityChange(event, valid) {
	    const invalidFields = Object.assign({}, this.state.invalidFields);
	    if (!valid) {
	      invalidFields[event.target.name] = true;
	    } else {
	      delete invalidFields[event.target.name];
	    }
	    this.setState({ invalidFields: invalidFields });
	  }
	
	  onSubmit(event) {
	    event.preventDefault();
	    this.showValidation();
	
	    if (Object.keys(this.state.invalidFields).length !== 0) {
	      return;
	    }
	
	    fetch(`/api/devices/${this.props.params.id}`, {
	      method: 'PUT',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify(this.state.device)
	    }).then(response => {
	      if (response.ok) {
	        response.json().then(updatedDevice => {
	          updatedDevice.created = new Date(updatedDevice.created);
	          if (updatedDevice.completionDate) {
	            updatedDevice.completionDate = new Date(updatedDevice.completionDate);
	          }
	          this.setState({ device: updatedDevice });
	          this.showSuccess('Updated device successfully.');
	        });
	      } else {
	        response.json().then(error => {
	          this.showError(`Failed to update device: ${error.message}`);
	        });
	      }
	    }).catch(err => {
	      this.showError(`Error in sending data to server: ${err.message}`);
	    });
	  }
	
	  loadData() {
	    DeviceEdit.dataFetcher({ params: this.props.params }).then(data => {
	      const device = data.DeviceEdit;
	      device.created = new Date(device.created);
	      device.completionDate = device.completionDate != null ? new Date(device.completionDate) : null;
	      this.setState({ device: device });
	    }).catch(err => {
	      this.showError(`Error in fetching data from server: ${err.message}`);
	    });
	  }
	
	  showValidation() {
	    this.setState({ showingValidation: true });
	  }
	
	  dismissValidation() {
	    this.setState({ showingValidation: false });
	  }
	
	  showSuccess(message) {
	    this.setState({ toastVisible: true, toastMessage: message, toastType: 'success' });
	  }
	
	  showError(message) {
	    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
	  }
	
	  dismissToast() {
	    this.setState({ toastVisible: false });
	  }
	
	  render() {
	    const device = this.state.device;
	    let validationMessage = null;
	    if (Object.keys(this.state.invalidFields).length !== 0 && this.state.showingValidation) {
	      validationMessage = _react2.default.createElement(
	        _reactBootstrap.Alert,
	        { bsStyle: 'danger', onDismiss: this.dismissValidation },
	        'Please correct invalid fields before submitting.'
	      );
	    }
	    return _react2.default.createElement(
	      _reactBootstrap.Panel,
	      { header: 'Edit Device' },
	      _react2.default.createElement(
	        _reactBootstrap.Form,
	        { horizontal: true, onSubmit: this.onSubmit },
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'ID'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(
	              _reactBootstrap.FormControl.Static,
	              null,
	              device._id
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Created'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(
	              _reactBootstrap.FormControl.Static,
	              null,
	              device.created ? device.created.toDateString() : ''
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Status'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(
	              _reactBootstrap.FormControl,
	              {
	                componentClass: 'select', name: 'status', value: device.status,
	                onChange: this.onChange
	              },
	              _react2.default.createElement(
	                'option',
	                { value: 'New' },
	                'New'
	              ),
	              _react2.default.createElement(
	                'option',
	                { value: 'Open' },
	                'Open'
	              ),
	              _react2.default.createElement(
	                'option',
	                { value: 'Assigned' },
	                'Assigned'
	              ),
	              _react2.default.createElement(
	                'option',
	                { value: 'Fixed' },
	                'Fixed'
	              ),
	              _react2.default.createElement(
	                'option',
	                { value: 'Verified' },
	                'Verified'
	              ),
	              _react2.default.createElement(
	                'option',
	                { value: 'Closed' },
	                'Closed'
	              )
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Owner'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(_reactBootstrap.FormControl, { name: 'owner', value: device.owner, onChange: this.onChange })
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Effort'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(_reactBootstrap.FormControl, {
	              componentClass: _NumInput2.default, name: 'effort',
	              value: device.effort, onChange: this.onChange
	            })
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          { validationState: this.state.invalidFields.completionDate ? 'error' : null },
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Completion Date'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(_reactBootstrap.FormControl, {
	              componentClass: _DateInput2.default, name: 'completionDate',
	              value: device.completionDate, onChange: this.onChange,
	              onValidityChange: this.onValidityChange
	            }),
	            _react2.default.createElement(_reactBootstrap.FormControl.Feedback, null)
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Title'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(_reactBootstrap.FormControl, { name: 'title', value: device.title, onChange: this.onChange })
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { smOffset: 3, sm: 6 },
	            _react2.default.createElement(
	              _reactBootstrap.ButtonToolbar,
	              null,
	              _react2.default.createElement(
	                _reactBootstrap.Button,
	                { bsStyle: 'primary', type: 'submit' },
	                'Submit'
	              ),
	              _react2.default.createElement(
	                _reactRouterBootstrap.LinkContainer,
	                { to: '/devices' },
	                _react2.default.createElement(
	                  _reactBootstrap.Button,
	                  { bsStyle: 'link' },
	                  'Back'
	                )
	              )
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { smOffset: 3, sm: 9 },
	            validationMessage
	          )
	        )
	      ),
	      _react2.default.createElement(_Toast2.default, {
	        showing: this.state.toastVisible, message: this.state.toastMessage,
	        onDismiss: this.dismissToast, bsStyle: this.state.toastType
	      })
	    );
	  }
	}
	
	exports.default = DeviceEdit;
	DeviceEdit.propTypes = {
	  params: _react2.default.PropTypes.object.isRequired
	};
	
	DeviceEdit.contextTypes = {
	  initialState: _react2.default.PropTypes.object
	};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	//import 'isomorphic-fetch';
	
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _fileUpload = __webpack_require__(47);
	
	var _fileUpload2 = _interopRequireDefault(_fileUpload);
	
	var _fileDownload = __webpack_require__(48);
	
	var _fileDownload2 = _interopRequireDefault(_fileDownload);
	
	var _edit = __webpack_require__(49);
	
	var _edit2 = _interopRequireDefault(_edit);
	
	var _close = __webpack_require__(50);
	
	var _close2 = _interopRequireDefault(_close);
	
	var _Toast = __webpack_require__(33);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	var _AddController = __webpack_require__(51);
	
	var _AddController2 = _interopRequireDefault(_AddController);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//import Joystick from './Joystick.jsx';
	
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	
	const DeviceRow = props => {
	  return _react2.default.createElement(
	    'option',
	    { value: props.device.device_number },
	    props.device.name
	  );
	};
	
	DeviceRow.propTypes = {
	  device: _react2.default.PropTypes.object.isRequired
	};
	
	function DeviceTable(props) {
	  const deviceRows = props.devices.map(device => _react2.default.createElement(DeviceRow, { key: device._id, device: device }));
	  return _react2.default.createElement(
	    _reactBootstrap.FormControl,
	    { componentClass: 'select',
	      onChange: props.onDeviceSelect },
	    deviceRows
	  );
	}
	
	DeviceTable.propTypes = {
	  devices: _react2.default.PropTypes.array.isRequired,
	  onDeviceSelect: _react2.default.PropTypes.func.isRequired
	};
	
	class NewControllers extends _react2.default.Component {
	
	  static dataFetcher(_ref) {
	    let urlBase = _ref.urlBase,
	        location = _ref.location;
	
	    return fetch(`${urlBase || ''}/api/devices${location.search}`).then(response => {
	      if (!response.ok) return response.json().then(error => Promise.reject(error));
	      return response.json().then(data => ({ NewControllers: data }));
	    });
	  }
	
	  constructor(props, context) {
	    super(props, context);
	    const devices = context.initialState.NewControllers ? context.initialState.NewControllers.records : [];
	    this.state = {
	      devices: devices,
	      toastVisible: false,
	      toastMessage: '',
	      toastType: 'success',
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      buttonCounter: 0,
	      sliderCounter: 0,
	      xyCounter: 0,
	      lock: true
	    };
	    this.onAddButton = this.onAddButton.bind(this);
	    this.onAddSlider = this.onAddSlider.bind(this);
	    this.onAddXY = this.onAddXY.bind(this);
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.onEditItem = this.onEditItem.bind(this);
	    this.handleSliderChange = this.handleSliderChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleOnDownload = this.handleOnDownload.bind(this);
	    this.handleOnUpload = this.handleOnUpload.bind(this);
	    this.showError = this.showError.bind(this);
	    this.dismissToast = this.dismissToast.bind(this);
	  }
	  componentDidMount() {
	    this.loadData();
	  }
	
	  componentDidUpdate(prevProps) {
	    const oldQuery = prevProps.location.query;
	    const newQuery = this.props.location.query;
	    if (oldQuery.status === newQuery.status && oldQuery.effort_gte === newQuery.effort_gte && oldQuery.effort_lte === newQuery.effort_lte) {
	      return;
	    }
	    this.loadData();
	  }
	  showError(message) {
	    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
	  }
	
	  dismissToast() {
	    this.setState({ toastVisible: false });
	  }
	
	  loadData() {
	    NewControllers.dataFetcher({ location: this.props.location }).then(data => {
	      const devices = data.NewControllers.records;
	      devices.forEach(device => {
	        device.created = new Date(device.created);
	        if (device.completionDate) {
	          device.completionDate = new Date(device.completionDate);
	        }
	      });
	      this.setState({ devices: devices });
	    }).catch(err => {
	      this.showError(`Error in fetching data from server: ${err}`);
	    });
	  }
	
	  handleSliderChange(event) {
	    //not updating correct object
	    this.setState({ sliderValue: event.target.value });
	    console.log(event.target.id + ': ' + this.state.sliderValue);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  handleOnDownload() {
	    console.log("download file with data to be loaded again later ");
	  }
	  handleOnUpload() {
	    console.log("upload previously saved file to use");
	  }
	  createElement(el) {
	    const removeStyle = {
	      position: "absolute",
	      right: "2px",
	      top: 0,
	      cursor: "pointer"
	    };
	    const editStyle = {
	      position: "absolute",
	      right: "2px",
	      bottom: 0,
	      cursor: "pointer"
	    };
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#EEE"
	    };
	    const i = el.add ? "+" : el.i;
	    let typeCode = _react2.default.createElement(
	      'button',
	      null,
	      i
	    );
	    if (el.type == 1) {
	      //type is slider
	      typeCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          i
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '1', max: '100', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliderChange })
	        )
	      );
	    } else if (el.type == 2) {
	      //type is xy area
	      typeCode = _react2.default.createElement(
	        'div',
	        null,
	        'xy joystick here'
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      typeCode,
	      _react2.default.createElement(
	        'span',
	        { style: lockStyle },
	        _react2.default.createElement(
	          'span',
	          { className: 'edit',
	            onClick: this.onEditItem.bind(this, i) },
	          _react2.default.createElement(_edit2.default, null)
	        ),
	        _react2.default.createElement(
	          'span',
	          { className: 'remove',
	            onClick: this.onRemoveItem.bind(this, i) },
	          _react2.default.createElement(_close2.default, null)
	        )
	      )
	    );
	  }
	
	  onAddButton() {
	
	    console.log("adding ", "button " + this.state.buttonCounter);
	    this.setState({
	      items: this.state.items.concat({
	        type: 0,
	        i: "button-" + this.state.buttonCounter,
	        x: this.state.items.length * 2 % (this.state.cols || 12),
	        y: Infinity,
	        w: 2,
	        h: 2
	      }),
	      buttonCounter: this.state.buttonCounter + 1
	    });
	  }
	  onAddSlider() {
	    console.log("adding ", "slider " + this.state.sliderCounter);
	    this.setState({
	      items: this.state.items.concat({
	        type: 1,
	        i: "slider-" + this.state.sliderCounter,
	        x: this.state.items.length * 2 % (this.state.cols || 12),
	        y: Infinity,
	        w: 2,
	        h: 2
	      }),
	      sliderCounter: this.state.sliderCounter + 1
	    });
	  }
	  onAddXY() {
	    console.log("adding ", "xy " + this.state.xyCounter);
	    this.setState({
	      items: this.state.items.concat({
	        type: 2,
	        i: "xy-" + this.state.xyCounter,
	        x: this.state.items.length * 2 % (this.state.cols || 12),
	        y: Infinity,
	        w: 2,
	        h: 2
	      }),
	      xyCounter: this.state.xyCounter + 1
	    });
	  }
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  onRemoveItem(i) {
	    console.log("removing", i);
	    this.setState({ items: _lodash2.default.reject(this.state.items, { i: i }) });
	  }
	  onEditItem(i) {
	    console.log("edit item: " + i);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      'goobydooby',
	      _react2.default.createElement(
	        _reactBootstrap.Row,
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          { xs: 6, sm: 3, md: 2, lg: 1 },
	          _react2.default.createElement(_AddController2.default, null),
	          _react2.default.createElement(DeviceTable, { devices: this.state.devices, onDeviceSelect: this.onAddButton }),
	          _react2.default.createElement(_Toast2.default, {
	            showing: this.state.toastVisible, message: this.state.toastMessage,
	            onDismiss: this.dismissToast, bsStyle: this.state.toastType
	          })
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          { xs: 6, sm: 3, md: 2, lg: 1 },
	          _react2.default.createElement(
	            'button',
	            { onClick: this.onAddSlider },
	            'Add Slider'
	          ),
	          _react2.default.createElement(
	            'button',
	            { onClick: this.onAddXY },
	            'Add X/Y Area'
	          )
	        ),
	        _react2.default.createElement(_reactBootstrap.Col, { xs: 6, sm: 3, md: 2, lg: 1 }),
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          { xs: 6, sm: 3, md: 2, lg: 1 },
	          _react2.default.createElement(
	            'button',
	            { className: 'pull-right', onClick: this.handleOnLock },
	            lockIcon
	          ),
	          _react2.default.createElement(
	            'button',
	            { className: 'pull-right', onClick: this.handleOnDownload },
	            _react2.default.createElement(_fileDownload2.default, null)
	          ),
	          _react2.default.createElement(
	            'button',
	            { className: 'pull-right', onClick: this.handleOnUpload },
	            _react2.default.createElement(_fileUpload2.default, null)
	          )
	        )
	      ),
	      _react2.default.createElement(
	        ResponsiveReactGridLayout,
	        _extends({
	          onBreakpointChange: this.onBreakpointChange,
	          onLayoutChange: this.onLayoutChange,
	          isDraggable: !this.state.lock,
	          isResizable: !this.state.lock
	        }, this.props),
	        _lodash2.default.map(this.state.items, el => this.createElement(el))
	      )
	    );
	  }
	}
	exports.default = NewControllers;
	NewControllers.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};
	NewControllers.propTypes = {
	  location: _react2.default.PropTypes.object.isRequired,
	  router: _react2.default.PropTypes.object
	};
	
	NewControllers.contextTypes = {
	  initialState: _react2.default.PropTypes.object
	};

/***/ }),
/* 42 */
/***/ (function(module, exports) {

	module.exports = require("react-grid-layout");

/***/ }),
/* 43 */
/***/ (function(module, exports) {

	module.exports = require("react-dom");

/***/ }),
/* 44 */
/***/ (function(module, exports) {

	module.exports = require("lodash");

/***/ }),
/* 45 */
/***/ (function(module, exports) {

	module.exports = require("react-icons/lib/fa/lock");

/***/ }),
/* 46 */
/***/ (function(module, exports) {

	module.exports = require("react-icons/lib/fa/unlock");

/***/ }),
/* 47 */
/***/ (function(module, exports) {

	module.exports = require("react-icons/lib/md/file-upload");

/***/ }),
/* 48 */
/***/ (function(module, exports) {

	module.exports = require("react-icons/lib/md/file-download");

/***/ }),
/* 49 */
/***/ (function(module, exports) {

	module.exports = require("react-icons/lib/md/edit");

/***/ }),
/* 50 */
/***/ (function(module, exports) {

	module.exports = require("react-icons/lib/md/close");

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(22);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _Toast = __webpack_require__(33);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class AddController extends _react2.default.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      showing: false,
	      toastVisible: false, toastMessage: '', toastType: 'success'
	    };
	    this.showModal = this.showModal.bind(this);
	    this.hideModal = this.hideModal.bind(this);
	    this.submit = this.submit.bind(this);
	    this.showError = this.showError.bind(this);
	    this.dismissToast = this.dismissToast.bind(this);
	  }
	
	  showModal() {
	    this.setState({ showing: true });
	  }
	
	  hideModal() {
	    this.setState({ showing: false });
	  }
	
	  showError(message) {
	    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
	  }
	
	  dismissToast() {
	    this.setState({ toastVisible: false });
	  }
	
	  submit(e) {
	    e.preventDefault();
	    this.hideModal();
	    const form = document.forms.issueAdd;
	    const newIssue = {
	      owner: form.owner.value, title: form.title.value,
	      status: 'New', created: new Date()
	    };
	    fetch('/api/issues', {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify(newIssue)
	    }).then(response => {
	      if (response.ok) {
	        response.json().then(updatedIssue => {
	          this.props.router.push(`/issues/${updatedIssue._id}`);
	        });
	      } else {
	        response.json().then(error => {
	          this.showError(`Failed to add issue: ${error.message}`);
	        });
	      }
	    }).catch(err => {
	      this.showError(`Error in sending data to server: ${err.message}`);
	    });
	  }
	
	  render() {
	    return _react2.default.createElement(
	      'span',
	      { onClick: this.showModal },
	      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'plus' }),
	      ' Add Controller',
	      _react2.default.createElement(
	        _reactBootstrap.Modal,
	        { keyboard: true, show: this.state.showing, onHide: this.hideModal },
	        _react2.default.createElement(
	          _reactBootstrap.Modal.Header,
	          { closeButton: true },
	          _react2.default.createElement(
	            _reactBootstrap.Modal.Title,
	            null,
	            'Add Controller'
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Modal.Body,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Form,
	            { name: 'issueAdd' },
	            _react2.default.createElement(
	              _reactBootstrap.FormGroup,
	              null,
	              _react2.default.createElement(
	                _reactBootstrap.ControlLabel,
	                null,
	                'Label'
	              ),
	              _react2.default.createElement(_reactBootstrap.FormControl, { name: 'title', autoFocus: true })
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.FormGroup,
	              null,
	              _react2.default.createElement(
	                _reactBootstrap.ControlLabel,
	                null,
	                'Type'
	              ),
	              _react2.default.createElement(_reactBootstrap.FormControl, { name: 'owner' })
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Modal.Footer,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.ButtonToolbar,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Button,
	              { type: 'button', bsStyle: 'primary', onClick: this.submit },
	              'Submit'
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Button,
	              { bsStyle: 'link', onClick: this.hideModal },
	              'Cancel'
	            )
	          )
	        )
	      ),
	      _react2.default.createElement(_Toast2.default, {
	        showing: this.state.toastVisible, message: this.state.toastMessage,
	        onDismiss: this.dismissToast, bsStyle: this.state.toastType
	      })
	    );
	  }
	}
	
	AddController.propTypes = {
	  router: _react2.default.PropTypes.object
	};
	
	exports.default = (0, _reactRouter.withRouter)(AddController);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _DeviceMenu = __webpack_require__(53);
	
	var _DeviceMenu2 = _interopRequireDefault(_DeviceMenu);
	
	var _ParametersMenu = __webpack_require__(55);
	
	var _ParametersMenu2 = _interopRequireDefault(_ParametersMenu);
	
	var _ParameterInput = __webpack_require__(56);
	
	var _ParameterInput2 = _interopRequireDefault(_ParameterInput);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class ControlInterface extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(_DeviceMenu2.default, { location: this.props.location }),
	      _react2.default.createElement(_ParametersMenu2.default, { location: this.props.location }),
	      _react2.default.createElement(_ParameterInput2.default, null)
	    );
	  }
	}
	exports.default = ControlInterface;
	ControlInterface.propTypes = {
	  location: _react2.default.PropTypes.object.isRequired,
	  router: _react2.default.PropTypes.object
	};
	
	ControlInterface.contextTypes = {
	  initialState: _react2.default.PropTypes.object
	};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _socket = __webpack_require__(54);
	
	var _socket2 = _interopRequireDefault(_socket);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	let socket;
	
	class DeviceMenu extends _react2.default.Component {
	
	  static dataFetcher(_ref) {
	    let urlBase = _ref.urlBase,
	        location = _ref.location;
	
	    return fetch(`${urlBase || ''}/api/devices${location.search}`).then(response => {
	      if (!response.ok) return response.json().then(error => Promise.reject(error));
	      return response.json().then(data => ({ DeviceMenu: data }));
	    });
	  }
	
	  constructor(props, context) {
	    super(props, context);
	    const devices = context.initialState.DeviceMenu ? context.initialState.DeviceMenu.records : [];
	    this.state = {
	      devices: devices
	    };
	    this.deviceOptions = [_react2.default.createElement(
	      'option',
	      { key: '0', value: '0' },
	      'Select a Device'
	    )];
	    this.onDeviceSelect = this.onDeviceSelect.bind(this);
	  }
	  componentDidMount() {
	    this.loadData();
	    socket = (0, _socket2.default)();
	    socket.on(this.props.location.pathname, mesg => {
	      this.setState({ text: mesg });
	    });
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  loadData() {
	    DeviceMenu.dataFetcher({ location: this.props.location }).then(data => {
	      const devices = data.DeviceMenu.records;
	      devices.forEach(device => {
	        this.deviceOptions.push(_react2.default.createElement(
	          'option',
	          { key: device._id, value: device.device_number },
	          device.name
	        ));
	      });
	      this.setState({ devices: devices });
	    }).catch(err => {
	      this.showError(`Error in fetching data from server: ${err}`);
	    });
	  }
	
	  onDeviceSelect(event) {
	    console.log("device #" + event.target.value);
	    socket.emit('device-menu', event.target.value);
	  }
	  render() {
	    return _react2.default.createElement(
	      _reactBootstrap.FormGroup,
	      null,
	      _react2.default.createElement(
	        _reactBootstrap.Col,
	        { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	        'Device'
	      ),
	      _react2.default.createElement(
	        _reactBootstrap.Col,
	        { sm: 9 },
	        _react2.default.createElement(
	          _reactBootstrap.FormControl,
	          { componentClass: 'select', onChange: this.onDeviceSelect },
	          this.deviceOptions
	        )
	      )
	    );
	  }
	}
	exports.default = DeviceMenu;
	DeviceMenu.propTypes = {
	  location: _react2.default.PropTypes.object.isRequired,
	  router: _react2.default.PropTypes.object
	};
	
	DeviceMenu.contextTypes = {
	  initialState: _react2.default.PropTypes.object
	};

/***/ }),
/* 54 */
/***/ (function(module, exports) {

	module.exports = require("socket.io-client");

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _socket = __webpack_require__(54);
	
	var _socket2 = _interopRequireDefault(_socket);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	let socket;
	
	class ParametersMenu extends _react2.default.Component {
	
	  static dataFetcher(_ref) {
	    let urlBase = _ref.urlBase,
	        location = _ref.location;
	
	    return fetch(`${urlBase || ''}/api/device_1_casparcg${location.search}`).then(response => {
	      if (!response.ok) return response.json().then(error => Promise.reject(error));
	      return response.json().then(data => ({ ParametersMenu: data }));
	    });
	  }
	
	  constructor(props, context) {
	    super(props, context);
	    const parameters = context.initialState.ParametersMenu ? context.initialState.ParametersMenu.records : [];
	    this.state = {
	      parameters: parameters,
	      showing: false
	    };
	    this.showParameters = this.showParameters.bind(this);
	    this.hideParameters = this.hideParameters.bind(this);
	    this.parameterOptions = [_react2.default.createElement(
	      'option',
	      { key: '0', value: 'play 1-0 amb.mp4' },
	      'Select a Parameter'
	    )];
	    this.onParameterSelect = this.onParameterSelect.bind(this);
	  }
	  showParameters() {
	    this.setState({ showing: true });
	  }
	  hideParameters() {
	    this.setState({ showing: false });
	  }
	  componentDidMount() {
	    this.loadData();
	    socket = (0, _socket2.default)();
	    socket.on(this.props.location.pathname, mesg => {
	      this.setState({ text: mesg });
	    });
	    socket.on("show-parameters", mesg => {
	      console.log("show params " + mesg);
	      this.setState({ showing: true });
	    });
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  loadData() {
	    ParametersMenu.dataFetcher({ location: this.props.location }).then(data => {
	      const parameters = data.ParametersMenu.records;
	      parameters.forEach(parameter => {
	        this.parameterOptions.push(_react2.default.createElement(
	          'option',
	          { key: parameter.notes, value: parameter.notes },
	          parameter.command
	        ));
	      });
	      this.setState({ parameters: parameters });
	    }).catch(err => {
	      this.showError(`Error in fetching data from server: ${err}`);
	    });
	  }
	
	  onParameterSelect(event) {
	    console.log("parameter #" + event.target.value);
	    socket.emit('parameter-menu', event.target.value);
	  }
	
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      this.state.showing ? _react2.default.createElement(
	        _reactBootstrap.FormGroup,
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	          'Parameter'
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          { sm: 9 },
	          _react2.default.createElement(
	            _reactBootstrap.FormControl,
	            { componentClass: 'select', onChange: this.onParameterSelect },
	            this.parameterOptions
	          )
	        )
	      ) : null
	    );
	  }
	}
	exports.default = ParametersMenu;
	ParametersMenu.propTypes = {
	  location: _react2.default.PropTypes.object.isRequired,
	  router: _react2.default.PropTypes.object
	};
	
	ParametersMenu.contextTypes = {
	  initialState: _react2.default.PropTypes.object
	};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	let socket;
	
	class ParameterInput extends _react2.default.Component {
	
	  constructor(props) {
	    super(props);
	    this.state = {
	      text: '',
	      host: '127.0.0.1',
	      port: 5250,
	      command: "",
	      response: '',
	      showing: false
	    };
	    this.showParameterInputs = this.showParameterInputs.bind(this);
	    this.hideParameterInputs = this.hideParameterInputs.bind(this);
	    this.onHostChange = this.onHostChange.bind(this);
	    this.onPortChange = this.onPortChange.bind(this);
	    this.onCommandChange = this.onCommandChange.bind(this);
	    this.sendCommand = this.sendCommand.bind(this);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('show-parameter-inputs', mesg => {
	      this.setState({ showing: true });
	    });
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  showParameterInputs() {
	    this.setState({ showing: true });
	  }
	  hideParameterInputs() {
	    this.setState({ showing: false });
	  }
	  onPortChange(event) {
	    this.setState({ port: event.target.value });
	  }
	  onHostChange(event) {
	    this.setState({ host: event.target.value });
	  }
	  onCommandChange(event) {
	    this.setState({ command: event.target.value });
	  }
	  sendCommand() {
	    console.log("sending Telnet command");
	    socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: this.state.command });
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      this.state.showing ? _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Host'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(_reactBootstrap.FormControl, { name: 'host', value: this.state.host, onChange: this.onHostChange })
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Port'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(_reactBootstrap.FormControl, { name: 'port', value: this.state.port, onChange: this.onPortChange })
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	            'Telnet Command'
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { sm: 9 },
	            _react2.default.createElement(_reactBootstrap.FormControl, { name: 'command', value: this.state.command, onChange: this.onCommandChange })
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { smOffset: 3, sm: 6 },
	            _react2.default.createElement(
	              _reactBootstrap.ButtonToolbar,
	              null,
	              _react2.default.createElement(
	                _reactBootstrap.Button,
	                { onClick: this.sendCommand },
	                'Send Telnet Command'
	              )
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.FormGroup,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { smOffset: 3, sm: 6 },
	            this.state.response
	          )
	        )
	      ) : null
	    );
	  }
	}
	exports.default = ParameterInput;

/***/ }),
/* 57 */
/***/ (function(module, exports) {

	module.exports = require("socket.io-react");

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class Demo extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      lock: true,
	      host: '127.0.0.1',
	      port: 5250,
	      command: "",
	      response: ''
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleSliders = this.handleSliders.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onClick: this.handleButtons },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '1', max: '100', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	
	    switch (event.target.value) {
	      case 'vid_red':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 #FF0000' });
	        break;
	      case 'vid_white':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 #FFFFFF' });
	        break;
	      case 'vid_green':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 #00FF00' });
	        break;
	      case 'vid_blue':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 #0000FF' });
	        break;
	      case 'vid_play1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 aaa.mp4' });
	        break;
	      case 'vid_play2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-1 bbb.mp4 10 LEFT' });
	        break;
	      case 'vid_play3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 ccc.mp4 PUSH 20 EASEINSINE' });
	        break;
	      case 'vid_play4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: '"PLAY 1-0 test_scroll SPEED 5 BLUR 50' });
	        break;
	      case 'vid_play5':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 ddd.mp4' });
	        break;
	      case 'vid_play6':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 MOVIE SEEK 100 LOOP' });
	        break;
	      case 'vid_play7':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 aaa.mp4' });
	        break;
	      case 'vid_play8':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 aaa.mp4' });
	        break;
	      case 'vid_loop1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 aaa.mp4 LOOP' });
	        break;
	      case 'vid_loop2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 aaa.mp4 LOOP' });
	        break;
	      case 'vid_loop3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 aaa.mp4 LOOP' });
	        break;
	      case 'vid_loop4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 aaa.mp4 LOOP' });
	        break;
	      case 'spot_on':
	        socket.emit('dmx-go', { 6: 216, 7: 255 });
	        break;
	      case 'spot_off':
	        socket.emit('dmx-go', { 6: 0, 7: 0 });
	        break;
	      case 'spot_white':
	        socket.emit('dmx-go', { 5: 0, 6: 216, 7: 255 });
	        break;
	      case 'spot_red':
	        socket.emit('dmx-go', { 5: 24, 6: 216, 7: 255 });
	        break;
	      case 'spot_green':
	        socket.emit('dmx-go', { 5: 18, 6: 216, 7: 255 });
	        break;
	      case 'spot_blue':
	        socket.emit('dmx-go', { 5: 42, 6: 216, 7: 255 });
	        break;
	      case 'wash_on':
	        socket.emit('dmx-go', { 16: 255 });
	        break;
	      case 'wash_off':
	        socket.emit('dmx-go', { 16: 0 });
	        break;
	      case 'wash_white':
	        socket.emit('dmx-go', { 17: 0, 18: 0, 19: 0, 20: 255 });
	        break;
	      case 'wash_red':
	        socket.emit('dmx-go', { 17: 255, 18: 0, 19: 0, 20: 0 });
	        break;
	      case 'wash_green':
	        socket.emit('dmx-go', { 17: 0, 18: 255, 19: 0, 20: 0 });
	        break;
	      case 'wash_blue':
	        socket.emit('dmx-go', { 17: 0, 18: 0, 19: 255, 20: 0 });
	        break;
	      case 'wash_yellow':
	        socket.emit('dmx-go', { 17: 255, 18: 255, 19: 0, 20: 0 });
	        break;
	      case 'dmx_on':
	        socket.emit('dmx-all', 255);
	        break;
	      case 'dmx_off':
	        socket.emit('dmx-all', 0);
	        break;
	
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = event.target.value / 100.0 * 255.0;
	    switch (event.target.id) {
	      case 'spot_pan':
	        console.log("in spot_pan " + slider_value);
	        socket.emit('dmx-go', { 0: slider_value, 2: slider_value });
	        break;
	      case 'spot_tilt':
	        console.log("in spot_tilt " + slider_value);
	        socket.emit('dmx-go', { 1: slider_value });
	        break;
	      case 'spot_intensity':
	        socket.emit('dmx-go', { 7: slider_value });
	        break;
	      case 'wash_intensity':
	        socket.emit('dmx-go', { 16: slider_value });
	        break;
	      case 'wash_pan':
	        socket.emit('dmx-go', { 22: slider_value });
	        break;
	      case 'wash_tilt':
	        socket.emit('dmx-go', { 23: slider_value });
	        break;
	      case 'wash_zoom':
	        socket.emit('dmx-go', { 27: slider_value });
	        break;
	
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	  }
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 6, sm: 3, md: 2, lg: 1 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	    this.setState({
	      items: [{
	        type: 0,
	        i: "spot_on",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Spot On'
	      }, {
	        type: 0,
	        i: "spot_off",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Spot Off'
	      }, {
	        type: 1,
	        i: "spot_intensity",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Spot Intensity'
	      }, {
	        type: 1,
	        i: "spot_tilt",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Spot Tilt'
	      }, {
	        type: 1,
	        i: "spot_pan",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Spot Pan'
	      }, {
	        type: 0,
	        i: "spot_white",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Spot White'
	      }, {
	        type: 0,
	        i: "spot_red",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Spot Red'
	      }, {
	        type: 0,
	        i: "spot_green",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Spot Green'
	      }, {
	        type: 0,
	        i: "spot_blue",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'Spot Blue'
	      }, {
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 2,
	        h: 1
	      }, {
	        type: 0,
	        i: "dmx_on",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'DMX ALL ON'
	      }, {
	        type: 0,
	        i: "dmx_off",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'DMX ALL OFF'
	      }, {
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 5,
	        h: 1
	      }, {
	        type: 0,
	        i: "wash_on",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Wash On'
	      }, {
	        type: 0,
	        i: "wash_off",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 5, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Wash Off'
	      }, {
	        type: 1,
	        i: "wash_intensity",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Wash Intensity'
	      }, {
	        type: 1,
	        i: "wash_pan",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Wash Pan'
	      }, {
	        type: 1,
	        i: "wash_tilt",
	        x: 5, // (this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, // Infinity,
	        w: 2,
	        h: 2,
	        text: 'Wash Tilt'
	      }, {
	        type: 1,
	        i: "wash_zoom",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Wash Zoom'
	      }, {
	        type: 0,
	        i: "wash_white",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Wash White'
	      }, {
	        type: 0,
	        i: "wash_red",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 7, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Wash Red'
	      }, {
	        type: 0,
	        i: "wash_green",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Wash Green'
	      }, {
	        type: 0,
	        i: "wash_blue",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 7, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'Wash Blue'
	      }, {
	        type: 0,
	        i: "wash_yellow",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Wash Yellow'
	      }, {
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity, 
	        w: 2,
	        h: 1
	      }, {
	        type: 0,
	        i: "vid_play1",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play1'
	      }, {
	        type: 0,
	        i: "vid_play2",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play2'
	      }, {
	        type: 0,
	        i: "vid_play3",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play3'
	      }, {
	        type: 0,
	        i: "vid_play4",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play4'
	      }, {
	        type: 0,
	        i: "vid_play5",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play5'
	      }, {
	        type: 0,
	        i: "vid_play6",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play6'
	      }, {
	        type: 0,
	        i: "vid_play7",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play7'
	      }, {
	        type: 0,
	        i: "vid_play8",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play8'
	      }, {
	        type: 0,
	        i: "vid_loop1",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop1'
	      }, {
	        type: 0,
	        i: "vid_loop2",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop2'
	      }, {
	        type: 0,
	        i: "vid_loop3",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop3'
	      }, {
	        type: 0,
	        i: "vid_loop4",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop4'
	      }, {
	        type: 0,
	        i: "vid_white",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Vid White'
	      }, {
	        type: 0,
	        i: "vid_red",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Vid Red'
	      }, {
	        type: 0,
	        i: "vid_green",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Vid Green'
	      }, {
	        type: 0,
	        i: "vid_blue",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'Vid Blue'
	      }]
	    });
	  }
	}
	exports.default = Demo;
	Demo.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class MediaGroup1 extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      lock: true,
	      host: '127.0.0.1',
	      port: 5250,
	      command: "",
	      response: '',
	      left_edge: '0.0',
	      top_edge: '0.0',
	      x_scale: '1.0',
	      y_scale: '1.0',
	      rotation: '0.0',
	      left_crop: '0.0',
	      top_crop: '0.0',
	      right_crop: '0.0',
	      bottom_crop: '0.0'
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleSliders = this.handleSliders.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onClick: this.handleButtons },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '0', max: '100', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	
	    switch (event.target.value) {
	      case 'vid_red':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 #FF0000' });
	        break;
	      case 'vid_white':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 #FFFFFF' });
	        break;
	      case 'vid_green':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 #00FF00' });
	        break;
	      case 'vid_blue':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 #0000FF' });
	        break;
	      case 'vid_play1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 bbb.mp4 LOOP' });
	        break;
	      case 'vid_play2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 beach.mp4 LOOP' });
	        break;
	      case 'vid_play3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 popup.mp4 LOOP' });
	        break;
	      case 'vid_play4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 nyc.mov LOOP ' });
	        break;
	      case 'vid_loop1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 fire.mov LOOP' });
	        break;
	      case 'vid_loop2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 tunnel.mov LOOP' });
	        break;
	      case 'vid_loop3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 blueTileFloor.mov LOOP' });
	        break;
	      case 'vid_loop4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 16189_2.mov LOOP' });
	        break;
	      case 'still_image1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 bigRock.jpg' });
	        break;
	      case 'still_image2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 balloons.jpg' });
	        break;
	      case 'still_image3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 circuit.jpg' });
	        break;
	      case 'still_image4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 WhiteHouse.jpg' });
	        break;
	      case 'foreground1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 cactus.png' });
	        break;
	      case 'foreground2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 barbedwire.jpg' });
	        break;
	      case 'foreground3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 tv.png' });
	        break;
	      case 'foreground4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 window.png' });
	        break;
	      case 'vid_stop':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'STOP 1-0' });
	        break;
	
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = event.target.value / 100.0;
	    switch (event.target.id) {
	      case 'left_edge':
	        this.state.left_edge = slider_value;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 1-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale });
	        break;
	      case 'top_edge':
	        this.state.top_edge = slider_value;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 1-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale });
	        break;
	      case 'x_scale':
	        this.state.x_scale = slider_value * 2.0;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 1-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale });
	        break;
	      case 'y_scale':
	        this.state.y_scale = slider_value * 2.0;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 1-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale });
	        break;
	      case 'proportional_scale':
	        this.state.y_scale = slider_value * 2.0;
	        this.state.x_scale = slider_value * 2.0;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 1-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale });
	        break;
	      case 'left_crop':
	        this.state.left_crop = slider_value;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 1-0 CROP " + this.state.left_crop + " " + this.state.top_crop + " " + this.state.right_crop + " " + this.state.bottom_crop });
	        break;
	      case 'top_crop':
	        this.state.top_crop = slider_value;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 1-0 CROP " + this.state.left_crop + " " + this.state.top_crop + " " + this.state.right_crop + " " + this.state.bottom_crop });
	        break;
	      case 'right_crop':
	        this.state.right_crop = slider_value;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 1-0 CROP " + this.state.left_crop + " " + this.state.top_crop + " " + this.state.right_crop + " " + this.state.bottom_crop });
	        break;
	      case 'bottom_crop':
	        this.state.bottom_crop = slider_value;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 1-0 CROP " + this.state.left_crop + " " + this.state.top_crop + " " + this.state.right_crop + " " + this.state.bottom_crop });
	        break;
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	  }
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'Group 1: MEDIA'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	    this.setState({
	      items: [{
	        type: 0,
	        i: "vid_play1",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play1'
	      }, {
	        type: 0,
	        i: "vid_play2",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play2'
	      }, {
	        type: 0,
	        i: "vid_play3",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play3'
	      }, {
	        type: 0,
	        i: "vid_play4",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play4'
	      }, {
	        type: 0,
	        i: "vid_loop1",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop1'
	      }, {
	        type: 0,
	        i: "vid_loop2",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop2'
	      }, {
	        type: 0,
	        i: "vid_loop3",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop3'
	      }, {
	        type: 0,
	        i: "vid_loop4",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop4'
	      }, {
	        type: 0,
	        i: "still_image1",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Still Image1'
	      }, {
	        type: 0,
	        i: "still_image2",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Still Image2'
	      }, {
	        type: 0,
	        i: "still_image3",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Still Image3'
	      }, {
	        type: 0,
	        i: "still_image4",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Still Image4'
	      }, {
	        type: 0,
	        i: "foreground1",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Foreground1'
	      }, {
	        type: 0,
	        i: "foreground2",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Foreground2'
	      }, {
	        type: 0,
	        i: "foreground3",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Foreground3'
	      }, {
	        type: 0,
	        i: "foreground4",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Foreground4'
	      }, {
	        type: 0,
	        i: "vid_white",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Vid White'
	      }, {
	        type: 0,
	        i: "vid_red",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Vid Red'
	      }, {
	        type: 0,
	        i: "vid_green",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Vid Green'
	      }, {
	        type: 0,
	        i: "vid_blue",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'Vid Blue'
	      }, {
	        type: 0,
	        i: "vid_stop",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'Vid Stop'
	      }, {
	        type: 1,
	        i: "left_edge",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Left Edge'
	      }, {
	        type: 1,
	        i: "top_edge",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Top Edge'
	      }, {
	        type: 1,
	        i: "x_scale",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 7, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'X Scale'
	      }, {
	        type: 1,
	        i: "y_scale",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 7, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Y Scale'
	      }, {
	        type: 1,
	        i: "proportional_scale",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 5, //Infinity,
	        w: 4,
	        h: 2,
	        text: 'Proportional Scale'
	      }, {
	        type: 1,
	        i: "left_crop",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Left Crop'
	      }, {
	        type: 1,
	        i: "top_crop",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Top Crop'
	      }, {
	        type: 1,
	        i: "right_crop",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 13, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Right Crop'
	      }, {
	        type: 1,
	        i: "bottom_crop",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 13, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Bottom Crop'
	      }]
	    });
	  }
	}
	exports.default = MediaGroup1;
	MediaGroup1.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class MediaGroup2 extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      lock: true,
	      host: '127.0.0.1',
	      port: 5250,
	      command: "",
	      response: '',
	      left_edge: '0.0',
	      top_edge: '0.0',
	      x_scale: '1.0',
	      y_scale: '1.0',
	      rotation: '0.0',
	      left_crop: '0.0',
	      top_crop: '0.0',
	      right_crop: '0.0',
	      bottom_crop: '0.0'
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleSliders = this.handleSliders.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onClick: this.handleButtons },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '1', max: '100', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	
	    switch (event.target.value) {
	      case 'vid_red':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 2-0 #FF0000' });
	        break;
	      case 'vid_white':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 2-0 #FFFFFF' });
	        break;
	      case 'vid_green':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 2-0 #00FF00' });
	        break;
	      case 'vid_blue':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 2-0 #0000FF' });
	        break;
	      case 'vid_play1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 bbb.mp4 LOOP' });
	        break;
	      case 'vid_play2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 beach.mp4 LOOP' });
	        break;
	      case 'vid_play3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 2-0 popup.mp4 LOOP' });
	        break;
	      case 'vid_play4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 nyc.mov LOOP' });
	        break;
	      case 'vid_loop1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 fire.mov LOOP' });
	        break;
	      case 'vid_loop2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 tunnel.mov LOOP' });
	        break;
	      case 'vid_loop3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 blueTileFloor.mov LOOP' });
	        break;
	      case 'vid_loop4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 16189_2.mov LOOP' });
	        break;
	      case 'still_image1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 bigRock.jpg' });
	        break;
	      case 'still_image2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 balloons.jpg' });
	        break;
	      case 'still_image3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 circuit.jpg' });
	        break;
	      case 'still_image4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 WhiteHouse.jpg' });
	        break;
	      case 'foreground1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 cactus.png' });
	        break;
	      case 'foreground2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 barbedwire.jpg' });
	        break;
	      case 'foreground3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 tv.png' });
	        break;
	      case 'foreground4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 window.png' });
	        break;
	      case 'vid_stop':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'STOP 2-0' });
	        break;
	
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = event.target.value / 100.0;
	    switch (event.target.id) {
	      case 'left_edge':
	        this.state.left_edge = slider_value;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale });
	        break;
	      case 'top_edge':
	        this.state.top_edge = slider_value;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale });
	        break;
	      case 'x_scale':
	        this.state.x_scale = slider_value * 2.0;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale });
	        break;
	      case 'y_scale':
	        this.state.y_scale = slider_value * 2.0;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale });
	        break;
	      case 'proportional_scale':
	        this.state.y_scale = slider_value * 2.0;
	        this.state.x_scale = slider_value * 2.0;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale });
	        break;
	      case 'left_crop':
	        this.state.left_crop = slider_value;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 CROP " + this.state.left_crop + " " + this.state.top_crop + " " + this.state.right_crop + " " + this.state.bottom_crop });
	        break;
	      case 'top_crop':
	        this.state.top_crop = slider_value;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 CROP " + this.state.left_crop + " " + this.state.top_crop + " " + this.state.right_crop + " " + this.state.bottom_crop });
	        break;
	      case 'right_crop':
	        this.state.right_crop = slider_value;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 CROP " + this.state.left_crop + " " + this.state.top_crop + " " + this.state.right_crop + " " + this.state.bottom_crop });
	        break;
	      case 'bottom_crop':
	        this.state.bottom_crop = slider_value;
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 CROP " + this.state.left_crop + " " + this.state.top_crop + " " + this.state.right_crop + " " + this.state.bottom_crop });
	        break;
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	  }
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'Group 2: MEDIA'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	    this.setState({
	      items: [{
	        type: 0,
	        i: "vid_play1",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play1'
	      }, {
	        type: 0,
	        i: "vid_play2",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play2'
	      }, {
	        type: 0,
	        i: "vid_play3",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play3'
	      }, {
	        type: 0,
	        i: "vid_play4",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play4'
	      }, {
	        type: 0,
	        i: "vid_loop1",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop1'
	      }, {
	        type: 0,
	        i: "vid_loop2",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop2'
	      }, {
	        type: 0,
	        i: "vid_loop3",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop3'
	      }, {
	        type: 0,
	        i: "vid_loop4",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop4'
	      }, {
	        type: 0,
	        i: "still_image1",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Still Image1'
	      }, {
	        type: 0,
	        i: "still_image2",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Still Image2'
	      }, {
	        type: 0,
	        i: "still_image3",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Still Image3'
	      }, {
	        type: 0,
	        i: "still_image4",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Still Image4'
	      }, {
	        type: 0,
	        i: "foreground1",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Foreground1'
	      }, {
	        type: 0,
	        i: "foreground2",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Foreground2'
	      }, {
	        type: 0,
	        i: "foreground3",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Foreground3'
	      }, {
	        type: 0,
	        i: "foreground4",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Foreground4'
	      }, {
	        type: 0,
	        i: "vid_white",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Vid White'
	      }, {
	        type: 0,
	        i: "vid_red",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Vid Red'
	      }, {
	        type: 0,
	        i: "vid_green",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Vid Green'
	      }, {
	        type: 0,
	        i: "vid_blue",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'Vid Blue'
	      }, {
	        type: 0,
	        i: "vid_stop",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'Vid Stop'
	      }, {
	        type: 1,
	        i: "left_edge",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Left Edge'
	      }, {
	        type: 1,
	        i: "top_edge",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Top Edge'
	      }, {
	        type: 1,
	        i: "x_scale",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 7, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'X Scale'
	      }, {
	        type: 1,
	        i: "y_scale",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 7, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Y Scale'
	      }, {
	        type: 1,
	        i: "proportional_scale",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 5, //Infinity,
	        w: 4,
	        h: 2,
	        text: 'Proportional Scale'
	      }, {
	        type: 1,
	        i: "left_crop",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Left Crop'
	      }, {
	        type: 1,
	        i: "top_crop",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Top Crop'
	      }, {
	        type: 1,
	        i: "right_crop",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 13, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Right Crop'
	      }, {
	        type: 1,
	        i: "bottom_crop",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 13, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Bottom Crop'
	      }]
	    });
	  }
	}
	exports.default = MediaGroup2;
	MediaGroup2.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class MediaGroup3 extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      lock: true,
	      host: '127.0.0.1',
	      port: 5250,
	      command: "",
	      response: ''
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onClick: this.handleButtons },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '1', max: '100', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	
	    switch (event.target.value) {
	      case 'vid_red':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 3-0 #FF0000' });
	        break;
	      case 'vid_white':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 3-0 #FFFFFF' });
	        break;
	      case 'vid_green':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 3-0 #00FF00' });
	        break;
	      case 'vid_blue':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 3-0 #0000FF' });
	        break;
	      case 'vid_play1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 CaliforniaTimelapse.mov' });
	        break;
	      case 'vid_play2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 beach.mp4' });
	        break;
	      case 'vid_play3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 3-0 psych1.mov' });
	        break;
	      case 'vid_play4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 nyc.mp4' });
	        break;
	      case 'vid_loop1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 fire.mov LOOP' });
	        break;
	      case 'vid_loop2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 tunnel.mov LOOP' });
	        break;
	      case 'vid_loop3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 blueTileFloor.mov LOOP' });
	        break;
	      case 'vid_loop4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 16189_2.mov LOOP' });
	        break;
	      case 'still_image1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 bigRock.jpg' });
	        break;
	      case 'still_image2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 circuit.jpg' });
	        break;
	      case 'still_image3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 mime.jpg' });
	        break;
	      case 'still_image4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 WhiteHouse.jpg' });
	        break;
	      case 'foreground1':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 cactus.png' });
	        break;
	      case 'foreground2':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 barbedwire.jpg' });
	        break;
	      case 'foreground3':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 tv.png' });
	        break;
	      case 'foreground4':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 window.png' });
	        break;
	      case 'vid_stop':
	        socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'STOP 3-0' });
	        break;
	
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'Group 3: MEDIA'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	    this.setState({
	      items: [{
	        type: 0,
	        i: "vid_play1",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play1'
	      }, {
	        type: 0,
	        i: "vid_play2",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play2'
	      }, {
	        type: 0,
	        i: "vid_play3",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play3'
	      }, {
	        type: 0,
	        i: "vid_play4",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Play4'
	      }, {
	        type: 0,
	        i: "vid_loop1",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop1'
	      }, {
	        type: 0,
	        i: "vid_loop2",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop2'
	      }, {
	        type: 0,
	        i: "vid_loop3",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop3'
	      }, {
	        type: 0,
	        i: "vid_loop4",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Vid Loop4'
	      }, {
	        type: 0,
	        i: "still_image1",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Still Image1'
	      }, {
	        type: 0,
	        i: "still_image2",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Still Image2'
	      }, {
	        type: 0,
	        i: "still_image3",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Still Image3'
	      }, {
	        type: 0,
	        i: "still_image4",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Still Image4'
	      }, {
	        type: 0,
	        i: "foreground1",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Foreground1'
	      }, {
	        type: 0,
	        i: "foreground2",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Foreground2'
	      }, {
	        type: 0,
	        i: "foreground3",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Foreground3'
	      }, {
	        type: 0,
	        i: "foreground4",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Foreground4'
	      }, {
	        type: 0,
	        i: "vid_white",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Vid White'
	      }, {
	        type: 0,
	        i: "vid_red",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Vid Red'
	      }, {
	        type: 0,
	        i: "vid_green",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Vid Green'
	      }, {
	        type: 0,
	        i: "vid_blue",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'Vid Blue'
	      }, {
	        type: 0,
	        i: "vid_stop",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'Vid Stop'
	      }]
	    });
	  }
	}
	exports.default = MediaGroup3;
	MediaGroup3.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class DMXSpotGroup1 extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      lock: true,
	      compactType: null,
	      spotIntensity: '127',
	      spotPan: '0',
	      spotFinePan: '127',
	      spotTilt: '0',
	      spotFineTilt: '127',
	      spotSpeed: '215',
	      presets: [].map(function (i, key, list) {
	        return {
	          i: i.toString(),
	          spotIntensity: '127',
	          spotPan: '0',
	          spotFinePan: '127',
	          spotTilt: '0',
	          spotFineTilt: '127',
	          spotSpeed: '215',
	          add: i === (list.length - 1).toString()
	        };
	      })
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleSliders = this.handleSliders.bind(this);
	    this.savePreset = this.savePreset.bind(this);
	    this.loadPreset = this.loadPreset.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onClick: this.handleButtons },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '1', max: '255', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	
	    switch (event.target.value) {
	
	      case 'spot_on':
	        socket.emit('dmx-go', { 5: 0, 6: 216, 7: 255 });
	        break;
	      case 'spot_off':
	        socket.emit('dmx-go', { 6: 0, 7: 0 });
	        break;
	      case 'save_preset_1':
	        this.savePreset(1);
	        break;
	      case 'save_preset_3':
	        this.savePreset(3);
	        break;
	      case 'save_preset_4':
	        this.savePreset(4);
	        break;
	      case 'save_preset_5':
	        this.savePreset(5);
	        break;
	      case 'save_preset_6':
	        this.savePreset(6);
	        break;
	      case 'save_preset_2':
	        this.savePreset(2);
	        break;
	      case 'recall_preset_1':
	        this.loadPreset(1);
	        break;
	      case 'recall_preset_2':
	        this.loadPreset(2);
	        break;
	      case 'recall_preset_3':
	        this.loadPreset(3);
	        break;
	      case 'recall_preset_4':
	        this.loadPreset(4);
	        break;
	      case 'recall_preset_5':
	        this.loadPreset(5);
	        break;
	      case 'recall_preset_6':
	        this.loadPreset(6);
	        break;
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = event.target.value;
	
	    let items = this.state.items;
	    for (let i = 0; i < items.length; i++) {
	      if (items[i].i == event.target.id) {
	        items[i].sliderValue = slider_value;
	      }
	    }
	    this.setState({ items: items });
	
	    switch (event.target.id) {
	      case 'spot_pan':
	        this.setState({ spotPan: slider_value });
	        socket.emit('dmx-go', { 0: slider_value });
	        break;
	      case 'spot_tilt':
	        this.setState({ spotTilt: slider_value });
	        socket.emit('dmx-go', { 1: slider_value });
	        break;
	      case 'spot_speed':
	        this.setState({ spotSpeed: slider_value });
	        socket.emit('dmx-go', { 4: slider_value });
	        break;
	      case 'spot_fine_pan':
	        this.setState({ spotFinePan: slider_value });
	        socket.emit('dmx-go', { 2: slider_value });
	        break;
	      case 'spot_fine_tilt':
	        this.setState({ spotFineTilt: slider_value });
	        socket.emit('dmx-go', { 3: slider_value });
	        break;
	      case 'spot_intensity':
	        this.setState({ spotIntensity: slider_value });
	        socket.emit('dmx-go', { 7: slider_value });
	        break;
	
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	  }
	  savePreset(preset) {
	    let presets = this.state.presets;
	    console.log("save preset " + preset + ": " + presets[preset]);
	    presets[preset].spotIntensity = this.state.spotIntensity;
	    presets[preset].spotPan = this.state.spotPan;
	    presets[preset].spotTilt = this.state.spotTilt;
	    presets[preset].spotFinePan = this.state.spotFinePan;
	    presets[preset].spotFineTilt = this.state.spotFineTilt;
	    presets[preset].spotSpeed = this.state.spotSpeed;
	    this.setState({ presets: presets });
	  }
	  loadPreset(preset) {
	    let items = this.state.items;
	    let presets = this.state.presets;
	    for (let i = 0; i < items.length; i++) {
	      if (items[i].i == "spot_pan") {
	        items[i].sliderValue = presets[preset].spotPan;
	        socket.emit('dmx-go', { 80: presets[preset].spotPan });
	      }
	      if (items[i].i == "spot_tilt") {
	        items[i].sliderValue = presets[preset].spotTilt;
	        socket.emit('dmx-go', { 82: presets[preset].spotTilt });
	      }
	      if (items[i].i == "spot_fine_pan") {
	        items[i].sliderValue = presets[preset].spotFinePan;
	        socket.emit('dmx-go', { 81: presets[preset].spotFinePan });
	      }
	      if (items[i].i == "spot_fine_tilt") {
	        items[i].sliderValue = presets[preset].spotFineTilt;
	        socket.emit('dmx-go', { 83: presets[preset].spotFineTilt });
	      }
	      if (items[i].i == "spot_speed") {
	        items[i].sliderValue = presets[preset].spotSpeed;
	        socket.emit('dmx-go', { 84: presets[preset].spotSpeed });
	      }
	      if (items[i].i == "spot_intensity") {
	        items[i].sliderValue = presets[preset].spotIntensity;
	        socket.emit('dmx-go', { 89: presets[preset].spotIntensity });
	      }
	    }
	    this.setState({ items: items });
	  }
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'Group 1: Spot LIGHT'
	            ),
	            ' DMX: 1'
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock,
	            compactType: this.state.compactType
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	    this.setState({
	      items: [{
	        type: 0,
	        i: "spot_on",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 2,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Spot On'
	      }, {
	        type: 0,
	        i: "spot_off",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 2,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Spot Off'
	      }, {
	        type: 1,
	        i: "spot_intensity",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Intensity'
	      }, {
	        type: 1,
	        i: "spot_tilt",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Tilt'
	      }, {
	        type: 1,
	        i: "spot_pan",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Pan'
	      }, {
	        type: 1,
	        i: "spot_speed",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Speed'
	      }, {
	        type: 1,
	        i: "spot_fine_tilt",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Fine Tilt'
	      }, {
	        type: 1,
	        i: "spot_fine_pan",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Fine Pan'
	      }, {
	        type: 0,
	        i: "recall_preset_1",
	        x: 0,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 1'
	      }, {
	        type: 0,
	        i: "recall_preset_2",
	        x: 1,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 2'
	      }, {
	        type: 0,
	        i: "recall_preset_3",
	        x: 2,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 3'
	      }, {
	        type: 0,
	        i: "recall_preset_4",
	        x: 3,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 4'
	      }, {
	        type: 0,
	        i: "recall_preset_5",
	        x: 4,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 5'
	      }, {
	        type: 0,
	        i: "recall_preset_6",
	        x: 5,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 6'
	      }, {
	        type: 0,
	        i: "save_preset_1",
	        x: 0,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 1'
	      }, {
	        type: 0,
	        i: "save_preset_2",
	        x: 1,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 2'
	      }, {
	        type: 0,
	        i: "save_preset_3",
	        x: 2,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 3'
	      }, {
	        type: 0,
	        i: "save_preset_4",
	        x: 3,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 4'
	      }, {
	        type: 0,
	        i: "save_preset_5",
	        x: 4,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 5'
	      }, {
	        type: 0,
	        i: "save_preset_6",
	        x: 5,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 6'
	      }],
	      presets: [{
	        spotIntensity: '127',
	        spotPan: '0',
	        spotFinePan: '127',
	        spotTilt: '0',
	        spotFineTilt: '127',
	        spotSpeed: '215'
	      }, {}, {}, {}, {}, {}, {}]
	    });
	  }
	}
	exports.default = DMXSpotGroup1;
	DMXSpotGroup1.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(22);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _Toast = __webpack_require__(33);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class DMXWashGroup1 extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      toastVisible: false, toastMessage: '', toastType: 'success',
	      lock: true,
	      compactType: null,
	      instrument_id: "wash_1",
	      dmx_offset: 17,
	      dmx_data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleSliders = this.handleSliders.bind(this);
	    this.savePreset = this.savePreset.bind(this);
	    this.loadPreset = this.loadPreset.bind(this);
	    this.showError = this.showError.bind(this);
	    this.dismissToast = this.dismissToast.bind(this);
	  }
	  showError(message) {
	    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
	  }
	  dismissToast() {
	    this.setState({ toastVisible: false });
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onClick: this.handleButtons },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '1', max: '255', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let dmx_data = this.state.dmx_data;
	
	    switch (event.target.value) {
	      case 'wash_on':
	        dmx_data[0] = 255;
	        socket.emit('dmx-go', { dmx: { 1: 255 }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_off':
	        dmx_data[0] = 0;
	        socket.emit('dmx-go', { dmx: { 1: 0 }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_white':
	        dmx_data[1] = 0;
	        dmx_data[2] = 0;
	        dmx_data[3] = 0;
	        dmx_data[4] = 255;
	        socket.emit('dmx-go', { dmx: { 2: 0, 3: 0, 4: 0, 5: 255 }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_red':
	        dmx_data[1] = 255;
	        dmx_data[2] = 0;
	        dmx_data[3] = 0;
	        dmx_data[4] = 0;
	        socket.emit('dmx-go', { dmx: { 2: 255, 3: 0, 4: 0, 5: 0 }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_green':
	        dmx_data[1] = 0;
	        dmx_data[2] = 255;
	        dmx_data[3] = 0;
	        dmx_data[4] = 0;
	        socket.emit('dmx-go', { dmx: { 2: 0, 3: 255, 4: 0, 5: 0 }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_blue':
	        dmx_data[1] = 0;
	        dmx_data[2] = 0;
	        dmx_data[3] = 255;
	        dmx_data[4] = 0;
	        socket.emit('dmx-go', { dmx: { 2: 0, 3: 0, 4: 255, 5: 0 }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_yellow':
	        dmx_data[1] = 255;
	        dmx_data[2] = 255;
	        dmx_data[3] = 0;
	        dmx_data[4] = 0;
	        socket.emit('dmx-go', { dmx: { 2: 255, 3: 255, 4: 0, 5: 0 }, offset: this.state.dmx_offset });
	        break;
	      case 'save_preset_1':
	        this.savePreset(1);
	        break;
	      case 'save_preset_2':
	        this.savePreset(2);
	        break;
	      case 'save_preset_3':
	        this.savePreset(3);
	        break;
	      case 'save_preset_4':
	        this.savePreset(4);
	        break;
	      case 'save_preset_5':
	        this.savePreset(5);
	        break;
	      case 'save_preset_6':
	        this.savePreset(6);
	        break;
	      case 'recall_preset_1':
	        this.loadPreset(1);
	        break;
	      case 'recall_preset_2':
	        this.loadPreset(2);
	        break;
	      case 'recall_preset_3':
	        this.loadPreset(3);
	        break;
	      case 'recall_preset_4':
	        this.loadPreset(4);
	        break;
	      case 'recall_preset_5':
	        this.loadPreset(5);
	        break;
	      case 'recall_preset_6':
	        this.loadPreset(6);
	        break;
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	    this.setState({ dmx_data: dmx_data });
	    console.log("dmx_data: " + this.state.dmx_data);
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = Number(event.target.value);
	    let dmx_data = this.state.dmx_data;
	
	    let items = this.state.items;
	    for (let i = 0; i < items.length; i++) {
	      if (items[i].i == event.target.id) {
	        items[i].sliderValue = slider_value;
	      }
	    }
	    this.setState({ items: items });
	
	    switch (event.target.id) {
	
	      case 'wash_intensity':
	        dmx_data[0] = slider_value;
	        socket.emit('dmx-go', { dmx: { 1: slider_value }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_pan':
	        slider_value = Math.floor(slider_value / 255 * 86 + 42);
	        dmx_data[6] = slider_value;
	        socket.emit('dmx-go', { dmx: { 7: slider_value }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_tilt':
	        slider_value = Math.floor(210 - slider_value / 255 * 86);
	        dmx_data[7] = slider_value;
	        socket.emit('dmx-go', { dmx: { 8: slider_value }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_fine_pan':
	        dmx_data[8] = slider_value;
	        socket.emit('dmx-go', { dmx: { 9: slider_value }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_fine_tilt':
	        dmx_data[9] = slider_value;
	        socket.emit('dmx-go', { dmx: { 10: slider_value }, offset: this.state.dmx_offset });
	        break;
	      case 'wash_zoom':
	        dmx_data[11] = slider_value;
	        socket.emit('dmx-go', { dmx: { 12: slider_value }, offset: this.state.dmx_offset });
	        break;
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	    this.setState({ dmx_data: dmx_data });
	    console.log("dmx_data: " + this.state.dmx_data);
	  }
	  savePreset(preset) {
	    const newDMXPreset = {
	      instrument: this.state.instrument_id, dmx_offset: this.state.dmx_offset, preset_num: preset,
	      dmx_data: this.state.dmx_data
	    };
	    fetch('/api/dmx_presets', {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify(newDMXPreset)
	    }).then(response => {
	      if (response.ok) {
	        response.json().then(updatedIssue => {});
	      } else {
	        response.json().then(error => {
	          this.showError(`Failed to add issue: ${error.message}`);
	        });
	      }
	    }).catch(err => {
	      this.showError(`Error in sending data to server: ${err.message}`);
	    });
	  }
	  loadPreset(preset) {}
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'Group 1: Wash LIGHT (',
	              this.state.instrument_id,
	              ') '
	            ),
	            ' DMX OFFSET: ',
	            this.state.dmx_offset
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            null,
	            _react2.default.createElement(_Toast2.default, {
	              showing: this.state.toastVisible, message: this.state.toastMessage,
	              onDismiss: this.dismissToast, bsStyle: this.state.toastType
	            })
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock,
	            compactType: this.state.compactType
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	    this.setState({
	      items: [{
	        type: 0,
	        i: "wash_on",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 2,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Wash On'
	      }, {
	        type: 0,
	        i: "wash_off",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 2,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Wash Off'
	      }, {
	        type: 1,
	        i: "wash_intensity",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Wash Intensity'
	      }, {
	        type: 1,
	        i: "wash_pan",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Wash Pan'
	      }, {
	        type: 1,
	        i: "wash_tilt",
	        x: 0, // (this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, // Infinity,
	        w: 12,
	        h: 2,
	        text: 'Wash Tilt'
	      }, {
	        type: 1,
	        i: "wash_fine_pan",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Wash Fine Pan'
	      }, {
	        type: 1,
	        i: "wash_fine_tilt",
	        x: 0, // (this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, // Infinity,
	        w: 12,
	        h: 2,
	        text: 'Wash Fine Tilt'
	      }, {
	        type: 1,
	        i: "wash_zoom",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Wash Zoom'
	      }, {
	        type: 0,
	        i: "wash_white",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 14, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Wash White'
	      }, {
	        type: 0,
	        i: "wash_red",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 14, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Wash Red'
	      }, {
	        type: 0,
	        i: "wash_green",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 14, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Wash Green'
	      }, {
	        type: 0,
	        i: "wash_blue",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 14, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'Wash Blue'
	      }, {
	        type: 0,
	        i: "wash_yellow",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 14, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Wash Yellow'
	      }, {
	        type: 0,
	        i: "recall_preset_1",
	        x: 0,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 1'
	      }, {
	        type: 0,
	        i: "recall_preset_2",
	        x: 1,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 2'
	      }, {
	        type: 0,
	        i: "recall_preset_3",
	        x: 2,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 3'
	      }, {
	        type: 0,
	        i: "recall_preset_4",
	        x: 3,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 4'
	      }, {
	        type: 0,
	        i: "recall_preset_5",
	        x: 4,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 5'
	      }, {
	        type: 0,
	        i: "recall_preset_6",
	        x: 5,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 6'
	      }, {
	        type: 0,
	        i: "save_preset_1",
	        x: 0,
	        y: 16,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 1'
	      }, {
	        type: 0,
	        i: "save_preset_2",
	        x: 1,
	        y: 16,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 2'
	      }, {
	        type: 0,
	        i: "save_preset_3",
	        x: 2,
	        y: 16,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 3'
	      }, {
	        type: 0,
	        i: "save_preset_4",
	        x: 3,
	        y: 16,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 4'
	      }, {
	        type: 0,
	        i: "save_preset_5",
	        x: 4,
	        y: 16,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 5'
	      }, {
	        type: 0,
	        i: "save_preset_6",
	        x: 5,
	        y: 16,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 6'
	      }],
	      presets: [{
	        washIntensity: '127',
	        washPan: '0',
	        washFinePan: '127',
	        washTilt: '0',
	        washFineTilt: '127',
	        washZoom: '215',
	        washColor: { 17: 0, 18: 0, 19: 255, 20: 0 }
	      }, {}, {}, {}, {}, {}, {}]
	
	    });
	  }
	}
	exports.default = DMXWashGroup1;
	DMXWashGroup1.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class DMX155Group2 extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      lock: true,
	      compactType: null,
	      spotIntensity: '127',
	      spotPan: '0',
	      spotFinePan: '127',
	      spotTilt: '0',
	      spotFineTilt: '127',
	      spotSpeed: '215',
	      presets: [].map(function (i, key, list) {
	        return {
	          i: i.toString(),
	          spotIntensity: '127',
	          spotPan: '0',
	          spotFinePan: '127',
	          spotTilt: '0',
	          spotFineTilt: '127',
	          spotSpeed: '215',
	          add: i === (list.length - 1).toString()
	        };
	      })
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleSliders = this.handleSliders.bind(this);
	    this.savePreset = this.savePreset.bind(this);
	    this.loadPreset = this.loadPreset.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onClick: this.handleButtons },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '0', max: '255', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	
	    switch (event.target.value) {
	
	      case 'spot_on':
	        socket.emit('dmx-go', { 45: 0, 46: 216, 47: 255 });
	        break;
	      case 'spot_off':
	        socket.emit('dmx-go', { 46: 0, 47: 0 });
	        break;
	      case 'spot_white':
	        socket.emit('dmx-go', { 45: 0, 46: 216, 47: 255 });
	        break;
	      case 'spot_yellow':
	        socket.emit('dmx-go', { 45: 6, 46: 216, 47: 255 });
	        break;
	      case 'spot_red':
	        socket.emit('dmx-go', { 45: 24, 46: 216, 47: 255 });
	        break;
	      case 'spot_green':
	        socket.emit('dmx-go', { 45: 18, 46: 216, 47: 255 });
	        break;
	      case 'spot_blue':
	        socket.emit('dmx-go', { 45: 42, 46: 216, 47: 255 });
	        break;
	      case 'wash_on':
	        socket.emit('dmx-go', { 56: 255 });
	        break;
	      case 'wash_off':
	        socket.emit('dmx-go', { 56: 0 });
	        break;
	      case 'wash_white':
	        socket.emit('dmx-go', { 57: 0, 58: 0, 59: 0, 60: 255 });
	        break;
	      case 'wash_red':
	        socket.emit('dmx-go', { 57: 255, 58: 0, 59: 0, 60: 0 });
	        break;
	      case 'wash_green':
	        socket.emit('dmx-go', { 57: 0, 58: 255, 59: 0, 60: 0 });
	        break;
	      case 'wash_blue':
	        socket.emit('dmx-go', { 57: 0, 58: 0, 59: 255, 20: 0 });
	        break;
	      case 'wash_yellow':
	        socket.emit('dmx-go', { 57: 255, 58: 255, 59: 0, 60: 0 });
	        break;
	      case 'save_preset_1':
	        this.savePreset(1);
	        break;
	      case 'save_preset_3':
	        this.savePreset(3);
	        break;
	      case 'save_preset_4':
	        this.savePreset(4);
	        break;
	      case 'save_preset_5':
	        this.savePreset(5);
	        break;
	      case 'save_preset_6':
	        this.savePreset(6);
	        break;
	      case 'save_preset_2':
	        this.savePreset(2);
	        break;
	      case 'recall_preset_1':
	        this.loadPreset(1);
	        break;
	      case 'recall_preset_2':
	        this.loadPreset(2);
	        break;
	      case 'recall_preset_3':
	        this.loadPreset(3);
	        break;
	      case 'recall_preset_4':
	        this.loadPreset(4);
	        break;
	      case 'recall_preset_5':
	        this.loadPreset(5);
	        break;
	      case 'recall_preset_6':
	        this.loadPreset(6);
	        break;
	
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = event.target.value;
	
	    let items = this.state.items;
	    for (let i = 0; i < items.length; i++) {
	      if (items[i].i == event.target.id) {
	        items[i].sliderValue = slider_value;
	      }
	    }
	    this.setState({ items: items });
	
	    switch (event.target.id) {
	      case 'spot_pan':
	        this.setState({ spotPan: slider_value });
	        socket.emit('dmx-go', { 40: slider_value });
	        break;
	      case 'spot_tilt':
	        this.setState({ spotTilt: slider_value });
	        socket.emit('dmx-go', { 41: slider_value });
	        break;
	      case 'spot_fine_pan':
	        this.setState({ spotFinePan: slider_value });
	        socket.emit('dmx-go', { 42: slider_value });
	        break;
	      case 'spot_fine_tilt':
	        this.setState({ spotFineTilt: slider_value });
	        socket.emit('dmx-go', { 43: slider_value });
	        break;
	      case 'spot_speed':
	        this.setState({ spotSpeed: slider_value });
	        socket.emit('dmx-go', { 44: slider_value });
	        break;
	      case 'all_intensity':
	        socket.emit('dmx-go', { 46: 216, 47: slider_value, 56: slider_value });
	        break;
	      case 'spot_intensity':
	        this.setState({ spotIntensity: slider_value });
	        socket.emit('dmx-go', { 47: slider_value });
	        break;
	      case 'wash_intensity':
	        socket.emit('dmx-go', { 56: slider_value });
	        break;
	      case 'wash_pan':
	        socket.emit('dmx-go', { 62: slider_value });
	        break;
	      case 'wash_tilt':
	        socket.emit('dmx-go', { 63: slider_value });
	        break;
	      case 'wash_fine_pan':
	        socket.emit('dmx-go', { 64: slider_value });
	        break;
	      case 'wash_fine_tilt':
	        socket.emit('dmx-go', { 65: slider_value });
	        break;
	      case 'wash_zoom':
	        socket.emit('dmx-go', { 67: slider_value });
	        break;
	
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	  }
	  savePreset(preset) {
	    let presets = this.state.presets;
	    console.log("save preset " + preset + ": " + presets[preset]);
	    presets[preset].spotIntensity = this.state.spotIntensity;
	    presets[preset].spotPan = this.state.spotPan;
	    presets[preset].spotTilt = this.state.spotTilt;
	    presets[preset].spotFinePan = this.state.spotFinePan;
	    presets[preset].spotFineTilt = this.state.spotFineTilt;
	    presets[preset].spotSpeed = this.state.spotSpeed;
	    this.setState({ presets: presets });
	  }
	  loadPreset(preset) {
	    let items = this.state.items;
	    let presets = this.state.presets;
	    for (let i = 0; i < items.length; i++) {
	      if (items[i].i == "spot_pan") {
	        items[i].sliderValue = presets[preset].spotPan;
	        socket.emit('dmx-go', { 80: presets[preset].spotPan });
	      }
	      if (items[i].i == "spot_tilt") {
	        items[i].sliderValue = presets[preset].spotTilt;
	        socket.emit('dmx-go', { 82: presets[preset].spotTilt });
	      }
	      if (items[i].i == "spot_fine_pan") {
	        items[i].sliderValue = presets[preset].spotFinePan;
	        socket.emit('dmx-go', { 81: presets[preset].spotFinePan });
	      }
	      if (items[i].i == "spot_fine_tilt") {
	        items[i].sliderValue = presets[preset].spotFineTilt;
	        socket.emit('dmx-go', { 83: presets[preset].spotFineTilt });
	      }
	      if (items[i].i == "spot_speed") {
	        items[i].sliderValue = presets[preset].spotSpeed;
	        socket.emit('dmx-go', { 84: presets[preset].spotSpeed });
	      }
	      if (items[i].i == "spot_intensity") {
	        items[i].sliderValue = presets[preset].spotIntensity;
	        socket.emit('dmx-go', { 89: presets[preset].spotIntensity });
	      }
	    }
	    this.setState({ items: items });
	  }
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'Group 2: SPOT LIGHT 155'
	            ),
	            ' DMX: 41'
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock,
	            compactType: this.state.compactType
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	
	    this.setState({
	      items: [
	      /*{
	          type: 0,
	          i: "dmx_off",
	          x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	          y: 0, //Infinity, 
	          w: 2,
	          h: 2,
	          className: 'btn-block btn btn-danger',
	          text: 'Lights Out',
	        },
	        {
	          type: 1,
	          i: "all_intensity",
	          x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	          y: 0, //Infinity, 
	          w: 2,
	          h: 2,
	          text: 'Master Intensity',
	        },*/
	      {
	        type: 0,
	        i: "spot_on",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 2,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Spot On'
	      }, {
	        type: 0,
	        i: "spot_off",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 2,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Spot Off'
	      }, {
	        type: 1,
	        i: "spot_intensity",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Intensity'
	      }, {
	        type: 1,
	        i: "spot_tilt",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Tilt'
	      }, {
	        type: 1,
	        i: "spot_pan",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Pan'
	      }, {
	        type: 1,
	        i: "spot_speed",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Speed'
	      }, {
	        type: 1,
	        i: "spot_fine_tilt",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Fine Tilt'
	      }, {
	        type: 1,
	        i: "spot_fine_pan",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 12,
	        h: 2,
	        text: 'Spot Fine Pan'
	      }, {
	        type: 0,
	        i: "recall_preset_1",
	        x: 0,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 1'
	      }, {
	        type: 0,
	        i: "recall_preset_2",
	        x: 1,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 2'
	      }, {
	        type: 0,
	        i: "recall_preset_3",
	        x: 2,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 3'
	      }, {
	        type: 0,
	        i: "recall_preset_4",
	        x: 3,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 4'
	      }, {
	        type: 0,
	        i: "recall_preset_5",
	        x: 4,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 5'
	      }, {
	        type: 0,
	        i: "recall_preset_6",
	        x: 5,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 6'
	      }, {
	        type: 0,
	        i: "save_preset_1",
	        x: 0,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 1'
	      }, {
	        type: 0,
	        i: "save_preset_2",
	        x: 1,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 2'
	      }, {
	        type: 0,
	        i: "save_preset_3",
	        x: 2,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 3'
	      }, {
	        type: 0,
	        i: "save_preset_4",
	        x: 3,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 4'
	      }, {
	        type: 0,
	        i: "save_preset_5",
	        x: 4,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 5'
	      }, {
	        type: 0,
	        i: "save_preset_6",
	        x: 5,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 6'
	      }],
	      presets: [{
	        spotIntensity: '127',
	        spotPan: '0',
	        spotFinePan: '127',
	        spotTilt: '0',
	        spotFineTilt: '127',
	        spotSpeed: '215'
	      }, {}, {}, {}, {}, {}, {}]
	    });
	  }
	}
	exports.default = DMX155Group2;
	DMX155Group2.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class DMX255Group2 extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: '0'
	        };
	      }),
	      lock: true,
	      compactType: null,
	      spotIntensity: '127',
	      spotPan: '0',
	      spotFinePan: '127',
	      spotTilt: '0',
	      spotFineTilt: '127',
	      spotSpeed: '215',
	      presets: [].map(function (i, key, list) {
	        return {
	          i: i.toString(),
	          spotIntensity: '127',
	          spotPan: '0',
	          spotFinePan: '127',
	          spotTilt: '0',
	          spotFineTilt: '127',
	          spotSpeed: '215',
	          add: i === (list.length - 1).toString()
	        };
	      })
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleSliders = this.handleSliders.bind(this);
	    this.savePreset = this.savePreset.bind(this);
	    this.loadPreset = this.loadPreset.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onClick: this.handleButtons },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '0', max: '255', step: '1', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	    console.log("does this change? " + el.i + " " + el.sliderValue);
	  }
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	
	    switch (event.target.value) {
	
	      case 'spot_on':
	        socket.emit('dmx-go', { 89: 255, 90: 216, 95: 0, 84: 215 });
	        break;
	      case 'spot_off':
	        this.setState({ spotIntensity: 0 });
	        socket.emit('dmx-go', { 89: 0, 90: 0 });
	        break;
	      case 'save_preset_1':
	        this.savePreset(1);
	        break;
	      case 'save_preset_3':
	        this.savePreset(3);
	        break;
	      case 'save_preset_4':
	        this.savePreset(4);
	        break;
	      case 'save_preset_5':
	        this.savePreset(5);
	        break;
	      case 'save_preset_6':
	        this.savePreset(6);
	        break;
	      case 'save_preset_2':
	        this.savePreset(2);
	        break;
	      case 'recall_preset_1':
	        this.loadPreset(1);
	        break;
	      case 'recall_preset_2':
	        this.loadPreset(2);
	        break;
	      case 'recall_preset_3':
	        this.loadPreset(3);
	        break;
	      case 'recall_preset_4':
	        this.loadPreset(4);
	        break;
	      case 'recall_preset_5':
	        this.loadPreset(5);
	        break;
	      case 'recall_preset_6':
	        this.loadPreset(6);
	        break;
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = event.target.value;
	
	    let items = this.state.items;
	    for (let i = 0; i < items.length; i++) {
	      if (items[i].i == event.target.id) {
	        items[i].sliderValue = slider_value;
	      }
	    }
	    this.setState({ items: items });
	
	    switch (event.target.id) {
	      case 'spot_pan':
	        this.setState({ spotPan: slider_value });
	        socket.emit('dmx-go', { 80: slider_value });
	        break;
	      case 'spot_tilt':
	        this.setState({ spotTilt: slider_value });
	        socket.emit('dmx-go', { 82: slider_value });
	        break;
	      case 'spot_fine_pan':
	        this.setState({ spotFinePan: slider_value });
	        socket.emit('dmx-go', { 81: slider_value });
	        break;
	      case 'spot_fine_tilt':
	        this.setState({ spotFineTilt: slider_value });
	        socket.emit('dmx-go', { 83: slider_value });
	        break;
	      case 'spot_speed':
	        this.setState({ spotSpeed: slider_value });
	        socket.emit('dmx-go', { 84: slider_value });
	        break;
	      case 'spot_intensity':
	        this.setState({ spotIntensity: slider_value });
	        socket.emit('dmx-go', { 89: slider_value });
	        break;
	
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	  }
	  savePreset(preset) {
	    let presets = this.state.presets;
	    console.log("save preset " + preset + ": " + presets[preset]);
	    presets[preset].spotIntensity = this.state.spotIntensity;
	    presets[preset].spotPan = this.state.spotPan;
	    presets[preset].spotTilt = this.state.spotTilt;
	    presets[preset].spotFinePan = this.state.spotFinePan;
	    presets[preset].spotFineTilt = this.state.spotFineTilt;
	    presets[preset].spotSpeed = this.state.spotSpeed;
	    this.setState({ presets: presets });
	  }
	  loadPreset(preset) {
	    let items = this.state.items;
	    let presets = this.state.presets;
	    for (let i = 0; i < items.length; i++) {
	      if (items[i].i == "spot_pan") {
	        items[i].sliderValue = presets[preset].spotPan;
	        socket.emit('dmx-go', { 80: presets[preset].spotPan });
	      }
	      if (items[i].i == "spot_tilt") {
	        items[i].sliderValue = presets[preset].spotTilt;
	        socket.emit('dmx-go', { 82: presets[preset].spotTilt });
	      }
	      if (items[i].i == "spot_fine_pan") {
	        items[i].sliderValue = presets[preset].spotFinePan;
	        socket.emit('dmx-go', { 81: presets[preset].spotFinePan });
	      }
	      if (items[i].i == "spot_fine_tilt") {
	        items[i].sliderValue = presets[preset].spotFineTilt;
	        socket.emit('dmx-go', { 83: presets[preset].spotFineTilt });
	      }
	      if (items[i].i == "spot_speed") {
	        items[i].sliderValue = presets[preset].spotSpeed;
	        socket.emit('dmx-go', { 84: presets[preset].spotSpeed });
	      }
	      if (items[i].i == "spot_intensity") {
	        items[i].sliderValue = presets[preset].spotIntensity;
	        socket.emit('dmx-go', { 89: presets[preset].spotIntensity });
	      }
	    }
	    this.setState({ items: items });
	  }
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'Group 2: SPOT LIGHT 255'
	            ),
	            ' DMX: 81'
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock,
	            compactType: this.state.compactType
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    this.setState({
	      items: [{
	        type: 0,
	        i: "spot_on",
	        x: 0,
	        y: 0,
	        w: 2,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Spot On'
	      }, {
	        type: 0,
	        i: "spot_off",
	        x: 2,
	        y: 0,
	        w: 2,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Spot Off'
	      }, {
	        type: 1,
	        i: "spot_intensity",
	        x: 0,
	        y: 2,
	        w: 12,
	        h: 2,
	        text: 'Spot Intensity'
	
	      }, {
	        type: 1,
	        i: "spot_tilt",
	        x: 0,
	        y: 8,
	        w: 12,
	        h: 2,
	        text: 'Spot Tilt'
	      }, {
	        type: 1,
	        i: "spot_pan",
	        x: 0,
	        y: 4,
	        w: 12,
	        h: 2,
	        text: 'Spot Pan'
	      }, {
	        type: 1,
	        i: "spot_speed",
	        x: 0,
	        y: 12,
	        w: 12,
	        h: 2,
	        text: 'Spot Speed'
	      }, {
	        type: 1,
	        i: "spot_fine_tilt",
	        x: 0,
	        y: 10,
	        w: 12,
	        h: 2,
	        text: 'Spot Fine Tilt'
	      }, {
	        type: 1,
	        i: "spot_fine_pan",
	        x: 0,
	        y: 6,
	        w: 12,
	        h: 2,
	        text: 'Spot Fine Pan'
	      }, {
	        type: 0,
	        i: "recall_preset_1",
	        x: 0,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 1'
	      }, {
	        type: 0,
	        i: "recall_preset_2",
	        x: 1,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 2'
	      }, {
	        type: 0,
	        i: "recall_preset_3",
	        x: 2,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 3'
	      }, {
	        type: 0,
	        i: "recall_preset_4",
	        x: 3,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 4'
	      }, {
	        type: 0,
	        i: "recall_preset_5",
	        x: 4,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 5'
	      }, {
	        type: 0,
	        i: "recall_preset_6",
	        x: 5,
	        y: 14,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 6'
	      }, {
	        type: 0,
	        i: "save_preset_1",
	        x: 0,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 1'
	      }, {
	        type: 0,
	        i: "save_preset_2",
	        x: 1,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 2'
	      }, {
	        type: 0,
	        i: "save_preset_3",
	        x: 2,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 3'
	      }, {
	        type: 0,
	        i: "save_preset_4",
	        x: 3,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 4'
	      }, {
	        type: 0,
	        i: "save_preset_5",
	        x: 4,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 5'
	      }, {
	        type: 0,
	        i: "save_preset_6",
	        x: 5,
	        y: 15,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Preset 6'
	      }],
	      presets: [{
	        spotIntensity: '127',
	        spotPan: '0',
	        spotFinePan: '127',
	        spotTilt: '0',
	        spotFineTilt: '127',
	        spotSpeed: '215'
	      }, {}, {}, {}, {}, {}, {}]
	    });
	  }
	}
	exports.default = DMX255Group2;
	DMX255Group2.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	var _reactDeviceDetect = __webpack_require__(67);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class PTZGroup1 extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      lock: true,
	      host: '127.0.0.1',
	      port: 5250,
	      PTZhost: '192.168.0.100',
	      PTZport: 52381,
	      command: "",
	      response: '',
	      compactType: null
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleButtonRelease = this.handleButtonRelease.bind(this);
	    this.handleUpEvent = this.handleUpEvent.bind(this);
	    this.handleDownEvent = this.handleDownEvent.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onMouseDown: this.handleDownEvent, onMouseUp: this.handleUpEvent, onTouchStart: this.handleDownEvent, onTouchEnd: this.handleUpEvent },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '1', max: '100', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	  handleDownEvent(event) {
	    if (_reactDeviceDetect.isIos) {
	      if (event.type == "touchstart") {
	        this.handleButtons(event);
	      }
	    } else {
	      this.handleButtons(event);
	    }
	  }
	  handleUpEvent(event) {
	    if (_reactDeviceDetect.isIos) {
	      if (event.type != "touchend") {
	        this.handleButtonRelease(event);
	      }
	    } else {
	      this.handleButtonRelease(event);
	    }
	  }
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    event.preventDefault();
	    switch (event.target.value) {
	
	      case 'ptz_on':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000060000000c8101040002ff' });
	        break;
	      case 'ptz_off':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000060000000c8101040003ff' });
	        break;
	      case 'ptz_preset_1':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0200ff' });
	        break;
	      case 'ptz_preset_2':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0201ff' });
	        break;
	      case 'ptz_preset_3':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0202ff' });
	        break;
	      case 'ptz_preset_4':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0203ff' });
	        break;
	      case 'ptz_preset_5':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0204ff' });
	        break;
	      case 'ptz_preset_6':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0205ff' });
	        break;
	      case 'ptz_save_preset_1':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000108101043f0100ff' });
	        break;
	      case 'ptz_save_preset_2':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0101ff' });
	        break;
	      case 'ptz_save_preset_3':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0102ff' });
	        break;
	      case 'ptz_save_preset_4':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0103ff' });
	        break;
	      case 'ptz_save_preset_5':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0104ff' });
	        break;
	      case 'ptz_save_preset_6':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0105ff' });
	        break;
	      case 'ptz_up_left':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '0100000900000099810106010c080101ff' });
	        break;
	      case 'ptz_up':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000090000009b810106010c080301ff' });
	        break;
	      case 'ptz_up_right':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000090000009d810106010c080201ff' });
	        break;
	      case 'ptz_left':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000a3810106010c080103ff' });
	        break;
	      case 'ptz_right':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000a5810106010c080203ff' });
	        break;
	      case 'ptz_down_left':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000a7810106010c080102ff' });
	        break;
	      case 'ptz_down':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000a9810106010c080302ff' });
	        break;
	      case 'ptz_down_right':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000ab810106010c080202ff' });
	        break;
	      case 'ptz_zoom_in':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000b78101040723ff' });
	        break;
	      case 'ptz_zoom_out':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000b98101040733ff' });
	        break;
	      case 'ptz_iris_up':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101040b02ff' });
	        break;
	      case 'ptz_iris_down':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101040b03ff' });
	        break;
	      case 'ptz_shutter_up':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101040a02ff' });
	        break;
	      case 'ptz_shutter_down':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101040a03ff' });
	        break;
	      case 'ptz_gain_up':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101040c02ff' });
	        break;
	      case 'ptz_gain_down':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101040c03ff' });
	        break;
	      case 'ptz_iris_priority':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '0100000600000009810104390Bff' });
	        break;
	      case 'ptz_shutter_priority':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '0100000600000009810104390Aff' });
	        break;
	      case 'ptz_bright_mode':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '0100000600000009810104390Dff' });
	        break;
	      case 'ptz_bright_up':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000098101040D02ff' });
	        break;
	      case 'ptz_bright_down':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000098101040D03ff' });
	        break;
	      case 'ptz_awb':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101043500ff' });
	        break;
	      case 'ptz_onetouch_wb':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101043503ff' });
	        break;
	      case 'ptz_onetouch_wb_trigger':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101041005ff' });
	        break;
	      case 'ptz_manual_wb':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101043505ff' });
	        break;
	      case 'ptz_full_auto':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000098101043900ff' });
	        break;
	      case 'ptz_manual_exposure':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101043903ff' });
	        break;
	      case 'ptz_fx_off':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101046300ff' });
	        break;
	      case 'ptz_fx_neg':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000098101046302ff' });
	        break;
	      case 'ptz_fx_bw':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101046304ff' });
	        break;
	      case 'ptz_onscreen_on':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000060000000c81017e011802ff' });
	        break;
	      case 'ptz_onscreen_off':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000060000000c81017e011803ff' });
	        break;
	      //81017e011802ff Information display On    
	      //81017e011803ff Information display Off
	
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleButtonRelease(event) {
	    console.log(event.target.id + " :mouse upped");
	
	    switch (event.target.value) {
	
	      case 'ptz_zoom_in':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000ba8101040700ff' });
	        break;
	      case 'ptz_zoom_out':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000ba8101040700ff' });
	        break;
	      default:
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000ac810106010c080303ff' });
	
	    }
	  }
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'Group 1: CAMERA'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock,
	            compactType: this.state.compactType
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	    this.setState({
	      items: [{
	        type: 0,
	        i: "ptz_on",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'PTZ On'
	      }, {
	        type: 0,
	        i: "ptz_off",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'PTZ Off'
	      }, {
	        type: 0,
	        i: "ptz_preset_1",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 1'
	      }, {
	        type: 0,
	        i: "ptz_preset_2",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 2'
	      }, {
	        type: 0,
	        i: "ptz_preset_3",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 3'
	      }, {
	        type: 0,
	        i: "ptz_preset_4",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 4'
	      }, {
	        type: 0,
	        i: "ptz_preset_5",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 5'
	      }, {
	        type: 0,
	        i: "ptz_preset_6",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 6'
	      }, {
	        type: 0,
	        i: "ptz_zoom_in",
	        x: 0, // (this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, // Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Zoom In'
	      }, {
	        type: 0,
	        i: "ptz_zoom_out",
	        x: 0, // (this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, // Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Zoom Out'
	      }, {
	        type: 0,
	        i: "ptz_save_preset_1",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Pset 1'
	      }, {
	        type: 0,
	        i: "ptz_save_preset_2",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Pset 2'
	      }, {
	        type: 0,
	        i: "ptz_save_preset_3",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Pset 3'
	      }, {
	        type: 0,
	        i: "ptz_save_preset_4",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Pset 4'
	      }, {
	        type: 0,
	        i: "ptz_save_preset_5",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Pset 5'
	      }, {
	        type: 0,
	        i: "ptz_save_preset_6",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Pset 6'
	      }, {
	        type: 0,
	        i: "ptz_up_left",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Up Left'
	      }, {
	        type: 0,
	        i: "ptz_up",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Up'
	      }, {
	        type: 0,
	        i: "ptz_up_right",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Up Right'
	      }, {
	        type: 0,
	        i: "ptz_left",
	        x: 0, // (this.state.items.length * 2) % (this.state.cols || 12),
	        y: 5, // Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Left'
	      }, {
	        type: 0,
	        i: "ptz_right",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 5, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Right'
	      }, {
	        type: 0,
	        i: "ptz_down_left",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Down Left'
	      }, {
	        type: 0,
	        i: "ptz_down",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Down'
	      }, {
	        type: 0,
	        i: "ptz_down_right",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Down Right'
	      }, {
	        type: 0,
	        i: "ptz_onetouch_wb",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 13, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'WB Set Standby'
	      }, {
	        type: 0,
	        i: "ptz_onetouch_wb_trigger",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 13, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Press to Set WB'
	      }, {
	        type: 0,
	        i: "ptz_awb",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 13, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Auto White Balance'
	      }, {
	        type: 0,
	        i: "ptz_full_auto",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 7, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Full Auto'
	      }, {
	        type: 0,
	        i: "ptz_manual_exposure",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 7, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Manual Exposure'
	      }, {
	        type: 0,
	        i: "ptz_iris_priority",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Iris Priority'
	      }, {
	        type: 0,
	        i: "ptz_iris_up",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Iris Up'
	      }, {
	        type: 0,
	        i: "ptz_iris_down",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Iris Down'
	      }, {
	        type: 0,
	        i: "ptz_shutter_priority",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Shutter Priority'
	      }, {
	        type: 0,
	        i: "ptz_shutter_up",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Shutter Up'
	      }, {
	        type: 0,
	        i: "ptz_shutter_down",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Shutter Down'
	      }, {
	        type: 0,
	        i: "ptz_gain_up",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Gain Up'
	      }, {
	        type: 0,
	        i: "ptz_gain_down",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Gain Down'
	      }, {
	        type: 0,
	        i: "ptz_bright_up",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Bright Up'
	      }, {
	        type: 0,
	        i: "ptz_bright_down",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Bright Down'
	      }, {
	        type: 0,
	        i: "ptz_bright_mode",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Bright Mode'
	      }, {
	        type: 0,
	        i: "ptz_fx_off",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Effect Off'
	      }, {
	        type: 0,
	        i: "ptz_fx_neg",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Effect Negative'
	      }, {
	        type: 0,
	        i: "ptz_fx_bw",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Black+White'
	      }]
	    });
	  }
	}
	exports.default = PTZGroup1;
	PTZGroup1.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 67 */
/***/ (function(module, exports) {

	module.exports = require("react-device-detect");

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	var _reactDeviceDetect = __webpack_require__(67);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class PTZGroup2 extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      lock: true,
	      host: '127.0.0.1',
	      port: 5250,
	      PTZhost: '192.168.0.200',
	      PTZport: 52381,
	      command: "",
	      response: '',
	      compactType: null
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleButtonRelease = this.handleButtonRelease.bind(this);
	    this.handleUpEvent = this.handleUpEvent.bind(this);
	    this.handleDownEvent = this.handleDownEvent.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onMouseDown: this.handleDownEvent, onTouchStart: this.handleDownEvent, onTouchEnd: this.handleUpEvent, onMouseUp: this.handleUpEvent },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '1', max: '100', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	  handleDownEvent(event) {
	    if (_reactDeviceDetect.isIos) {
	      if (event.type == "touchstart") {
	        this.handleButtons(event);
	      }
	    } else {
	      this.handleButtons(event);
	    }
	  }
	  handleUpEvent(event) {
	    if (_reactDeviceDetect.isIos) {
	      if (event.type != "touchend") {
	        this.handleButtonRelease(event);
	      }
	    } else {
	      this.handleButtonRelease(event);
	    }
	  }
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    event.preventDefault();
	    switch (event.target.value) {
	
	      case 'ptz_on':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000060000000c8101040002ff' });
	        break;
	      case 'ptz_off':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000060000000c8101040003ff' });
	        break;
	      case 'ptz_preset_1':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0200ff' });
	        break;
	      case 'ptz_preset_2':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0201ff' });
	        break;
	      case 'ptz_preset_3':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0202ff' });
	        break;
	      case 'ptz_preset_4':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0203ff' });
	        break;
	      case 'ptz_preset_5':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0204ff' });
	        break;
	      case 'ptz_preset_6':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0205ff' });
	        break;
	      case 'ptz_save_preset_1':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000108101043f0100ff' });
	        break;
	      case 'ptz_save_preset_2':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0101ff' });
	        break;
	      case 'ptz_save_preset_3':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0102ff' });
	        break;
	      case 'ptz_save_preset_4':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0103ff' });
	        break;
	      case 'ptz_save_preset_5':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0104ff' });
	        break;
	      case 'ptz_save_preset_6':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0105ff' });
	        break;
	      case 'ptz_up_left':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '0100000900000099810106010c080101ff' });
	        break;
	      case 'ptz_up':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000090000009b810106010c080301ff' });
	        break;
	      case 'ptz_up_right':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000090000009d810106010c080201ff' });
	        break;
	      case 'ptz_left':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000a3810106010c080103ff' });
	        break;
	      case 'ptz_right':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000a5810106010c080203ff' });
	        break;
	      case 'ptz_down_left':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000a7810106010c080102ff' });
	        break;
	      case 'ptz_down':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000a9810106010c080302ff' });
	        break;
	      case 'ptz_down_right':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000ab810106010c080202ff' });
	        break;
	      case 'ptz_zoom_in':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000b78101040723ff' });
	        break;
	      case 'ptz_zoom_out':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000b98101040733ff' });
	        break;
	      case 'ptz_iris_up':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101040b02ff' });
	        break;
	      case 'ptz_iris_down':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101040b03ff' });
	        break;
	      case 'ptz_shutter_up':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101040a02ff' });
	        break;
	      case 'ptz_shutter_down':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101040a03ff' });
	        break;
	      case 'ptz_gain_up':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101040c02ff' });
	        break;
	      case 'ptz_gain_down':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101040c03ff' });
	        break;
	      case 'ptz_iris_priority':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '0100000600000009810104390Bff' });
	        break;
	      case 'ptz_shutter_priority':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '0100000600000009810104390Aff' });
	        break;
	      case 'ptz_bright_mode':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '0100000600000009810104390Dff' });
	        break;
	      case 'ptz_bright_up':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000098101040D02ff' });
	        break;
	      case 'ptz_bright_down':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000098101040D03ff' });
	        break;
	      case 'ptz_awb':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101043500ff' });
	        break;
	      case 'ptz_onetouch_wb':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101043503ff' });
	        break;
	      case 'ptz_onetouch_wb_trigger':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101041005ff' });
	        break;
	      case 'ptz_manual_wb':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101043505ff' });
	        break;
	      case 'ptz_full_auto':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000098101043900ff' });
	        break;
	      case 'ptz_manual_exposure':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101043903ff' });
	        break;
	      case 'ptz_fx_off':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101046300ff' });
	        break;
	      case 'ptz_fx_neg':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000098101046302ff' });
	        break;
	      case 'ptz_fx_bw':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101046304ff' });
	        break;
	      case 'ptz_onscreen_on':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000060000000c81017e011802ff' });
	        break;
	      case 'ptz_onscreen_off':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000060000000c81017e011803ff' });
	        break;
	      //81017e011802ff Information display On    
	      //81017e011803ff Information display Off
	
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleButtonRelease(event) {
	    console.log(event.target.id + " :mouse upped");
	
	    switch (event.target.value) {
	
	      case 'ptz_zoom_in':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000ba8101040700ff' });
	        break;
	      case 'ptz_zoom_out':
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000ba8101040700ff' });
	        break;
	      default:
	        socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000ac810106010c080303ff' });
	
	    }
	  }
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'Group 2: CAMERA'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock,
	            compactType: this.state.compactType
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	    this.setState({
	      items: [{
	        type: 0,
	        i: "ptz_on",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'PTZ On'
	      }, {
	        type: 0,
	        i: "ptz_off",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'PTZ Off'
	      }, {
	        type: 0,
	        i: "ptz_preset_1",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 1'
	      }, {
	        type: 0,
	        i: "ptz_preset_2",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 2'
	      }, {
	        type: 0,
	        i: "ptz_preset_3",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 3'
	      }, {
	        type: 0,
	        i: "ptz_preset_4",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 4'
	      }, {
	        type: 0,
	        i: "ptz_preset_5",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 5'
	      }, {
	        type: 0,
	        i: "ptz_preset_6",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'Preset 6'
	      }, {
	        type: 0,
	        i: "ptz_zoom_in",
	        x: 0, // (this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, // Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Zoom In'
	      }, {
	        type: 0,
	        i: "ptz_zoom_out",
	        x: 0, // (this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, // Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Zoom Out'
	      }, {
	        type: 0,
	        i: "ptz_save_preset_1",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Pset 1'
	      }, {
	        type: 0,
	        i: "ptz_save_preset_2",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Pset 2'
	      }, {
	        type: 0,
	        i: "ptz_save_preset_3",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Pset 3'
	      }, {
	        type: 0,
	        i: "ptz_save_preset_4",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Pset 4'
	      }, {
	        type: 0,
	        i: "ptz_save_preset_5",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Pset 5'
	      }, {
	        type: 0,
	        i: "ptz_save_preset_6",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Save Pset 6'
	      }, {
	        type: 0,
	        i: "ptz_up_left",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Up Left'
	      }, {
	        type: 0,
	        i: "ptz_up",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Up'
	      }, {
	        type: 0,
	        i: "ptz_up_right",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Up Right'
	      }, {
	        type: 0,
	        i: "ptz_left",
	        x: 0, // (this.state.items.length * 2) % (this.state.cols || 12),
	        y: 5, // Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Left'
	      }, {
	        type: 0,
	        i: "ptz_right",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 5, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Right'
	      }, {
	        type: 0,
	        i: "ptz_down_left",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Down Left'
	      }, {
	        type: 0,
	        i: "ptz_down",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Down'
	      }, {
	        type: 0,
	        i: "ptz_down_right",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Down Right'
	      }, {
	        type: 0,
	        i: "ptz_onetouch_wb",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 13, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'WB Set Standby'
	      }, {
	        type: 0,
	        i: "ptz_onetouch_wb_trigger",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 13, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Press to Set WB'
	      }, {
	        type: 0,
	        i: "ptz_awb",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 13, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Auto White Balance'
	      }, {
	        type: 0,
	        i: "ptz_full_auto",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 7, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Full Auto'
	      }, {
	        type: 0,
	        i: "ptz_manual_exposure",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 7, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Manual Exposure'
	      }, {
	        type: 0,
	        i: "ptz_iris_priority",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Iris Priority'
	      }, {
	        type: 0,
	        i: "ptz_iris_up",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Iris Up'
	      }, {
	        type: 0,
	        i: "ptz_iris_down",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Iris Down'
	      }, {
	        type: 0,
	        i: "ptz_shutter_priority",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Shutter Priority'
	      }, {
	        type: 0,
	        i: "ptz_shutter_up",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Shutter Up'
	      }, {
	        type: 0,
	        i: "ptz_shutter_down",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Shutter Down'
	      }, {
	        type: 0,
	        i: "ptz_gain_up",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Gain Up'
	      }, {
	        type: 0,
	        i: "ptz_gain_down",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Gain Down'
	      }, {
	        type: 0,
	        i: "ptz_bright_up",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Bright Up'
	      }, {
	        type: 0,
	        i: "ptz_bright_down",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Bright Down'
	      }, {
	        type: 0,
	        i: "ptz_bright_mode",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Bright Mode'
	      }, {
	        type: 0,
	        i: "ptz_fx_off",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Effect Off'
	      }, {
	        type: 0,
	        i: "ptz_fx_neg",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Effect Negative'
	      }, {
	        type: 0,
	        i: "ptz_fx_bw",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-default',
	        text: 'Black+White'
	      }]
	    });
	  }
	}
	exports.default = PTZGroup2;
	PTZGroup2.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class ATEMGroup1 extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      lock: true,
	      host: '127.0.0.1',
	      port: 5250,
	      command: "",
	      response: ''
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleSliders = this.handleSliders.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onClick: this.handleButtons },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '0', max: '100', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	
	    switch (event.target.value) {
	      case 'atem_caspar':
	        socket.emit('atemTV1_changeProgramInput', '1');
	        break;
	      case 'atem_camera':
	        socket.emit('atemTV1_changeProgramInput', '2');
	        break;
	      case 'atem_preview_caspar':
	        socket.emit('atemTV1_changePreviewInput', '1');
	        break;
	      case 'atem_preview_camera':
	        socket.emit('atemTV1_changePreviewInput', '2');
	        break;
	      case 'atem_auto_transition':
	        socket.emit('atemTV1_autoTransition', '');
	        break;
	      case 'atem_transition_mix':
	        socket.emit('atemTV1_transitionType', '0');
	        break;
	      case 'atem_transition_wipe':
	        socket.emit('atemTV1_transitionType', '2');
	        break;
	      case 'atem_50_50':
	        socket.emit('atem1me_runMacro', '0');
	        break;
	
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = event.target.value;
	    switch (event.target.id) {
	      case 'atem_transition_position':
	        socket.emit('atemTV1_transition_position', slider_value * 100);
	        break;
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	  }
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'Group 1: VIDEO Switcher'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	    this.setState({
	      items: [{
	        type: 0,
	        i: "atem_caspar",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Program Media'
	      }, {
	        type: 0,
	        i: "atem_camera",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Program Camera'
	      }, {
	        type: 0,
	        i: "atem_preview_caspar",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Preview Media'
	      }, {
	        type: 0,
	        i: "atem_preview_camera",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Preview Camera'
	      }, {
	        type: 1,
	        i: "atem_transition_position",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 2,
	        h: 2,
	        className: 'btn-block btn',
	        text: 'ATEM Transition'
	      }, {
	        type: 0,
	        i: "atem_auto_transition",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Auto Transition'
	      }, {
	        type: 0,
	        i: "atem_transition_mix",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Mix'
	      }, {
	        type: 0,
	        i: "atem_transition_wipe",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Wipe'
	      }]
	    });
	  }
	}
	exports.default = ATEMGroup1;
	ATEMGroup1.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class ATEMGroup2 extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      lock: true,
	      host: '127.0.0.1',
	      port: 5250,
	      command: "",
	      response: ''
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleSliders = this.handleSliders.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onClick: this.handleButtons },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '0', max: '100', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	
	    switch (event.target.value) {
	      case 'atem_caspar':
	        socket.emit('atemTV1_changeProgramInput', '3');
	        break;
	      case 'atem_camera':
	        socket.emit('atemTV1_changeProgramInput', '4');
	        break;
	      case 'atem_preview_caspar':
	        socket.emit('atemTV1_changePreviewInput', '3');
	        break;
	      case 'atem_preview_camera':
	        socket.emit('atemTV1_changePreviewInput', '4');
	        break;
	      case 'atem_auto_transition':
	        socket.emit('atemTV1_autoTransition', '');
	        break;
	      case 'atem_transition_mix':
	        socket.emit('atemTV1_transitionType', '0');
	        break;
	      case 'atem_transition_wipe':
	        socket.emit('atemTV1_transitionType', '2');
	        break;
	      case 'atem_50_50':
	        socket.emit('atem1me_runMacro', '0');
	        break;
	
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = event.target.value;
	    switch (event.target.id) {
	      case 'atem_transition_position':
	        socket.emit('atemTV1_transition_position', slider_value * 100);
	        break;
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	  }
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'Group 2: VIDEO Switcher'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	    this.setState({
	      items: [{
	        type: 0,
	        i: "atem_caspar",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Program Media'
	      }, {
	        type: 0,
	        i: "atem_camera",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Program Camera'
	      }, {
	        type: 0,
	        i: "atem_preview_caspar",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Preview Media'
	      }, {
	        type: 0,
	        i: "atem_preview_camera",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Preview Camera'
	      }, {
	        type: 1,
	        i: "atem_transition_position",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 2,
	        h: 2,
	        className: 'btn-block btn',
	        text: 'ATEM Transition'
	      }, {
	        type: 0,
	        i: "atem_auto_transition",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Auto Transition'
	      }, {
	        type: 0,
	        i: "atem_transition_mix",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Mix'
	      }, {
	        type: 0,
	        i: "atem_transition_wipe",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'Wipe'
	      }]
	    });
	  }
	}
	exports.default = ATEMGroup2;
	ATEMGroup2.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class ATEM extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0
	        };
	      }),
	      lock: true,
	      host: '127.0.0.1',
	      port: 5250,
	      command: "",
	      response: ''
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onClick: this.handleButtons },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '1', max: '100', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	
	    switch (event.target.value) {
	      case 'atem_caspar':
	        socket.emit('atem_changePreviewInput', '3');
	        break;
	      case 'atem_camera':
	        socket.emit('atem_changePreviewInput', '4');
	        break;
	
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'Group 2: VIDEO Switcher'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	    this.setState({
	      items: [{
	        type: 0,
	        i: "atem_caspar",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'ATEM Media'
	      }, {
	        type: 0,
	        i: "atem_camera",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn',
	        text: 'ATEM Camera'
	      }]
	    });
	  }
	}
	exports.default = ATEM;
	ATEM.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	let socket;
	
	class Diagnostics extends _react2.default.Component {
	
		constructor(props) {
			super(props);
			this.state = {
				text: '',
				host: '127.0.0.1',
				port: 5250,
				command: "cls",
				response: ''
			};
			this.onHostChange = this.onHostChange.bind(this);
			this.onPortChange = this.onPortChange.bind(this);
			this.onCommandChange = this.onCommandChange.bind(this);
			this.sendTelnetTest = this.sendTelnetTest.bind(this);
		}
		componentDidMount() {
			socket = (0, _socket3.default)();
			socket.on(this.props.location.pathname, mesg => {
				this.setState({ text: mesg });
			});
			socket.on('telnet-response', mesg => {
				this.setState({ response: mesg });
			});
		}
		componentWillUnmount() {
			socket.off(this.props.page);
		}
		onPortChange(event) {
			this.setState({ port: event.target.value });
		}
		onHostChange(event) {
			this.setState({ host: event.target.value });
		}
		onCommandChange(event) {
			this.setState({ command: event.target.value });
		}
		sendTelnetTest() {
			console.log("sending Telnet Test");
			socket.emit('diagnostics-send-telnet', { host: this.state.host, port: this.state.port, command: this.state.command });
		}
		render() {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement(
						_reactBootstrap.Form,
						{ horizontal: true, onSubmit: this.sendTelnetTest },
						_react2.default.createElement(
							_reactBootstrap.FormGroup,
							null,
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ componentClass: _reactBootstrap.ControlLabel, sm: 3 },
								'Host'
							),
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ sm: 9 },
								_react2.default.createElement(_reactBootstrap.FormControl, { name: 'host', value: this.state.host, onChange: this.onHostChange })
							)
						),
						_react2.default.createElement(
							_reactBootstrap.FormGroup,
							null,
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ componentClass: _reactBootstrap.ControlLabel, sm: 3 },
								'Port'
							),
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ sm: 9 },
								_react2.default.createElement(_reactBootstrap.FormControl, { name: 'port', value: this.state.port, onChange: this.onPortChange })
							)
						),
						_react2.default.createElement(
							_reactBootstrap.FormGroup,
							null,
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ componentClass: _reactBootstrap.ControlLabel, sm: 3 },
								'Telnet Command'
							),
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ sm: 9 },
								_react2.default.createElement(_reactBootstrap.FormControl, { name: 'command', value: this.state.command, onChange: this.onCommandChange })
							)
						),
						_react2.default.createElement(
							_reactBootstrap.FormGroup,
							null,
							_react2.default.createElement(
								_reactBootstrap.Col,
								{ smOffset: 3, sm: 6 },
								_react2.default.createElement(
									_reactBootstrap.ButtonToolbar,
									null,
									_react2.default.createElement(
										_reactBootstrap.Button,
										{ bsStyle: 'primary', type: 'submit' },
										'Send Telnet Command'
									)
								)
							)
						)
					)
				),
				_react2.default.createElement(
					'div',
					null,
					this.state.response
				)
			);
		}
	}
	exports.default = Diagnostics;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactGridLayout = __webpack_require__(42);
	
	var _reactDom = __webpack_require__(43);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _lodash = __webpack_require__(44);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	__webpack_require__(30);
	
	var _reactBootstrap = __webpack_require__(26);
	
	var _lock = __webpack_require__(45);
	
	var _lock2 = _interopRequireDefault(_lock);
	
	var _unlock = __webpack_require__(46);
	
	var _unlock2 = _interopRequireDefault(_unlock);
	
	var _socket = __webpack_require__(57);
	
	var _socket2 = __webpack_require__(54);
	
	var _socket3 = _interopRequireDefault(_socket2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	const ResponsiveReactGridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);
	let lockIcon = _react2.default.createElement(_lock2.default, null);
	let socket;
	
	class MIDILooper extends _react2.default.Component {
	
	  constructor(props, context) {
	    super(props, context);
	    this.state = {
	      items: [].map(function (i, key, list) {
	        return {
	          type: 0,
	          i: i.toString(),
	          x: i * 2,
	          y: 0,
	          w: 2,
	          h: 2,
	          add: i === (list.length - 1).toString(),
	          sliderValue: 0,
	          inputValue: 0
	        };
	      }),
	      lock: true,
	      host: '127.0.0.1',
	      port: 5250,
	      command: "",
	      response: '',
	      compactType: null,
	      spot_speed: 215
	    };
	    this.onBreakpointChange = this.onBreakpointChange.bind(this);
	    this.handleOnLock = this.handleOnLock.bind(this);
	    this.handleButtons = this.handleButtons.bind(this);
	    this.handleSliders = this.handleSliders.bind(this);
	    this.handleNumberInput = this.handleNumberInput.bind(this);
	  }
	  handleOnLock() {
	    if (this.state.lock == true) {
	      lockIcon = _react2.default.createElement(_unlock2.default, null);
	      this.setState({ lock: false });
	    } else {
	      lockIcon = _react2.default.createElement(_lock2.default, null);
	      this.setState({ lock: true });
	    }
	  }
	  createElement(el) {
	    let lockStyle = {
	      display: "none"
	    };
	    if (this.state.lock == false) {
	      lockStyle = {
	        position: "absolute",
	        right: "2px",
	        top: 0,
	        cursor: "pointer",
	        display: "inline"
	      };
	    }
	    const gridStyle = {
	      background: "#FFF"
	    };
	    const i = el.add ? "+" : el.i;
	    let controllerCode = _react2.default.createElement(
	      'button',
	      { className: el.className, value: el.i, onClick: this.handleButtons },
	      el.text
	    );
	    if (el.type == 1) {
	      //type is slider
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          { id: 'slidecontainer' },
	          _react2.default.createElement('input', { type: 'range', min: '0', max: '127', value: el.sliderValue, id: i, className: 'slider', onChange: this.handleSliders })
	        )
	      );
	    }
	    if (el.type == 2) {
	      //type is text input
	      controllerCode = _react2.default.createElement(
	        'div',
	        null,
	        ' ',
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          el.text
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement('input', { type: 'number', min: '0', max: '99', value: el.inputValue, id: i, onChange: this.handleNumberInput })
	        )
	      );
	    }
	    return _react2.default.createElement(
	      'div',
	      { key: i, 'data-grid': el, style: gridStyle },
	      controllerCode,
	      _react2.default.createElement('span', { style: lockStyle })
	    );
	  }
	
	  handleButtons(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	
	    switch (event.target.value) {
	
	      case 'push-record':
	        socket.emit('midi-cc', { controller: 102, value: 127, channel: 0 });
	        break;
	      case 'push-play':
	        socket.emit('midi-cc', { controller: 104, value: 127, channel: 0 });
	        break;
	      case 'mute-all':
	        socket.emit('midi-program', { number: 126, channel: 0 });
	        break;
	      case 'push-new':
	        socket.emit('midi-program', { number: 110, channel: 0 });
	        break;
	      case 'loop-up':
	        socket.emit('midi-program', { number: 122, channel: 0 });
	        break;
	      case 'loop-down':
	        socket.emit('midi-program', { number: 121, channel: 0 });
	        break;
	      case 'push-reverse':
	        socket.emit('midi-program', { number: 114, channel: 0 });
	        break;
	      case 'push-octave':
	        socket.emit('midi-program', { number: 119, channel: 0 });
	        break;
	      case 'push-mixdown':
	        socket.emit('midi-program', { number: 120, channel: 0 });
	        break;
	      case 'push-punchin':
	        socket.emit('midi-program', { number: 117, channel: 0 });
	        break;
	      case 'select-track-1':
	        socket.emit('midi-program', { number: 106, channel: 0 });
	        break;
	      case 'select-track-2':
	        socket.emit('midi-program', { number: 107, channel: 0 });
	        break;
	      case 'select-track-3':
	        socket.emit('midi-program', { number: 108, channel: 0 });
	        break;
	      case 'select-track-4':
	        socket.emit('midi-program', { number: 109, channel: 0 });
	        break;
	      case 'mute-track-1':
	        socket.emit('midi-program', { number: 101, channel: 0 });
	        break;
	      case 'mute-track-2':
	        socket.emit('midi-program', { number: 102, channel: 0 });
	        break;
	      case 'mute-track-3':
	        socket.emit('midi-program', { number: 103, channel: 0 });
	        break;
	      case 'mute-track-4':
	        socket.emit('midi-program', { number: 104, channel: 0 });
	        break;
	      case 'mute-dry':
	        socket.emit('midi-program', { number: 124, channel: 0 });
	        break;
	      case 'mute-mixdown':
	        socket.emit('midi-program', { number: 123, channel: 0 });
	        break;
	      case 'push-quantize':
	        socket.emit('midi-program', { number: 111, channel: 0 });
	        break;
	      default:
	        console.log('ERROR: Button does not exist');
	    }
	  }
	  handleSliders(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let slider_value = event.target.value;
	    switch (event.target.id) {
	      case 'track-1-level':
	        socket.emit('midi-cc', { controller: 21, value: slider_value, channel: 0 });
	        break;
	      case 'track-2-level':
	        socket.emit('midi-cc', { controller: 22, value: slider_value, channel: 0 });
	        break;
	      case 'track-3-level':
	        socket.emit('midi-cc', { controller: 23, value: slider_value, channel: 0 });
	        break;
	      case 'track-4-level':
	        socket.emit('midi-cc', { controller: 24, value: slider_value, channel: 0 });
	        break;
	      case 'track-1-pan':
	        socket.emit('midi-cc', { controller: 28, value: slider_value, channel: 0 });
	        break;
	      case 'track-2-pan':
	        socket.emit('midi-cc', { controller: 29, value: slider_value, channel: 0 });
	        break;
	      case 'track-3-pan':
	        socket.emit('midi-cc', { controller: 30, value: slider_value, channel: 0 });
	        break;
	      case 'track-4-pan':
	        socket.emit('midi-cc', { controller: 31, value: slider_value, channel: 0 });
	        break;
	      case 'dry-out-level':
	        socket.emit('midi-cc', { controller: 20, value: slider_value, channel: 0 });
	        break;
	      case 'dry-out-pan':
	        socket.emit('midi-cc', { controller: 27, value: slider_value, channel: 0 });
	        break;
	      case 'mix-down-level':
	        socket.emit('midi-cc', { controller: 25, value: slider_value, channel: 0 });
	        break;
	      case 'tempo':
	        socket.emit('midi-cc', { controller: 26, value: slider_value, channel: 0 });
	        break;
	
	      default:
	        console.log('ERROR: Slider does not exist');
	    }
	  }
	  handleNumberInput(event) {
	    console.log(event.target.id + ': ' + event.target.value);
	    let input_value = event.target.value;
	    switch (event.target.id) {
	      case 'loop-input':
	        socket.emit('midi-program', { number: input_value, channel: 0 });
	        break;
	      default:
	        console.log('ERROR: Input does not exist');
	    }
	  }
	  onBreakpointChange(breakpoint, cols) {
	    this.setState({
	      breakpoint: breakpoint,
	      cols: cols
	    });
	  }
	  onLayoutChange(layout) {
	    console.log("layout:", layout);
	  }
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Row,
	          null,
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 2, sm: 2, md: 2, lg: 2 },
	            _react2.default.createElement(
	              'button',
	              { onClick: this.handleOnLock },
	              lockIcon
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Col,
	            { xs: 10, sm: 10, md: 10, lg: 10 },
	            _react2.default.createElement(
	              'strong',
	              null,
	              'MIDI Out for Looper: Electro-Harmonix 45000'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          ResponsiveReactGridLayout,
	          _extends({
	            onBreakpointChange: this.onBreakpointChange,
	            onLayoutChange: this.onLayoutChange,
	            isDraggable: !this.state.lock,
	            isResizable: !this.state.lock,
	            compactType: this.state.compactType
	          }, this.props),
	          _lodash2.default.map(this.state.items, el => this.createElement(el))
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        null,
	        this.state.response
	      )
	    );
	  }
	  componentWillUnmount() {
	    socket.off(this.props.page);
	  }
	  componentDidMount() {
	    socket = (0, _socket3.default)();
	    socket.on('telnet-response', mesg => {
	      this.setState({ response: mesg });
	    });
	    this.setState({
	      items: [{
	        type: 0,
	        i: "push-record",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'RECORD'
	      }, {
	        type: 0,
	        i: "push-play",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-success',
	        text: 'PLAY/STOP'
	      }, {
	        type: 0,
	        i: "push-new",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'NEW LOOP'
	      }, {
	        type: 0,
	        i: "loop-up",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'LOOP UP'
	      }, {
	        type: 0,
	        i: "loop-down",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-primary',
	        text: 'LOOP DOWN'
	      }, {
	        type: 2,
	        i: "loop-input",
	        x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 0, //Infinity, 
	        w: 1,
	        h: 1,
	        text: 'LOOP INPUT'
	      }, {
	        type: 0,
	        i: "push-reverse",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-info',
	        text: 'REVERSE'
	      }, {
	        type: 0,
	        i: "push-octave",
	        x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-info',
	        text: 'OCTAVE'
	      }, {
	        type: 0,
	        i: "push-mixdown",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'MIX DOWN'
	      }, {
	        type: 0,
	        i: "push-quantize",
	        x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-info',
	        text: 'QUANTIZE'
	      }, {
	        type: 0,
	        i: "push-punchin",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'PUNCH IN'
	      }, {
	        type: 0,
	        i: "mute-all",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 1, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'MUTE ALL'
	      }, {
	        type: 0,
	        i: "select-track-1",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Select 1'
	      }, {
	        type: 0,
	        i: "select-track-2",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Select 2'
	      }, {
	        type: 0,
	        i: "select-track-3",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Select 3'
	      }, {
	        type: 0,
	        i: "select-track-4",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-danger',
	        text: 'Select 4'
	      }, {
	        type: 0,
	        i: "mute-track-1",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 3, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Mute 1'
	      }, {
	        type: 0,
	        i: "mute-track-2",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 5, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Mute 2'
	      }, {
	        type: 0,
	        i: "mute-track-3",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 7, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Mute 3'
	      }, {
	        type: 0,
	        i: "mute-track-4",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 9, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Mute 4'
	      }, {
	        type: 0,
	        i: "mute-dry",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 11, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Mute Dry'
	      }, {
	        type: 0,
	        i: "mute-mixdown",
	        x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 13, //Infinity, 
	        w: 1,
	        h: 1,
	        className: 'btn-block btn btn-warning',
	        text: 'Mute Mix'
	      }, {
	        type: 1,
	        i: "track-1-level",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 1 Level'
	      }, {
	        type: 1,
	        i: "track-2-level",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 2 Level'
	      }, {
	        type: 1,
	        i: "track-3-level",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 3 Level'
	      }, {
	        type: 1,
	        i: "track-4-level",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 4 Level'
	      }, {
	        type: 1,
	        i: "track-1-pan",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 2, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 1 Pan'
	      }, {
	        type: 1,
	        i: "track-2-pan",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 4, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 2 Pan'
	      }, {
	        type: 1,
	        i: "track-3-pan",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 6, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 3 Pan'
	      }, {
	        type: 1,
	        i: "track-4-pan",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 8, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Track 4 Pan'
	      }, {
	        type: 1,
	        i: "dry-out-level",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Dry Level'
	      }, {
	        type: 1,
	        i: "dry-out-pan",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 10, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Dry Pan'
	      }, {
	        type: 1,
	        i: "mix-down-level",
	        x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Mixdown Level'
	      }, {
	        type: 1,
	        i: "tempo",
	        x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
	        y: 12, //Infinity,
	        w: 2,
	        h: 2,
	        text: 'Tempo'
	      }]
	    });
	  }
	}
	exports.default = MIDILooper;
	MIDILooper.defaultProps = {
	  className: "layout",
	  rowHeight: 30,
	  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(30);
	
	var _reactRouter = __webpack_require__(22);
	
	var _reactBootstrap = __webpack_require__(26);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class Help extends _react2.default.Component {
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'center',
	        null,
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'h1',
	            null,
	            _react2.default.createElement(
	              'a',
	              { href: 'dmx_group1' },
	              'GROUP 1'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'h1',
	            null,
	            _react2.default.createElement(
	              'a',
	              { href: 'dmx_group2' },
	              'GROUP 2'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'h1',
	            null,
	            _react2.default.createElement(
	              'a',
	              { href: 'dmx_group3' },
	              'Extras'
	            )
	          )
	        )
	      )
	    );
	  }
	}
	exports.default = Help;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(30);
	
	var _reactRouter = __webpack_require__(22);
	
	var _reactBootstrap = __webpack_require__(26);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class Help extends _react2.default.Component {
	  render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'center',
	        null,
	        _react2.default.createElement(
	          'div',
	          null,
	          'Help information coming soon.'
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          'in the meantime: ',
	          _react2.default.createElement(
	            'a',
	            { href: 'http://www.activematrix.tech/cinebrain/' },
	            'Cinebrain Blog'
	          )
	        )
	      )
	    );
	  }
	}
	exports.default = Help;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(20);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	class ContextWrapper extends _react2.default.Component {
	  getChildContext() {
	    return { initialState: this.props.initialState };
	  }
	
	  render() {
	    return this.props.children;
	  }
	}
	
	exports.default = ContextWrapper;
	ContextWrapper.childContextTypes = {
	  initialState: _react2.default.PropTypes.object
	};
	
	ContextWrapper.propTypes = {
	  children: _react2.default.PropTypes.object.isRequired,
	  initialState: _react2.default.PropTypes.object
	};

/***/ })
];
//# sourceMappingURL=0.280d0a770100c62012ac.hot-update.js.map