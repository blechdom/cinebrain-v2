import React from 'react';
import ReactDOM from 'react-dom'
import _ from "lodash";
import 'isomorphic-fetch';
import { Col, Row, FormGroup, FormControl, ControlLabel, Button, Table, Panel, Glyphicon } from 'react-bootstrap';
import SocketIOClient from 'socket.io-client';
let socket;

export default class ParametersMenu extends React.Component {

  static dataFetcher({ urlBase, location }) {
    return fetch(`${urlBase || ''}/api/device_1_casparcg${location.search}`).then(response => {
      if (!response.ok) return response.json().then(error => Promise.reject(error));
      return response.json().then(data => ({ ParametersMenu: data }));
    });
  }

  constructor(props, context){
    super(props, context);
    const parameters = context.initialState.ParametersMenu ? context.initialState.ParametersMenu.records : [];
    this.state = {
      parameters,
	showing: false,
    };
  this.showParameters = this.showParameters.bind(this);
  this.hideParameters = this.hideParameters.bind(this);
  this.parameterOptions = [<option key="0" value="play 1-0 amb.mp4">Select a Parameter</option>]
  this.onParameterSelect = this.onParameterSelect.bind(this);
}
showParameters(){
	this.setState({showing:true });
}
hideParameters(){
	this.setState({showing:false });
}
componentDidMount() {
    this.loadData();
	socket = SocketIOClient();
        socket.on(this.props.location.pathname, (mesg) => {
                this.setState({text: mesg});
        });
	socket.on("show-parameters", (mesg) => {
	       console.log("show params " + mesg);
                this.setState({showing: true});
        });
  }
componentWillUnmount() {
        socket.off(this.props.page);
}
  loadData() {
    ParametersMenu.dataFetcher({ location: this.props.location })
    .then(data => {
      const parameters = data.ParametersMenu.records;
     parameters.forEach(parameter => {
        this.parameterOptions.push(<option key={parameter.notes} value={parameter.notes}>{parameter.command}</option>);
      });
      this.setState({ parameters });
    }).catch(err => {
      this.showError(`Error in fetching data from server: ${err}`);
    });
  }

  onParameterSelect(event) {
	console.log("parameter #" + event.target.value);
	socket.emit('parameter-menu', event.target.value); 
  }

render() {
   return (
      <div>
       { this.state.showing
                    ? 
			<FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Parameter</Col>
              <Col sm={9}>
			 <FormControl componentClass="select" onChange={this.onParameterSelect}>
                        	{this.parameterOptions}
                	</FormControl>
                </Col>
              </FormGroup>
                    : null
                }
	</div>
    );
  }
}
ParametersMenu.propTypes = {
  location: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
};

ParametersMenu.contextTypes = {
  initialState: React.PropTypes.object,
}; 
