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

export default class VideoGroup2 extends React.Component {

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
      left_edge: '0.0',
      top_edge: '0.0',
      x_scale: '1.0',
      y_scale: '1.0',
      left_crop: '0.0',
      top_crop: '0.0',
      right_crop: '0.0',
      bottom_crop: '0.0',
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
  socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'MIXER 2-0 VOLUME 0.0'});
  switch (event.target.value) {
  case 'vid_red':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 2-0 #FF0000'});
    break;
  case 'vid_white':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 2-0 #FFFFFF'}); 
    break;
  case 'vid_green':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 2-0 #00FF00'});
    break;
  case 'vid_blue':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 2-0 #0000FF'});
    break;
  case 'loop1':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_loop1.mov LOOP'});
    break;
  case 'loop2':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_loop2.mov LOOP'}); 
    break;
  case 'loop3':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 2-0 group2_loop3.mov LOOP'});
    break;
  case 'loop4':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_loop4.mov LOOP'});
    break;
  case 'loop5':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_loop5.mov LOOP'});
    break;
  case 'loop6':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_loop6.mov LOOP'}); 
    break;
  case 'loop7':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_loop7.mov LOOP'});
    break;
  case 'loop8':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_loop8.mov LOOP'});
    break;
  case 'still1':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_still1.png'});
    break;
  case 'still2':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_still2.png'}); 
    break;
  case 'still3':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_still3.png'});
    break;
  case 'still4':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_still4.png'});
    break;
   case 'still5 ':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_still5.png'});
    break;
  case 'still6':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_still6.png'}); 
    break;
  case 'still7':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_still7.png'});
    break;
  case 'still8':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-0 group2_still8.png'});
    break;
  case 'vid_stop':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'STOP 2-0'});
    break;
  default:
    console.log('ERROR: Button does not exist');
  }
} 
handleSliders(event) {
  console.log(event.target.id + ': ' + event.target.value);
  let slider_value = event.target.value/100.0;
  switch (event.target.id) {
  case 'left_edge':
      this.state.left_edge = slider_value;
       socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale});
    break;
  case 'top_edge':
      this.state.top_edge = slider_value;
       socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale});
    break;
  case 'x_scale':
      this.state.x_scale = slider_value*2.0;
       socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale});
    break;
  case 'y_scale':
      this.state.y_scale = slider_value*2.0;
       socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale});
    break;
  case 'proportional_scale':
      this.state.y_scale = slider_value*2.0;
      this.state.x_scale = slider_value*2.0;
       socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 FILL " + this.state.left_edge + " " + this.state.top_edge + " " + this.state.x_scale + " " + this.state.y_scale});
    break;
    case 'left_crop':
      this.state.left_crop = slider_value;
       socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 CROP " + this.state.left_crop + " " + this.state.top_crop + " " + this.state.right_crop + " " + this.state.bottom_crop});
    break;
    case 'top_crop':
      this.state.top_crop = slider_value;
       socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 CROP " + this.state.left_crop + " " + this.state.top_crop + " " + this.state.right_crop + " " + this.state.bottom_crop});
    break;
    case 'right_crop':
      this.state.right_crop = slider_value;
       socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 CROP " + this.state.left_crop + " " + this.state.top_crop + " " + this.state.right_crop + " " + this.state.bottom_crop});
    break;
    case 'bottom_crop':
      this.state.bottom_crop = slider_value;
       socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 CROP " + this.state.left_crop + " " + this.state.top_crop + " " + this.state.right_crop + " " + this.state.bottom_crop});
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
           <strong>Group 2: VIDEO</strong>
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
         items: [
               {
                type: 0,
                i: "loop1",
                x: 1, 
                y: 0, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop 1',
              },
               {
                type: 0,
                i: "loop2",
                x: 1,
                y: 1, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop 2',
              },
               {
                type: 0,
                i: "loop3",
                x: 1,
                y: 2, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop 3',
              },
               {
                type: 0,
                i: "loop4",
                x: 1,
                y: 3, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop 4'
              },
               {
                type: 0,
                i: "loop5",
                x: 2,
                y: 0, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop 5',
              },
               {
                type: 0,
                i: "loop6",
                x: 2,
                y: 1, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop 6',
              },
               {
                type: 0,
                i: "loop7",
                x: 2,
                y: 2, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop 7',
              },
               {
                type: 0,
                i: "loop8",
                x: 2,
                y: 3, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop 8',
              },
               {
                type: 0,
                i: "still1",
                x: 3,
                y: 0, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Still 1',
              },
               {
                type: 0,
                i: "still2",
                x: 3,
                y: 1, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Still 2',
              },
               {
                type: 0,
                i: "still3",
                x: 3,
                y: 2, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Still 3',
              },
               {
                type: 0,
                i: "still4",
                x: 3,
                y: 3, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Still 4',
              },
               {
                type: 0,
                i: "still5",
                x: 4,
                y: 0, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Still 5',
              },
               {
                type: 0,
                i: "still6",
                x: 4,
                y: 1, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Still 6',
              },
               {
                type: 0,
                i: "still7",
                x: 4,
                y: 2, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Still 7',
              },
               {
                type: 0,
                i: "still8",
                x: 4,
                y: 3, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Still 8',
              },
               {
                type: 0,
                i: "vid_white",
                x: 5,
                y: 0, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Vid White',
              },
              {
                type: 0,
                i: "vid_red",
                x: 5,
                y: 1, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Vid Red',
              },
              {
                type: 0,
                i: "vid_green",
                x: 5,
                y: 2, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Vid Green',
              },
              {
                type: 0,
                i: "vid_blue",
                x: 5,
                y: 3, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-primary',
                text: 'Vid Blue',
              },
              {
                type: 0,
                i: "vid_stop",
                x: 0,
                y: 0, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-primary',
                text: 'Vid Stop',
              },
              {
                type: 1,
                i: "left_edge",
                x: 0,
                y: 9,
                w: 2,
                h: 2,
                text: 'Left Edge',
              },
               {
                type: 1,
                i: "top_edge",
                x: 2,
                y: 9,
                w: 2,
                h: 2,
                text: 'Top Edge',
              },
               {
                type: 1,
                i: "x_scale",
                x: 0,
                y: 7,
                w: 2,
                h: 2,
                text: 'X Scale',
              },
               {
                type: 1,
                i: "y_scale",
                x: 2,
                y: 7,
                w: 2,
                h: 2,
                text: 'Y Scale',
              },
              {
                type: 1,
                i: "proportional_scale",
                x: 0,
                y: 5,
                w: 4,
                h: 2,
                text: 'Proportional Scale',
              },
              {
                type: 1,
                i: "left_crop",
                x: 0,
                y: 11,
                w: 2,
                h: 2,
                text: 'Left Crop',
              },
              {
                type: 1,
                i: "top_crop",
                x: 2,
                y: 11,
                w: 2,
                h: 2,
                text: 'Top Crop',
              },
              {
                type: 1,
                i: "right_crop",
                x: 0,
                y: 13,
                w: 2,
                h: 2,
                text: 'Right Crop',
              },
              {
                type: 1,
                i: "bottom_crop",
                x: 2,
                y: 13,
                w: 2,
                h: 2,
                text: 'Bottom Crop',
              },
            ]
      });
}
}
VideoGroup2.defaultProps = {
    className: "layout",
    rowHeight: 30,
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
};
