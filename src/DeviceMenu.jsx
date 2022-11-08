import React from 'react';
import ReactDOM from 'react-dom'
import _ from "lodash";
import 'isomorphic-fetch';
import { Col, Row, FormGroup, FormControl, ControlLabel, Button, Table, Panel, Glyphicon } from 'react-bootstrap';
import SocketIOClient from 'socket.io-client';
let socket;

export default class DeviceMenu extends React.Component {

  static dataFetcher({ urlBase, location }) {
    return fetch(`${urlBase || ''}/api/devices${location.search}`).then(response => {
      if (!response.ok) return response.json().then(error => Promise.reject(error));
      return response.json().then(data => ({ DeviceMenu: data }));
    });
  }

  constructor(props, context){
    super(props, context);
    const devices = context.initialState.DeviceMenu ? context.initialState.DeviceMenu.records : [];
    this.state = {
      devices,
    };
  this.deviceOptions = [<option key="0" value="0">Select a Device</option>];
  this.onDeviceSelect = this.onDeviceSelect.bind(this);
}
componentDidMount() {
    this.loadData();
	socket = SocketIOClient();
        socket.on(this.props.location.pathname, (mesg) => {
                this.setState({text: mesg});
        });
  }
componentWillUnmount() {
        socket.off(this.props.page);
}
  loadData() {
    DeviceMenu.dataFetcher({ location: this.props.location })
    .then(data => {
      const devices = data.DeviceMenu.records;
      devices.forEach(device => {
        this.deviceOptions.push(<option key={device._id} value={device.device_number}>{device.name}</option>);
      });
      this.setState({ devices });
    }).catch(err => {
      this.showError(`Error in fetching data from server: ${err}`);
    });
  }

  onDeviceSelect(event) {
	console.log("device #" + event.target.value);
	socket.emit('device-menu', event.target.value); 
  }
render() {
  return (
     
        <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Device</Col>
            <Col sm={9}>
              <FormControl componentClass="select" onChange={this.onDeviceSelect}>
                  {this.deviceOptions}
              </FormControl>
            </Col>
        </FormGroup>
	
    );
  }
}
DeviceMenu.propTypes = {
  location: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
};

DeviceMenu.contextTypes = {
  initialState: React.PropTypes.object,
}; 
