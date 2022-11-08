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

export default class MediaGroup3 extends React.Component {

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
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 3-0 #FF0000'});
    break;
  case 'vid_white':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 3-0 #FFFFFF'}); 
    break;
  case 'vid_green':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 3-0 #00FF00'});
    break;
  case 'vid_blue':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 3-0 #0000FF'});
    break;
  case 'vid_play1':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 CaliforniaTimelapse.mov'});
    break;
  case 'vid_play2':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 beach.mp4'}); 
    break;
  case 'vid_play3':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'play 3-0 psych1.mov'});
    break;
  case 'vid_play4':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 nyc.mp4'});
    break;
  case 'vid_loop1':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 fire.mov LOOP'});
    break;
  case 'vid_loop2':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 tunnel.mov LOOP'}); 
    break;
  case 'vid_loop3':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 blueTileFloor.mov LOOP'});
    break;
  case 'vid_loop4':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 16189_2.mov LOOP'});
    break;
  case 'still_image1':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 bigRock.jpg'});
    break;
  case 'still_image2':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 circuit.jpg'}); 
    break;
  case 'still_image3':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 mime.jpg'});
    break;
  case 'still_image4':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 WhiteHouse.jpg'});
    break;
   case 'foreground1':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 cactus.png'});
    break;
  case 'foreground2':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 barbedwire.jpg'}); 
    break;
  case 'foreground3':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 tv.png'});
    break;
  case 'foreground4':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 3-0 window.png'});
    break;
  case 'vid_stop':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'STOP 3-0'});
    break;
  
  default:
    console.log('ERROR: Button does not exist');
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
           <strong>Group 3: MEDIA</strong>
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
                i: "vid_play1",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Play1',
              },
               {
                type: 0,
                i: "vid_play2",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 1, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Play2',
              },
               {
                type: 0,
                i: "vid_play3",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Play3',
              },
               {
                type: 0,
                i: "vid_play4",
                x: 1, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 3, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Play4',
              },
               {
                type: 0,
                i: "vid_loop1",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop1',
              },
               {
                type: 0,
                i: "vid_loop2",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 1, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop2',
              },
               {
                type: 0,
                i: "vid_loop3",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop3',
              },
               {
                type: 0,
                i: "vid_loop4",
                x: 2, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 3, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Vid Loop4',
              },
               {
                type: 0,
                i: "still_image1",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Still Image1',
              },
               {
                type: 0,
                i: "still_image2",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 1, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Still Image2',
              },
               {
                type: 0,
                i: "still_image3",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Still Image3',
              },
               {
                type: 0,
                i: "still_image4",
                x: 3, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 3, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Still Image4',
              },
               {
                type: 0,
                i: "foreground1",
                x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Foreground1',
              },
               {
                type: 0,
                i: "foreground2",
                x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 1, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Foreground2',
              },
               {
                type: 0,
                i: "foreground3",
                x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Foreground3',
              },
               {
                type: 0,
                i: "foreground4",
                x: 4, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 3, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn',
                text: 'Foreground4',
              },
               {
                type: 0,
                i: "vid_white",
                x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-default',
                text: 'Vid White',
              },
              {
                type: 0,
                i: "vid_red",
                x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 1, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Vid Red',
              },
              {
                type: 0,
                i: "vid_green",
                x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 2, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Vid Green',
              },
              {
                type: 0,
                i: "vid_blue",
                x: 5, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 3, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-primary',
                text: 'Vid Blue',
              },
              {
                type: 0,
                i: "vid_stop",
                x: 0, //(this.state.items.length * 2) % (this.state.cols || 12),
                y: 0, //Infinity, 
                w: 1,
                h: 1,
                className: 'btn-block btn btn-primary',
                text: 'Vid Stop',
              },
            ]
      });
}
}
MediaGroup3.defaultProps = {
    className: "layout",
    rowHeight: 30,
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
};
