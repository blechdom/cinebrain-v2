import React from 'react';
import { withRouter } from 'react-router';
import { NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, ControlLabel,
  Button, ButtonToolbar } from 'react-bootstrap';

import Toast from './Toast.jsx';

class DeviceAddNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      toastVisible: false, toastMessage: '', toastType: 'success',
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
    const form = document.forms.deviceAdd;
    const newDevice = {
      owner: form.owner.value, title: form.title.value,
      status: 'New', created: new Date(),
    };
    fetch('/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDevice),
    }).then(response => {
      if (response.ok) {
        response.json().then(updatedDevice => {
          this.props.router.push(`/devices/${updatedDevice._id}`);
        });
      } else {
        response.json().then(error => {
          this.showError(`Failed to add device: ${error.message}`);
        });
      }
    }).catch(err => {
      this.showError(`Error in sending data to server: ${err.message}`);
    });
  }

  render() {
    return (
      <NavItem onClick={this.showModal}><Glyphicon glyph="plus" /> Create Device
        <Modal keyboard show={this.state.showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Device</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="deviceAdd">
              <FormGroup>
                <ControlLabel>Label</ControlLabel>
                <FormControl name="title" autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Type</ControlLabel>
                <FormControl name="owner" />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button type="button" bsStyle="primary" onClick={this.submit}>Submit</Button>
              <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
        <Toast
          showing={this.state.toastVisible} message={this.state.toastMessage}
          onDismiss={this.dismissToast} bsStyle={this.state.toastType}
        />
      </NavItem>
    );
  }
}

DeviceAddNavItem.propTypes = {
  router: React.PropTypes.object,
};

export default withRouter(DeviceAddNavItem);
