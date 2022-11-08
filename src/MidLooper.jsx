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


const ResponsiveReactGridLayout = WidthProvider(Responsive);
let lockIcon = <FaLock />;
let socket;

export default class MIDILooper extends React.Component {

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
      command: "",
      response: '',
      compactType: null,
      spot_speed: 215,
  };
  this.onBreakpointChange = this.onBreakpointChange.bind(this);
  this.handleOnLock = this.handleOnLock.bind(this);
  this.handleButtons = this.handleButtons.bind(this);
  this.handleSliders = this.handleSliders.bind(this);
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
    let controllerCode = <button className={el.className} value={el.i} onClick={this.handleButtons}>{el.text}</button>;
    if (el.type==1) { //type is slider
      controllerCode =  <div> <span className="text">{el.text}</span>
                <div id="slidecontainer">
                <input type="range" min="0" max="127" value={el.sliderValue} id={i} className="slider" onChange={this.handleSliders}/></div>
        </div>;
    }
	   return (
     		<div key={i} data-grid={el} style={gridStyle}>
		        {controllerCode}
      		  <span style={lockStyle}></span>
		    </div>
    	);
}

handleButtons(event) {
  console.log(event.target.id + ': ' + event.target.value);

  switch (event.target.value) {
  
  case 'push-record':
     socket.emit('midi-cc', {controller:102, value: 127, channel:0 });
    break;
  case 'push-play':
     socket.emit('midi-cc', {controller:104, value: 127, channel:0 });
    break;
  case 'mute-all':
     socket.emit('midi-program', {number: 126, channel:0});
    break;
  case 'push-new':
     socket.emit('midi-program', {number: 103, channel:0});
    break;
  case 'push-reverse':
     socket.emit('midi-program', {number: 103, channel:0});
    break;
  case 'push-octave':
     socket.emit('midi-program', {number: 103, channel:0});
    break;
  case 'push-mixdown':
     socket.emit('midi-program', {number: 103, channel:0});
    break;
  case 'push-punchin':
     socket.emit('midi-program', {number: 103, channel:0});
    break;
  case 'select-track-1':
     socket.emit('midi-program', {number:106, channel:0 });
    break;
   case 'select-track-2':
     socket.emit('midi-program', {number:106, channel:0 });
    break;
   case 'select-track-3':
     socket.emit('midi-program', {number:106, channel:0 });
    break;
   case 'select-track-4':
     socket.emit('midi-program', {number:106, channel:0 });
    break;
  default:
    console.log('ERROR: Button does not exist');
  }
} 
handleSliders(event) {
  console.log(event.target.id + ': ' + event.target.value);
  let slider_value = event.target.value;
  switch (event.target.id) {
  case 'track-1-level':
      socket.emit('midi-cc', {controller:21, value:slider_value, channel:0});
      break;
  case 'track-2-level':
      socket.emit('midi-cc', {controller:22, value:slider_value, channel:0});
      break;
  case 'track-3-level':
      socket.emit('midi-cc', {controller:23, value:slider_value, channel:0});
      break;
  case 'track-4-level':
      socket.emit('midi-cc', {controller:24, value:slider_value, channel:0});
      break;
    case 'track-1-pan':
      socket.emit('midi-cc', {controller:28, value:slider_value, channel:0});
      break;
  case 'track-2-pan':
      socket.emit('midi-cc', {controller:29, value:slider_value, channel:0});
      break;
  case 'track-3-pan':
      socket.emit('midi-cc', {controller:30, value:slider_value, channel:0});
      break;
  case 'track-4-pan':
      socket.emit('midi-cc', {controller:31, value:slider_value, channel:0});
      break;
  case 'dry-out-level':
      socket.emit('midi-cc', {controller:20, value:slider_value, channel:0});
      break;
    case 'dry-out-pan':
      socket.emit('midi-cc', {controller:27, value:slider_value, channel:0});
      break;
  case 'mix-down-level':
      socket.emit('midi-cc', {controller:25, value:slider_value, channel:0});
      break;
    case 'tempo':
      socket.emit('midi-cc', {controller:26, value:slider_value, channel:0});
      break;
  
  default:
    console.log('ERROR: Slider does not exist');
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
           <strong>MIDI Out for Looper: Electro-Harmonix 45000</strong>
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
                i: "push-record",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'RECORD',
              },
              {
                type: 0,
                i: "push-play",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'PLAY/STOP',
              },
                {
                type: 0,
                i: "push-new",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-warning',
                text: 'NEW LOOP',
              },
                {
                type: 0,
                i: "push-reverse",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'REVERSE',
              },
                {
                type: 0,
                i: "push-octave",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'OCTAVE',
              },
                {
                type: 0,
                i: "push-mixdown",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'MIX DOWN',
              },
                {
                type: 0,
                i: "push-punchin",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'PUNCH IN',
              },
              {
                type: 0,
                i: "mute-all",
                x: 2,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0,//Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'MUTE ALL',
              },
               {
                type: 1,
                i: "track-1-level",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,//Infinity,
                w: 2,
                h: 2,
                text: 'Track 1 Level',
              },
               {
                type: 1,
                i: "track-2-level",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,//Infinity,
                w: 2,
                h: 2,
                text: 'Track 2 Level',
              },
               {
                type: 1,
                i: "track-3-level",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,//Infinity,
                w: 2,
                h: 2,
                text: 'Track 3 Level',
              },
               {
                type: 1,
                i: "track-4-level",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,//Infinity,
                w: 2,
                h: 2,
                text: 'Track 4 Level',
              },
               {
                type: 1,
                i: "track-1-pan",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,//Infinity,
                w: 2,
                h: 2,
                text: 'Track 1 Pan',
              },
               {
                type: 1,
                i: "track-2-pan",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,//Infinity,
                w: 2,
                h: 2,
                text: 'Track 2 Pan',
              },
               {
                type: 1,
                i: "track-3-pan",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,//Infinity,
                w: 2,
                h: 2,
                text: 'Track 3 Pan',
              },
               {
                type: 1,
                i: "track-4-pan",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,//Infinity,
                w: 2,
                h: 2,
                text: 'Track 4 Pan',
              },
               {
                type: 1,
                i: "dry-out-level",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,//Infinity,
                w: 2,
                h: 2,
                text: 'Dry Level',
              },
               {
                type: 1,
                i: "dry-out-pan",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,//Infinity,
                w: 2,
                h: 2,
                text: 'Dry Pan',
              },
               {
                type: 1,
                i: "mix-down-level",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,//Infinity,
                w: 2,
                h: 2,
                text: 'Mixdown Level',
              },
                {
                type: 1,
                i: "tempo",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,//Infinity,
                w: 2,
                h: 2,
                text: 'Tempo',
              },
            
            ]
      });
}
}
MIDILooper.defaultProps = {
    className: "layout",
    rowHeight: 30,
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
};
