import React from 'react';
import { withRouter } from 'react-router';
import ReactDOM from 'react-dom'
import 'isomorphic-fetch';
import { Button, FormGroup, FormControl, ControlLabel, Form, Row, Col, ButtonToolbar} from 'react-bootstrap';
import { SocketProvider } from 'socket.io-react';
import SocketIOClient from 'socket.io-client';
let socket;

export default class TelnetDiagnostics extends React.Component {
 
constructor(props, context){
    super(props, context);
	this.state = {
		text: '',
		host: '127.0.0.1',
		port: 5250,
		command: "cls",
		response: '',
	}
	this.onHostChange = this.onHostChange.bind(this);
	this.onPortChange = this.onPortChange.bind(this);
	this.onCommandChange = this.onCommandChange.bind(this);
	this.sendTelnetTest = this.sendTelnetTest.bind(this);
}
componentDidMount() {
	socket = SocketIOClient();
	socket.on(this.props.path, (mesg) => {
		this.setState({text: mesg});
	});
	socket.on('telnet-response', (mesg) => {
		this.setState({response: mesg});
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
  console.log("sending telnet test...");
  socket.emit('diagnostics-send-telnet', { host: this.state.host, port: this.state.port, command: this.state.command});
}
 render() {
 	return (
		<div>
		    <div>
				<Form horizontal onSubmit={this.sendTelnetTest}>
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
		                <Button bsStyle="primary" type="submit">Send Telnet Command</Button>
		              </ButtonToolbar>
		            </Col>
		          </FormGroup>
		        </Form>
			</div>
			<div>{this.state.response}</div>
		</div>
    );
  };
}
