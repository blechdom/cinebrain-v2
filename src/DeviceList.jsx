import React from 'react';
import 'isomorphic-fetch';
import { Link } from 'react-router';
import { Button, Glyphicon, Table, Panel } from 'react-bootstrap';

import DeviceFilter from './DeviceFilter.jsx';
import Toast from './Toast.jsx';


const DeviceRow = (props) => {

  return (
    <tr>
      <td>{props.device.device_number}</td>
      <td>{props.device.status}</td>
      <td>{props.device.name}</td>
      <td>{props.device.purpose}</td>
      <td>{props.device.protocol}</td>
      <td>{props.device.port}</td>
      <td>{props.device.control_types}</td>
    </tr>
  );
};

DeviceRow.propTypes = {
  device: React.PropTypes.object.isRequired,
  //deleteDevice: React.PropTypes.func.isRequired,
};

function DeviceTable(props) {
  const deviceRows = props.devices.map(device =>
    <DeviceRow key={device._id} device={device} /> //deleteDevice={props.deleteDevice} />
  );
  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Number</th>
          <th>Status</th>
          <th>Name</th>
          <th>Purpose</th>
          <th>Protocol</th>
          <th>Port</th>
          <th>Control Types</th>
        </tr>
      </thead>
      <tbody>{deviceRows}</tbody>
    </Table>
  );
}

DeviceTable.propTypes = {
  devices: React.PropTypes.array.isRequired,
 // deleteDevice: React.PropTypes.func.isRequired,
};

export default class DeviceList extends React.Component {
  static dataFetcher({ urlBase, location }) {
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
      devices,
      toastVisible: false, toastMessage: '', toastType: 'success',
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
    if (oldQuery.status === newQuery.status
        && oldQuery.effort_gte === newQuery.effort_gte
        && oldQuery.effort_lte === newQuery.effort_lte) {
      return;
    }
    this.loadData();
  }

  setFilter(query) {
    this.props.router.push({ pathname: this.props.location.pathname, query });
  }

  showError(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  loadData() {
    DeviceList.dataFetcher({ location: this.props.location })
    .then(data => {
      const devices = data.DeviceList.records;
      devices.forEach(device => {
        device.created = new Date(device.created);
        if (device.completionDate) {
          device.completionDate = new Date(device.completionDate);
        }
      });
      this.setState({ devices });
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
    return (
      <div>
        <Panel collapsible header="Filter">
          <DeviceFilter setFilter={this.setFilter} initFilter={this.props.location.query} />
        </Panel>
        <DeviceTable devices={this.state.devices} /> 
        <Toast
          showing={this.state.toastVisible} message={this.state.toastMessage}
          onDismiss={this.dismissToast} bsStyle={this.state.toastType}
        />
      </div>
    );
  }
}

DeviceList.propTypes = {
  location: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
};

DeviceList.contextTypes = {
  initialState: React.PropTypes.object,
};
