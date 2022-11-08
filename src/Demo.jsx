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

export default class Demo extends React.Component {

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

handleButtons(event) {
  console.log(event.target.id + ': ' + event.target.value);

  switch (event.target.value) {
  case 'vid_red':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 #FF0000'});
    break;
  case 'vid_white':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 #FFFFFF'}); 
    break;
  case 'vid_green':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 #00FF00'});
    break;
  case 'vid_blue':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 #0000FF'});
    break;
  case 'vid_play1':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 aaa.mp4'});
    break;
  case 'vid_play2':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-1 bbb.mp4 10 LEFT'}); 
    break;
  case 'vid_play3':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 ccc.mp4 PUSH 20 EASEINSINE'});
    break;
  case 'vid_play4':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: '"PLAY 1-0 test_scroll SPEED 5 BLUR 50'});
    break;
  case 'vid_play5':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 ddd.mp4'});
    break;
  case 'vid_play6':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 MOVIE SEEK 100 LOOP'}); 
    break;
  case 'vid_play7':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 aaa.mp4'});
    break;
  case 'vid_play8':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 1-0 aaa.mp4'});
    break;
  case 'vid_loop1':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 aaa.mp4 LOOP'});
    break;
  case 'vid_loop2':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 aaa.mp4 LOOP'}); 
    break;
  case 'vid_loop3':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 aaa.mp4 LOOP'});
    break;
  case 'vid_loop4':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 1-0 aaa.mp4 LOOP'});
    break;
  case 'spot_on':
     socket.emit('dmx-go', {6: 216, 7:255 });
    break;
  case 'spot_off':
     socket.emit('dmx-go', {6: 0, 7:0});
    break;
  case 'spot_white':
     socket.emit('dmx-go', {5: 0, 6:216, 7:255});
    break;
  case 'spot_red':
     socket.emit('dmx-go', {5: 24, 6:216, 7:255});
    break;
  case 'spot_green':
     socket.emit('dmx-go', {5: 18, 6:216, 7:255});
    break;
  case 'spot_blue':
     socket.emit('dmx-go', {5: 42, 6:216, 7:255});
    break;
  case 'wash_on':
     socket.emit('dmx-go', {16:255 });
    break;
  case 'wash_off':
     socket.emit('dmx-go', {16: 0});
    break;
  case 'wash_white':
     socket.emit('dmx-go', {17: 0, 18:0, 19:0, 20:255});
    break;
  case 'wash_red':
     socket.emit('dmx-go', {17: 255, 18:0, 19:0, 20:0});
    break;
  case 'wash_green':
     socket.emit('dmx-go', {17: 0, 18:255, 19:0, 20:0});
    break;
  case 'wash_blue':
     socket.emit('dmx-go', {17: 0, 18:0, 19:255, 20:0});
    break;
    case 'wash_yellow':
     socket.emit('dmx-go', {17: 255, 18:255, 19:0, 20:0});
    break;
  case 'dmx_on':
    socket.emit('dmx-all', 255);
    break;
  case 'dmx_off': 
    socket.emit('dmx-all', 0);
    break;

  default:
    console.log('ERROR: Button does not exist');
  }
} 
handleSliders(event) {
  console.log(event.target.id + ': ' + event.target.value);
  let slider_value = (event.target.value / 100.0) * 255.0;
  switch (event.target.id) {
  case 'spot_pan':
      console.log("in spot_pan " + slider_value);
      socket.emit('dmx-go', {0: slider_value, 2: slider_value});
    break;
  case 'spot_tilt':
      console.log("in spot_tilt " + slider_value);
      socket.emit('dmx-go', {1: slider_value});
    break;
  case 'spot_intensity':
      socket.emit('dmx-go', {7: slider_value});
    break;
  case 'wash_intensity':
      socket.emit('dmx-go', {16: slider_value});
    break;
  case 'wash_pan':
      socket.emit('dmx-go', {22: slider_value});
    break;
  case 'wash_tilt':
      socket.emit('dmx-go', {23: slider_value});
    break;
  case 'wash_zoom':
      socket.emit('dmx-go', {27: slider_value});
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
      	  <Col xs={6} sm={3} md={2} lg={1}>
      	    <button onClick={this.handleOnLock}>{lockIcon}</button>
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
         items: [{
                type: 0,
                i: "spot_on",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 1,//Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Spot On',
              },
              {
                type: 0,
                i: "spot_off",
                x: 0,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2,//Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Spot Off',
              },
               {
                type: 1,
                i: "spot_intensity",
                x: 1,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 1,//Infinity,
                w: 2,
                h: 2,
                text: 'Spot Intensity',
              },
              {
                type: 1,
                i: "spot_tilt",
                x: 3,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 1, //Infinity,
                w: 2,
                h: 2,
                text: 'Spot Tilt',
              },
              {
                type: 1,
                i: "spot_pan",
                x: 5,//(this.state.items.length * 2) % (this.state.cols || 12),
                y: 1,//Infinity,
                w: 2,
                h: 2,
                text: 'Spot Pan',
              },
              {
                type: 0,
                i: "spot_white",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 3, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Spot White',
              },
              {
                type: 0,
                i: "spot_red",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 3, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Spot Red',
              },
              {
                type: 0,
                i: "spot_green",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 3, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Spot Green',
              },
              {
                type: 0,
                i: "spot_blue",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 3, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-primary',
                text: 'Spot Blue',
              },
              {
                x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 3, //Infinity, 
                w: 2,
                h: 1,
              },
              {
                type: 0,
                i: "dmx_on",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-primary',
                text: 'DMX ALL ON',
              },
              {
                type: 0,
                i: "dmx_off",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-primary',
                text: 'DMX ALL OFF',
              },
              {
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 5,
                h: 1,
              },
              {
                type: 0,
                i: "wash_on",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 4, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Wash On',
              },
              {
                type: 0,
                i: "wash_off",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 5, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Wash Off',
              },
               {
                type: 1,
                i: "wash_intensity",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 4, //Infinity,
                w: 2,
                h: 2,
                text: 'Wash Intensity',
              },
              {
                type: 1,
                i: "wash_pan",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 4, //Infinity,
                w: 2,
                h: 2,
                text: 'Wash Pan',
              },
              {
                type: 1,
                i: "wash_tilt",
                x: 5,// (this.state.items.length * 2) % (this.state.cols || 12),
                y: 4,// Infinity,
                w: 2,
                h: 2,
                text: 'Wash Tilt',
              },
               {
                type: 1,
                i: "wash_zoom",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 6, //Infinity,
                w: 2,
                h: 2,
                text: 'Wash Zoom',
              },
              {
                type: 0,
                i: "wash_white",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 6, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Wash White',
              },
              {
                type: 0,
                i: "wash_red",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 7, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Wash Red',
              },
              {
                type: 0,
                i: "wash_green",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 6, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Wash Green',
              },
              {
                type: 0,
                i: "wash_blue",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 7, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-primary',
                text: 'Wash Blue',
              },
              {
                type: 0,
                i: "wash_yellow",
                x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 6, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-warning',
                text: 'Wash Yellow',
              },
              {
                x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 6, //Infinity, 
                w: 2,
                h: 1,
              },
               {
                type: 0,
                i: "vid_play1",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 8, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Play1',
              },
               {
                type: 0,
                i: "vid_play2",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 9, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Play2',
              },
               {
                type: 0,
                i: "vid_play3",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 10, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Play3',
              },
               {
                type: 0,
                i: "vid_play4",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 11, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Play4',
              },
               {
                type: 0,
                i: "vid_play5",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 8, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Play5',
              },
               {
                type: 0,
                i: "vid_play6",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 9, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Play6',
              },
               {
                type: 0,
                i: "vid_play7",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 10, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Play7',
              },
               {
                type: 0,
                i: "vid_play8",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 11, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Play8',
              },
               {
                type: 0,
                i: "vid_loop1",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 8, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop1',
              },
               {
                type: 0,
                i: "vid_loop2",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 9, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop2',
              },
               {
                type: 0,
                i: "vid_loop3",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 10, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop3',
              },
               {
                type: 0,
                i: "vid_loop4",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 11, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop4',
              },
               {
                type: 0,
                i: "vid_white",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 8, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Vid White',
              },
              {
                type: 0,
                i: "vid_red",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 9, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Vid Red',
              },
              {
                type: 0,
                i: "vid_green",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 10, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Vid Green',
              },
              {
                type: 0,
                i: "vid_blue",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 11, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-primary',
                text: 'Vid Blue',
              },
            ]
      });
}
}
Demo.defaultProps = {
    className: "layout",
    rowHeight: 30,
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
};
