import React from 'react';
import 'isomorphic-fetch';
import { Button, FormGroup, FormControl, ControlLabel, LinkContainer, Form, Row, Col, Nav, NavItem, NavDropdown, MenuItem, ButtonToolbar, Tabs, Tab, TabContainer, TabContent, TabPane} from 'react-bootstrap';
import TelnetDiagnostics from './TelnetDiagnostics.jsx';
import MIDIDiagnostics from './MIDIDiagnostics.jsx';
import DMXDiagnostics from './DMXDiagnostics.jsx';
import OSCDiagnostics from './OSCDiagnostics.jsx';


export default class Diagnostics extends React.Component {
 
constructor(props){
    super(props);
	this.state = {
	
	}
}
 render() {
 	return (
	<div>
	<h1>Diagnostics</h1>
		<Tabs defaultActiveKey={"telnet-tab"} id="uncontrolled-tabs">
          <Tab eventKey={"telnet-tab"} title="Telnet">
          	<TelnetDiagnostics path={this.props.location.pathname} />
          </Tab>
		  <Tab eventKey={"dmx-tab"} title="DMX">
		   	<DMXDiagnostics path={this.props.location.pathname} />
		  </Tab>
		  <Tab eventKey={"midi-tab"} title="MIDI">
		    <MIDIDiagnostics path={this.props.location.pathname} />
		  </Tab>
		  <Tab eventKey={"osc-tab"} title="OSC">
		    <OSCDiagnostics path={this.props.location.pathname} />
		  </Tab>
		</Tabs>
	</div>
    );
  };
}

