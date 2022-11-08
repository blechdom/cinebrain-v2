exports.id = 0;
exports.modules = {

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setDb = exports.app = undefined;
	
	var _express = __webpack_require__(23);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _bodyParser = __webpack_require__(24);
	
	var _bodyParser2 = _interopRequireDefault(_bodyParser);
	
	var _mongodb = __webpack_require__(5);
	
	var _issue = __webpack_require__(25);
	
	var _issue2 = _interopRequireDefault(_issue);
	
	var _device = __webpack_require__(26);
	
	var _device2 = _interopRequireDefault(_device);
	
	var _renderedPageRouter = __webpack_require__(27);
	
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
	  const filter = {};
	  if (req.query.status) filter.status = req.query.status;
	  if (req.query.effort_lte || req.query.effort_gte) filter.effort = {};
	  if (req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte, 10);
	  if (req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte, 10);
	
	  db.collection('dmx_presets').find(filter).toArray().then(dmx_presets => {
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
	  db.collection('dmx_presets').insertOne(newDMXPreset).then(result => db.collection('dmx_presets').find({ _id: result.insertedId }).limit(1).next()).then(savedDMXPreset => {
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

/***/ })

};
//# sourceMappingURL=0.8dfae39563c201985059.hot-update.js.map