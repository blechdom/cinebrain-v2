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

export default class AudioGroup2 extends React.Component {

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
      audio_volume: '0.0',
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
  case 'audio1':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-1 group2_audio1.wav'});
    break;
  case 'audio2':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-1 group2_audio2.wav'}); 
    break;
  case 'audio3':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-1 group2_audio3.wav'});
    break;
  case 'audio4':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-1 group2_audio4.wav'});
    break;
  case 'audio5':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-1 group2_audio5.wav'});
    break;
  case 'audio6':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-1 group2_audio6.wav'}); 
    break;
  case 'audio7':
      socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-1 group2_audio7.wav'});
    break;
  case 'audio8':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'PLAY 2-1 group2_audio8.wav'});
    break;
  case 'audio_stop':
     socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: 'STOP 2-1'});
    break;
  default:
    console.log('ERROR: Button does not exist');
  }
} 
handleSliders(event) {
  console.log(event.target.id + ': ' + event.target.value);
  let slider_value = event.target.value/100.0;
  switch (event.target.id) {
     case 'audio_volume':
      this.state.audio_volume = slider_value;
       socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-1 VOLUME " + this.state.audio_volume});
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
           <strong>Group 2: AUDIO</strong>
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
    socket.emit('control-interface-send-telnet', { host: this.state.host, port: this.state.port, command: "MIXER 2-0 VOLUME 0"});
   
    this.setState({
         items: [
              {
                type: 0,
                i: "audio1",
                x: 0,
                y: 2, 
                w: 2,
                h: 1,
                className: 'btn-block btn',
                text: 'Audio 1',
              },
               {
                type: 0,
                i: "audio2",
                x: 0,
                y: 3, 
                w: 2,
                h: 1,
                className: 'btn-block btn',
                text: 'Audio 2',
              },
               {
                type: 0,
                i: "audio3",
                x: 0,
                y: 4, 
                w: 2,
                h: 1,
                className: 'btn-block btn',
                text: 'Audio 3',
              },
               {
                type: 0,
                i: "audio4",
                x: 0,
                y: 5, 
                w: 2,
                h: 1,
                className: 'btn-block btn',
                text: 'Audio 4',
              },
              {
                type: 0,
                i: "audio5",
                x: 2,
                y: 2, 
                w: 2,
                h: 1,
                className: 'btn-block btn',
                text: 'Audio 5',
              },
               {
                type: 0,
                i: "audio6",
                x: 2,
                y: 3, 
                w: 2,
                h: 1,
                className: 'btn-block btn',
                text: 'Audio 6',
              },
               {
                type: 0,
                i: "audio7",
                x: 2,
                y: 4, 
                w: 2,
                h: 1,
                className: 'btn-block btn',
                text: 'Audio 7',
              },
               {
                type: 0,
                i: "audio8",
                x: 2,
                y: 5, 
                w: 2,
                h: 1,
                className: 'btn-block btn',
                text: 'Audio 8',
              },
               {
                type: 0,
                i: "audio_stop",
                x: 0,
                y: 0, 
                w: 2,
                h: 2,
                className: 'btn-block btn btn-danger',
                text: 'Audio Stop',
              },
              {
                type: 1,
                i: "audio_volume",
                x: 2,
                y: 0,
                w: 2,
                h: 2,
                text: 'Audio Volume',
              },
            ]
      });
}
}
AudioGroup2.defaultProps = {
    className: "layout",
    rowHeight: 30,
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
};
