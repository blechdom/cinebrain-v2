const dgram = require('dgram');
const message = Buffer.from('0x88,0x30,0x01,0xFF,0x88,0x01,0x00,0x01,0xFF,0x81,0x01,0x04,0x00,0x03,0xFF'); //address 88 30 01 FF, if clear 88 01 00 01 FF, power off 81 01 04 00 03 FF
const client = dgram.createSocket('udp4');
client.send(message, 52380, '192.168.0.100', (err) => {
  client.close();
});