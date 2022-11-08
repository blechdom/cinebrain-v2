import React from 'react';
import { FormGroup, FormControl, ControlLabel, ButtonToolbar, Button,
  Panel, Form, Col, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import NumInput from './NumInput.jsx';

import DateInput from './DateInput.jsx';
import Toast from './Toast.jsx';

export default class DeviceEdit extends React.Component {
  static dataFetcher({ params, urlBase }) {
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
      device.completionDate = device.completionDate != null ?
        new Date(device.completionDate) : null;
    } else {
      device = {
        _id: '', title: '', status: '', owner: '', effort: null,
        completionDate: null, created: null,
      };
    }
    this.state = {
      device,
      invalidFields: {}, showingValidation: false,
      toastVisible: false, toastMessage: '', toastType: 'success',
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
    const value = (convertedValue !== undefined) ? convertedValue : event.target.value;
    device[event.target.name] = value;
    this.setState({ device });
  }

  onValidityChange(event, valid) {
    const invalidFields = Object.assign({}, this.state.invalidFields);
    if (!valid) {
      invalidFields[event.target.name] = true;
    } else {
      delete invalidFields[event.target.name];
    }
    this.setState({ invalidFields });
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
      body: JSON.stringify(this.state.device),
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
    DeviceEdit.dataFetcher({ params: this.props.params })
    .then(data => {
      const device = data.DeviceEdit;
      device.created = new Date(device.created);
      device.completionDate = device.completionDate != null ?
        new Date(device.completionDate) : null;
      this.setState({ device });
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
      validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please correct invalid fields before submitting.
        </Alert>
      );
    }
    return (
      <Panel header="Edit Device">
        <Form horizontal onSubmit={this.onSubmit}>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>ID</Col>
            <Col sm={9}>
              <FormControl.Static>{device._id}</FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Created</Col>
            <Col sm={9}>
              <FormControl.Static>
                {device.created ? device.created.toDateString() : ''}
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Status</Col>
            <Col sm={9}>
              <FormControl
                componentClass="select" name="status" value={device.status}
                onChange={this.onChange}
              >
                <option value="New">New</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="Fixed">Fixed</option>
                <option value="Verified">Verified</option>
                <option value="Closed">Closed</option>
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Owner</Col>
            <Col sm={9}>
              <FormControl name="owner" value={device.owner} onChange={this.onChange} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Effort</Col>
            <Col sm={9}>
              <FormControl
                componentClass={NumInput} name="effort"
                value={device.effort} onChange={this.onChange}
              />
            </Col>
          </FormGroup>
          <FormGroup validationState={this.state.invalidFields.completionDate ? 'error' : null}>
            <Col componentClass={ControlLabel} sm={3}>Completion Date</Col>
            <Col sm={9}>
              <FormControl
                componentClass={DateInput} name="completionDate"
                value={device.completionDate} onChange={this.onChange}
                onValidityChange={this.onValidityChange}
              />
              <FormControl.Feedback />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Title</Col>
            <Col sm={9}>
              <FormControl name="title" value={device.title} onChange={this.onChange} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col smOffset={3} sm={6}>
              <ButtonToolbar>
                <Button bsStyle="primary" type="submit">Submit</Button>
                <LinkContainer to="/devices">
                  <Button bsStyle="link">Back</Button>
                </LinkContainer>
              </ButtonToolbar>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col smOffset={3} sm={9}>{validationMessage}</Col>
          </FormGroup>
        </Form>
        <Toast
          showing={this.state.toastVisible} message={this.state.toastMessage}
          onDismiss={this.dismissToast} bsStyle={this.state.toastType}
        />
      </Panel>
    );
  }
}

DeviceEdit.propTypes = {
  params: React.PropTypes.object.isRequired,
};

DeviceEdit.contextTypes = {
  initialState: React.PropTypes.object,
};
