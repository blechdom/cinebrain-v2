import React from 'react';
import ReactDOM from 'react-dom'
import _ from "lodash";
import 'isomorphic-fetch';
import {Button, FormGroup, FormControl, ControlLabel, Form, Row, Col, ButtonToolbar} from 'react-bootstrap';
import { SocketProvider } from 'socket.io-react';
import SocketIOClient from 'socket.io-client';
let socket;

export default class MIDIDiagnostics extends React.Component {

constructor(props, context){
  super(props, context);
  this.state = {
      channel: 1,
      program_num: 1,
      cc_num: 1,
      cc_val: 0,
      pitch_num: 1,
      velocity: 0,
  };
  this.onMidiChannelChange = this.onMidiChannelChange.bind(this);
  this.onProgramNumChange = this.onProgramNumChange.bind(this);
  this.onCCNumChange = this.onCCNumChange.bind(this);
  this.onCCValChange = this.onCCValChange.bind(this);
  this.sendProgramChangeTest = this.sendProgramChangeTest.bind(this);
  this.sendCCTest = this.sendCCTest.bind(this);
}
componentDidMount() {
  socket = SocketIOClient();
  socket.on('telnet-response', (mesg) => {
    this.setState({response: mesg});
  });
  
}
componentWillUnmount() {
  socket.off(this.props.page);
}
onMidiChannelChange(event){
  this.setState({ channel: event.target.value });
}
onProgramNumChange(event){
  this.setState({ program_num: event.target.value });
}
onCCNumChange(event){
  this.setState({ cc_num: event.target.value });
}
onCCValChange(event){
  this.setState({ cc_val: event.target.value });
}
sendProgramChangeTest(){
  console.log("sending MIDI Program Change test...");
  socket.emit('midi-program', {number:this.state.program_num, channel:this.state.channel});
}
sendCCTest(){
  console.log("sending MIDI CC test...");
  socket.emit('midi-cc', {controller: this.state.cc_num, value:this.state.cc_val, channel:this.state.channel});
}
render() {
  return (
    <div>
      <div>
        <Form horizontal>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Channel</Col>
            <Col sm={9}>
              <FormControl type="number" name="channel" value={this.state.channel} onChange={this.onMidiChannelChange} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Program Number</Col>
            <Col sm={9}>
              <FormControl type="number" name="program_num" value={this.state.program_num} onChange={this.onProgramNumChange} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col smOffset={3} sm={6}>
              <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.sendProgramChangeTest}>Send Program Change</Button>
              </ButtonToolbar>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Controller Number</Col>
            <Col sm={9}>
              <FormControl type="number" name="cc_num" value={this.state.cc_num} onChange={this.onCCNumChange} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Controller Value</Col>
            <Col sm={9}>
              <FormControl type="number" name="cc_val" value={this.state.cc_val} onChange={this.onCCValChange} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col smOffset={3} sm={6}>
              <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.sendCCTest}>Send Continuous Controller Test</Button>
              </ButtonToolbar>
            </Col>
          </FormGroup>
        </Form>
      </div>
    </div>
    );
  }
}
