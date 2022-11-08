import React from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import ReactDOM from 'react-dom'
import _ from "lodash";
import 'isomorphic-fetch';
import {Row, Col, Button} from 'react-bootstrap';
import FaLock from 'react-icons/lib/fa/lock';
import FaUnlock from 'react-icons/lib/fa/unlock';
import { SocketProvider } from 'socket.io-react';
import SocketIOClient from 'socket.io-client';
import {isIos} from 'react-device-detect';


const ResponsiveReactGridLayout = WidthProvider(Responsive);
let lockIcon = <FaLock />;
let socket;

export default class PTZGroup2 extends React.Component {

  constructor(props, context){
    super(props, context);
    this.state = {
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
      lock: true,
      host: '127.0.0.1',
      port: 5250,
      PTZhost: '192.168.0.200',
      PTZport: 52381,
      command: "",
      response: '',
      compactType: null,
  };
  this.onBreakpointChange = this.onBreakpointChange.bind(this);
  this.handleOnLock = this.handleOnLock.bind(this);
  this.handleButtons = this.handleButtons.bind(this);
  this.handleButtonRelease = this.handleButtonRelease.bind(this);
  this.handleUpEvent = this.handleUpEvent.bind(this);
  this.handleDownEvent = this.handleDownEvent.bind(this);
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
 createElement(el) {
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
      background: "#FFF"
    };
    const i = el.add ? "+" : el.i;
    let controllerCode = <button className={el.className} value={el.i} onMouseDown={this.handleDownEvent} onTouchStart={this.handleDownEvent} onTouchEnd={this.handleUpEvent} onMouseUp={this.handleUpEvent}>{el.text}</button>;
    if (el.type==1) { //type is slider
      controllerCode =  <div> <span className="text">{el.text}</span>
                <div id="slidecontainer">
                <input type="range" min="1" max="100" value={el.sliderValue} id={i} className="slider" onChange={this.handleSliders}/></div>
        </div>;
    }
	   return (
     		<div key={i} data-grid={el} style={gridStyle}>
		        {controllerCode}
      		  <span style={lockStyle}></span>
		    </div>
    	);
}
handleDownEvent(event) {
  if (isIos) {
    if (event.type == "touchstart") {
      this.handleButtons(event);
    }
  }
  else
  {
    this.handleButtons(event);
  }
}
handleUpEvent(event) {
  if (isIos) {
    if (event.type != "touchend") {
      this.handleButtonRelease(event);
    }
  }
  else
  {
    this.handleButtonRelease(event);
  }
}
handleButtons(event) {
  console.log(event.target.id + ': ' + event.target.value);
  event.preventDefault();
  switch (event.target.value) {
  
  case 'ptz_on':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000060000000c8101040002ff'});
    break;
  case 'ptz_off':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000060000000c8101040003ff'});
    break;
  case 'ptz_preset_1':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0200ff'});
    break;
  case 'ptz_preset_2':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0201ff'});
    break;
  case 'ptz_preset_3':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0202ff'});
    break;
  case 'ptz_preset_4':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0203ff'});
    break;
  case 'ptz_preset_5':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0204ff'});
    break;
  case 'ptz_preset_6':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0205ff'});
    break;
  case 'ptz_save_preset_1':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000108101043f0100ff'});
    break;
  case 'ptz_save_preset_2':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0101ff'});
    break;
  case 'ptz_save_preset_3':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0102ff'});
    break;
  case 'ptz_save_preset_4':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0103ff'});
    break;
  case 'ptz_save_preset_5':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0104ff'});
    break;
  case 'ptz_save_preset_6':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000007000000648101043f0105ff'});
    break;
  case 'ptz_up_left':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '0100000900000099810106010c080101ff'});
    break;
  case 'ptz_up':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000090000009b810106010c080301ff'});
    break;
  case 'ptz_up_right':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000090000009d810106010c080201ff'});
    break;
  case 'ptz_left':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000a3810106010c080103ff'});
    break;
  case 'ptz_right':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000a5810106010c080203ff'});
    break;
  case 'ptz_down_left':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000a7810106010c080102ff'});
    break;
  case 'ptz_down':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000a9810106010c080302ff'});
    break;
  case 'ptz_down_right':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000ab810106010c080202ff'});
    break;
  case 'ptz_zoom_in':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000b78101040723ff'});
    break;
  case 'ptz_zoom_out':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000b98101040733ff'});
    break;
  case 'ptz_iris_up':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101040b02ff'});
    break;
  case 'ptz_iris_down':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101040b03ff'});
    break;
  case 'ptz_shutter_up':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101040a02ff'});
    break;
  case 'ptz_shutter_down':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101040a03ff'});
    break;
  case 'ptz_gain_up':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101040c02ff'});
    break;
  case 'ptz_gain_down':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101040c03ff'});
    break;
  case 'ptz_iris_priority':
    socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '0100000600000009810104390Bff'});
    break;
  case 'ptz_shutter_priority':
    socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '0100000600000009810104390Aff'});
    break;
  case 'ptz_bright_mode':
    socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '0100000600000009810104390Dff'});
    break;
  case 'ptz_bright_up':
    socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000098101040D02ff'});
    break;
  case 'ptz_bright_down':
    socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000098101040D03ff'});
    break;
  case 'ptz_awb':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101043500ff'});
    break;
case 'ptz_onetouch_wb':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101043503ff'});
    break;
 case 'ptz_onetouch_wb_trigger':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101041005ff'});
    break;   
  case 'ptz_manual_wb':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101043505ff'});
    break;
  case 'ptz_full_auto':
    socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000098101043900ff'});
    break;
   case 'ptz_manual_exposure':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101043903ff'});
    break;
  case 'ptz_fx_off':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003148101046300ff'});
    break;
  case 'ptz_fx_neg':
    socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000098101046302ff'});
    break;
   case 'ptz_fx_bw':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000003168101046304ff'});
    break;
    case 'ptz_onscreen_on':
    socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000060000000c81017e011802ff'});
    break;
   case 'ptz_onscreen_off':
     socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '010000060000000c81017e011803ff'});
    break;
//81017e011802ff Information display On    
//81017e011803ff Information display Off

  default:
    console.log('ERROR: Button does not exist');
  }
} 
handleButtonRelease(event) {
  console.log(event.target.id + " :mouse upped");

  switch (event.target.value) {
  
    case 'ptz_zoom_in':
      socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000ba8101040700ff'});
      break;
    case 'ptz_zoom_out':
      socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000006000000ba8101040700ff'});
      break;
    default:
      socket.emit('ptz-go', { host: this.state.PTZhost, port: this.state.PTZport, buffer: '01000009000000ac810106010c080303ff'});
   
  }
   
   


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
render() {
  return (
      <div><div>
 	      <Row>
      	  <Col xs={2} sm={2} md={2} lg={2}>
      	    <button onClick={this.handleOnLock}>{lockIcon}</button>
          </Col>
            <Col xs={10} sm={10} md={10} lg={10}>
           <strong>Group 2: CAMERA</strong>
          </Col>
      	</Row>
	     <ResponsiveReactGridLayout
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
	        isDraggable={!this.state.lock}
	        isResizable={!this.state.lock}  
          compactType={this.state.compactType}
	        {...this.props}
	     >
  	     {_.map(this.state.items, el => this.createElement(el))}
       </ResponsiveReactGridLayout>
     </div>
     <div>{this.state.response}</div>
     </div>
    );
  }
  componentWillUnmount() {
    socket.off(this.props.page);
  }
  componentDidMount() {
    socket = SocketIOClient();
    socket.on('telnet-response', (mesg) => {
      this.setState({response: mesg});
    });
    this.setState({
         items: [
              {
                type: 0,
                i: "ptz_on",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0,//Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'PTZ On',
              },
              {
                type: 0,
                i: "ptz_off",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 1,//Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'PTZ Off',
              },
              {
                type: 0,
                i: "ptz_preset_1",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Preset 1',
              },
              {
                type: 0,
                i: "ptz_preset_2",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 1, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Preset 2',
              },
              {
                type: 0,
                i: "ptz_preset_3",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Preset 3',
              },
              {
                type: 0,
                i: "ptz_preset_4",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 1, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Preset 4',
              },
              {
                type: 0,
                i: "ptz_preset_5",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Preset 5',
              },
              {
                type: 0,
                i: "ptz_preset_6",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 1, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Preset 6',
              },
               {
                type: 0,
                i: "ptz_zoom_in",
                x: 0,// (this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,// Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-warning',
                text: 'Zoom In',
              },
              {
                type: 0,
                i: "ptz_zoom_out",
                x: 0,// (this.state.items.length * 2) % (this.state.cols || 12),
                y: 3,// Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-warning',
                text: 'Zoom Out',
              },
              {
                type: 0,
                i: "ptz_save_preset_1",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Save Pset 1',
              },
              {
                type: 0,
                i: "ptz_save_preset_2",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 3, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Save Pset 2',
              },
              {
                type: 0,
                i: "ptz_save_preset_3",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Save Pset 3',
              },
              {
                type: 0,
                i: "ptz_save_preset_4",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 3, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Save Pset 4',
              },
              {
                type: 0,
                i: "ptz_save_preset_5",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Save Pset 5',
              },
              {
                type: 0,
                i: "ptz_save_preset_6",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 3, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Save Pset 6',
              },
              {
                type: 0,
                i: "ptz_up_left",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 4, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Up Left',
              },
              {
                type: 0,
                i: "ptz_up",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 4, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Up',
              },
               {
                type: 0,
                i: "ptz_up_right",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 4, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Up Right',
              },
              {
                type: 0,
                i: "ptz_left",
                x: 0,// (this.state.items.length * 2) % (this.state.cols || 12),
                y: 5,// Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Left',
              },
              {
                type: 0,
                i: "ptz_right",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 5, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Right',
              },
              {
                type: 0,
                i: "ptz_down_left",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 6, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Down Left',
              },
              {
                type: 0,
                i: "ptz_down",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 6, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Down',
              },
              {
                type: 0,
                i: "ptz_down_right",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 6, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Down Right',
              },
              
              {
                type: 0,
                i: "ptz_onetouch_wb",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 13, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'WB Set Standby',
              },
              {
                type: 0,
                i: "ptz_onetouch_wb_trigger",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 13, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Press to Set WB',
              },
              {
                type: 0,
                i: "ptz_awb",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 13, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Auto White Balance',
              },
               {
                type: 0,
                i: "ptz_full_auto",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 7, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Full Auto',
              },
               {
                type: 0,
                i: "ptz_manual_exposure",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 7, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Manual Exposure',
              },
               {
                type: 0,
                i: "ptz_iris_priority",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 8, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Iris Priority',
              },
               {
                type: 0,
                i: "ptz_iris_up",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 8, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Iris Up',
              },
              {
                type: 0,
                i: "ptz_iris_down",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 8, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Iris Down',
              },
              {
                type: 0,
                i: "ptz_shutter_priority",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 9, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Shutter Priority',
              },
               {
                type: 0,
                i: "ptz_shutter_up",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 9, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Shutter Up',
              },
               {
                type: 0,
                i: "ptz_shutter_down",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 9, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Shutter Down',
              },
               {
                type: 0,
                i: "ptz_gain_up",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 10, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Gain Up',
              },
               {
                type: 0,
                i: "ptz_gain_down",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 10, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Gain Down',
              },
              {
                type: 0,
                i: "ptz_bright_up",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 11, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Bright Up',
              },
               {
                type: 0,
                i: "ptz_bright_down",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 11, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Bright Down',
              },              
               {
                type: 0,
                i: "ptz_bright_mode",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 11, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Bright Mode',
              },
              {
                type: 0,
                i: "ptz_fx_off",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 12, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Effect Off',
              },
              {
                type: 0,
                i: "ptz_fx_neg",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 12, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Effect Negative',
              },
              {
                type: 0,
                i: "ptz_fx_bw",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 12, //Infinity,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Black+White',
              },
            ]
      });
}
}
PTZGroup2.defaultProps = {
    className: "layout",
    rowHeight: 30,
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
};
