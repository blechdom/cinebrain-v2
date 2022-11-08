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
  manual_link: true,
};

const deviceFieldType = {
  device_id: 'required',
  name: 'required',
  purpose: 'optional',
  control_types: 'optional',
  status: 'required',
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

  return (errors.length ? errors.join('; ') : null);
}

export default {
  validateDevice,
  cleanupDevice,
  convertDevice,
};
