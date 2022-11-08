import React from 'react';
import 'isomorphic-fetch';
import { Button, FormGroup, FormControl, ControlLabel, Form, Col, ButtonToolbar} from 'react-bootstrap';
import { SocketProvider } from 'socket.io-react';
import SocketIOClient from 'socket.io-client';
let socket;

export default class ParameterInput extends React.Component {
 
constructor(props){
      super(props);
      this.state = {
        text: '',
        host: '127.0.0.1',
        port: 5250,
        command: "",
        response: '',
        showing: false,
      }
      this.showParameterInputs = this.showParameterInputs.bind(this);
      this.hideParameterInputs = this.hideParameterInputs.bind(this);
      this.onHostChange = this.onHostChange.bind(this);
      this.onPortChange = this.onPortChange.bind(this);
      this.onCommandChange = this.onCommandChange.bind(this);
      this.sendCommand = this.sendCommand.bind(this);
}
componentDidMount() {
  socket = SocketIOClient();
  socket.on('show-parameter-inputs', (mesg) => {
    this.setState({showing: true});
  });
  socket.on('telnet-response', (mesg) => {
    this.setState({response: mesg});
  });
}
componentWillUnmount() {
  socket.off(this.props.page);
}
showParameterInputs(){
  this.setState({showing:true });
}
hideParameterInputs(){
  this.setState({showing:false });
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
  socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: this.state.command});
}
 render() {
  return (
      <div>
  { this.state.showing
           ? 
           <div>

          <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Host</Col>
              <Col sm={9}>
                <FormControl name="host" value={this.state.host} onChange={this.onHostChange} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Port</Col>
              <Col sm={9}>
                <FormControl name="port" value={this.state.port} onChange={this.onPortChange} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Telnet Command</Col>
              <Col sm={9}>
                <FormControl name="command" value={this.state.command} onChange={this.onCommandChange} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button onClick={this.sendCommand}>Send Telnet Command</Button>
                </ButtonToolbar>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
              {this.state.response}
              </Col>
           </FormGroup>  
        </div>

   : null
        }
          </div>
    );
  };
}

