import React from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import ReactDOM from 'react-dom'
import _ from "lodash";
//import 'isomorphic-fetch';
import { Col, Row, FormGroup, FormControl, ControlLabel, Button, Table, Panel, Glyphicon } from 'react-bootstrap';
import FaLock from 'react-icons/lib/fa/lock';
import FaUnlock from 'react-icons/lib/fa/unlock';
import MdFileUpload from 'react-icons/lib/md/file-upload';
import MdFileDownload from 'react-icons/lib/md/file-download';
import MdEdit from 'react-icons/lib/md/edit';
import MdClose from 'react-icons/lib/md/close';
import Toast from './Toast.jsx';
import AddController from './AddController.jsx';
//import Joystick from './Joystick.jsx';


const ResponsiveReactGridLayout = WidthProvider(Responsive);
let lockIcon = <FaLock />;

const DeviceRow = (props) => {
  return (
      <option value={props.device.device_number}>{props.device.name}</option>
  );
};

DeviceRow.propTypes = {
  device: React.PropTypes.object.isRequired,
};

function DeviceTable(props) {
  const deviceRows = props.devices.map(device =>
    <DeviceRow key={device._id} device={device} />
  );
  return (
      	<FormControl componentClass="select"
              onChange={props.onDeviceSelect}>
		{deviceRows}
	</FormControl>
  );
}

DeviceTable.propTypes = {
  devices: React.PropTypes.array.isRequired,
  onDeviceSelect: React.PropTypes.func.isRequired,
  };

export default class NewControllers extends React.Component {

  static dataFetcher({ urlBase, location }) {
    return fetch(`${urlBase || ''}/api/devices${location.search}`).then(response => {
      if (!response.ok) return response.json().then(error => Promise.reject(error));
      return response.json().then(data => ({ NewControllers: data }));
    });
  }

  constructor(props, context){
    super(props, context);
    const devices = context.initialState.NewControllers ? context.initialState.NewControllers.records : [];
    this.state = {
      devices,
      toastVisible: false,
      toastMessage: '',
      toastType: 'success',
      items: [].map(function(i, key, list) {
        return {
          type: 0,
          i: i.toString(),
          x: i * 2,
          y: 0,
          w: 2,
          h: 2,
          add: i === (list.length - 1).toString(),
	  sliderValue: 0,
        };
      }),
      buttonCounter: 0, 
      sliderCounter: 0,
      xyCounter: 0,
      lock: true,
  };
  this.onAddButton = this.onAddButton.bind(this);
  this.onAddSlider = this.onAddSlider.bind(this);
  this.onAddXY = this.onAddXY.bind(this);
  this.onBreakpointChange = this.onBreakpointChange.bind(this);
  this.onEditItem = this.onEditItem.bind(this);
  this.handleSliderChange = this.handleSliderChange.bind(this);
  this.handleOnLock = this.handleOnLock.bind(this);
  this.handleOnDownload = this.handleOnDownload.bind(this);
  this.handleOnUpload = this.handleOnUpload.bind(this);
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
 showError(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  loadData() {
    NewControllers.dataFetcher({ location: this.props.location })
    .then(data => {
      const devices = data.NewControllers.records;
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

 handleSliderChange (event)  { //not updating correct object
    this.setState({sliderValue: event.target.value});
    console.log(event.target.id + ': ' + this.state.sliderValue);
 }
 handleOnLock(){
   if (this.state.lock == true) {
	lockIcon = <FaUnlock />;
  	this.setState({lock: false}); 
   } else { 
	lockIcon = <FaLock />;
  	this.setState({lock: true});
   } 
 }
 handleOnDownload(){
   console.log("download file with data to be loaded again later ");
 }
 handleOnUpload(){
   console.log("upload previously saved file to use");
 }
 createElement(el) {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer"
    };
   const editStyle = {
     position: "absolute",
     right: "2px",
     bottom: 0,
     cursor: "pointer"
   };
   let lockStyle = {
     display: "none",
   };
   if (this.state.lock==false){
	lockStyle = {
		position: "absolute",
		right: "2px",
		top: 0,
		cursor: "pointer",
    		display: "inline",
	};
   }
   const gridStyle = {
      background: "#EEE"
    };
    const i = el.add ? "+" : el.i;
    let typeCode = <button>{i}</button>;
    if (el.type==1) { //type is slider
      typeCode = <div> <span className="text">{i}</span>
                <div id="slidecontainer">
                <input type="range" min="1" max="100" value={el.sliderValue} id={i} className="slider" onChange={this.handleSliderChange}/></div>
    		</div>;
    }
    else if (el.type==2) { //type is xy area
       typeCode = <div>xy joystick here</div>
    }
	return (
     		<div key={i} data-grid={el} style={gridStyle}>
		{typeCode}
      		<span style={lockStyle}>
			<span className="edit"
                        onClick={this.onEditItem.bind(this, i)}>
                        <MdEdit />
                </span>
		<span className="remove"
                        onClick={this.onRemoveItem.bind(this, i)}>
                        <MdClose />
                </span></span>
		</div>
    	);
}

  onAddButton() {

	 console.log("adding ", "button " + this.state.buttonCounter);
    this.setState({
 items: this.state.items.concat({
        type: 0,
	i: "button-" + this.state.buttonCounter,
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, 
        w: 2,
        h: 2,
      }),
 buttonCounter: this.state.buttonCounter + 1
    });
  }
onAddSlider() {
    console.log("adding ", "slider " + this.state.sliderCounter);
    this.setState({
 items: this.state.items.concat({
        type: 1,
	i: "slider-" + this.state.sliderCounter,
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity,
        w: 2,
        h: 2,
      }),
 sliderCounter: this.state.sliderCounter + 1
    });
  }
onAddXY() {
    console.log("adding ", "xy " + this.state.xyCounter);
    this.setState({
 items: this.state.items.concat({
	type: 2,
        i: "xy-" + this.state.xyCounter,
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity,
        w: 2,
        h: 2,
      }),
 xyCounter: this.state.xyCounter + 1
    });
  }
onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }
 onLayoutChange(layout) {
    console.log("layout:", layout);
 }
 onRemoveItem(i) {
    console.log("removing", i);
    this.setState({ items: _.reject(this.state.items, { i: i }) });
  }
 onEditItem(i) {
   console.log("edit item: " + i);
 } 
render() {
  return (
      <div>goobydooby
 	<Row>
          <Col xs={6} sm={3} md={2} lg={1}>
	<AddController />
	 <DeviceTable devices={this.state.devices} onDeviceSelect={this.onAddButton} />
	 <Toast
          showing={this.state.toastVisible} message={this.state.toastMessage}
          onDismiss={this.dismissToast} bsStyle={this.state.toastType}
        />
  	  </Col>
	  <Col xs={6} sm={3} md={2} lg={1}>
      	    <button onClick={this.onAddSlider}>Add Slider</button>
	    <button onClick={this.onAddXY}>Add X/Y Area</button>
	</Col>
          <Col xs={6} sm={3} md={2} lg={1}>
 	</Col>
	  <Col xs={6} sm={3} md={2} lg={1}>
	    <button className="pull-right" onClick={this.handleOnLock}>{lockIcon}</button>
	    <button className="pull-right" onClick={this.handleOnDownload}><MdFileDownload /></button>
	    <button className="pull-right" onClick={this.handleOnUpload}><MdFileUpload /></button>
	  </Col>
	</Row>
	<ResponsiveReactGridLayout
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
	  isDraggable={!this.state.lock}
	isResizable={!this.state.lock}  
	{...this.props}
	>
  	 {_.map(this.state.items, el => this.createElement(el))}
       </ResponsiveReactGridLayout>
     </div>
    );
  }
}
NewControllers.defaultProps = {
    className: "layout",
    rowHeight: 30,
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
};
NewControllers.propTypes = {
  location: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
};

NewControllers.contextTypes = {
  initialState: React.PropTypes.object,
}; 
