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

export default class DMXGroup3 extends React.Component {

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
          sliderValue: '0',
        };
      }),
      lock: true,
      compactType: null,
      spotIntensity: '127',
      spotPan: '0',
      spotFinePan: '127',
      spotTilt: '0',
      spotFineTilt: '127',
      spotSpeed: '215',
      presets: [].map(function(i, key, list) {
        return {
          i: i.toString(),
          spotIntensity: '127',
          spotPan: '0',
          spotFinePan: '127',
          spotTilt: '0',
          spotFineTilt: '127',
          spotSpeed: '215',
          add: i === (list.length - 1).toString(),
        };
      }),
  };
  this.onBreakpointChange = this.onBreakpointChange.bind(this);
  this.handleOnLock = this.handleOnLock.bind(this);
  this.handleButtons = this.handleButtons.bind(this);
  this.handleSliders = this.handleSliders.bind(this);
  this.savePreset = this.savePreset.bind(this);
  this.loadPreset = this.loadPreset.bind(this);
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
                <input type="range" min="0" max="255" step="1" value={el.sliderValue} id={i} className="slider" onChange={this.handleSliders}/></div>
        </div>;
    }
     return (
        <div key={i} data-grid={el} style={gridStyle}>
            {controllerCode}
            <span style={lockStyle}></span>
        </div>
      );
     console.log("does this change? " + el.i + " " + el.sliderValue);
}
handleButtons(event) {
  console.log(event.target.id + ': ' + event.target.value);

  switch (event.target.value) {
  
  case 'spot_on':
     socket.emit('dmx-go', {89: 255, 90:216, 95: 0, 84: 215 });
    break;
  case 'spot_off':
    this.setState({spotIntensity:0});
     socket.emit('dmx-go', {89: 0, 90:0});
    break;
  case 'save_preset_1':
     this.savePreset(1);
    break;
  case 'save_preset_3':
     this.savePreset(3);
    break;
     case 'save_preset_4':
     this.savePreset(4);
    break;
  case 'save_preset_5':
     this.savePreset(5);
    break;
     case 'save_preset_6':
     this.savePreset(6);
    break;
  case 'save_preset_2':
     this.savePreset(2);
    break;
  case 'recall_preset_1':
     this.loadPreset(1);
    break;
  case 'recall_preset_2':
     this.loadPreset(2);
    break;
    case 'recall_preset_3':
     this.loadPreset(3);
    break;
  case 'recall_preset_4':
     this.loadPreset(4);
    break;
    case 'recall_preset_5':
     this.loadPreset(5);
    break;
  case 'recall_preset_6':
     this.loadPreset(6);
    break;
  default:
    console.log('ERROR: Button does not exist');
  }
} 
handleSliders(event) {
  console.log(event.target.id + ': ' + event.target.value);
  let slider_value = event.target.value;


  let items= this.state.items;
  for(let i=0; i<items.length; i++){
    if(items[i].i==event.target.id){
      items[i].sliderValue=slider_value;
    }
  }
  this.setState({items});
  switch (event.target.id) {
  case 'spot_pan':
      this.setState({spotPan:slider_value});
      socket.emit('dmx-go', {80: slider_value});
      break;
  case 'spot_tilt':
      this.setState({spotTilt:slider_value});
      socket.emit('dmx-go', {82: slider_value});
      break;
  case 'spot_fine_pan':
      this.setState({spotFinePan:slider_value});
      socket.emit('dmx-go', {81: slider_value});
      break;
  case 'spot_fine_tilt':
      this.setState({spotFineTilt:slider_value});
      socket.emit('dmx-go', {83: slider_value});
      break;
  case 'spot_speed':
      this.setState({spotSpeed:slider_value});
      socket.emit('dmx-go', {84: slider_value});
      break;
  case 'spot_intensity':
      this.setState({spotIntensity:slider_value});
      socket.emit('dmx-go', {89: slider_value});
      break;

  default:
    console.log('ERROR: Slider does not exist');
  }
}
savePreset(preset){
  let presets = this.state.presets;
  console.log("save preset " + preset + ": " + presets[preset]);
      presets[preset].spotIntensity=this.state.spotIntensity;
      presets[preset].spotPan=this.state.spotPan;
      presets[preset].spotTilt=this.state.spotTilt;
      presets[preset].spotFinePan=this.state.spotFinePan;
      presets[preset].spotFineTilt=this.state.spotFineTilt;
      presets[preset].spotSpeed=this.state.spotSpeed;
    this.setState({presets});
}
loadPreset(preset){
  let items= this.state.items;
  let presets=this.state.presets;
  for(let i=0; i<items.length; i++){
    if(items[i].i=="spot_pan"){
      items[i].sliderValue=presets[preset].spotPan;
      socket.emit('dmx-go', {80: presets[preset].spotPan});
    }
    if(items[i].i=="spot_tilt"){
      items[i].sliderValue=presets[preset].spotTilt;
      socket.emit('dmx-go', {82: presets[preset].spotTilt});
    }
    if(items[i].i=="spot_fine_pan"){
      items[i].sliderValue=presets[preset].spotFinePan;
      socket.emit('dmx-go', {81: presets[preset].spotFinePan});
    }
    if(items[i].i=="spot_fine_tilt"){
      items[i].sliderValue=presets[preset].spotFineTilt;
      socket.emit('dmx-go', {83: presets[preset].spotFineTilt});
    }
     if(items[i].i=="spot_speed"){
      items[i].sliderValue=presets[preset].spotSpeed;
      socket.emit('dmx-go', {84: presets[preset].spotSpeed});
    }
    if(items[i].i=="spot_intensity"){
      items[i].sliderValue=presets[preset].spotIntensity;
      socket.emit('dmx-go', {89: presets[preset].spotIntensity});
    }
  }
  this.setState({items});
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
           <strong>Group 3: LIGHT</strong> DMX: 81
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
      this.setState({
         items: [
              {
                type: 0,
                i: "spot_on",
                x: 0,
                y: 0,
                w: 2,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Spot On',
              },
              {
                type: 0,
                i: "spot_off",
                x: 2,
                y: 0,
                w: 2,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Spot Off',
              },
               {
                type: 1,
                i: "spot_intensity",
                x: 0,
                y: 2,
                w: 12,
                h: 2,
                text: 'Spot Intensity',
                
              },
              {
                type: 1,
                i: "spot_tilt",
                x: 0,
                y: 8,
                w: 12,
                h: 2,
                text: 'Spot Tilt',
              },
              {
                type: 1,
                i: "spot_pan",
                x: 0,
                y: 4,
                w: 12,
                h: 2,
                text: 'Spot Pan',
              },
              {
                type: 1,
                i: "spot_speed",
                x: 0,
                y: 12,
                w: 12,
                h: 2,
                text: 'Spot Speed',
              },
              {
                type: 1,
                i: "spot_fine_tilt",
                x: 0,
                y: 10, 
                w: 12,
                h: 2,
                text: 'Spot Fine Tilt',
              },
              {
                type: 1,
                i: "spot_fine_pan",
                x: 0,
                y: 6,
                w: 12,
                h: 2,
                text: 'Spot Fine Pan',
              },
              {
                type: 0,
                i: "recall_preset_1",
                x: 0,
                y: 14,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Preset 1',
              },
              {
                type: 0,
                i: "recall_preset_2",
                x: 1,
                y: 14,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Preset 2',
              },
              {
                type: 0,
                i: "recall_preset_3",
                x: 2,
                y: 14,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Preset 3',
              },
              {
                type: 0,
                i: "recall_preset_4",
                x: 3,
                y: 14,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Preset 4',
              },
              {
                type: 0,
                i: "recall_preset_5",
                x: 4,
                y: 14,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Preset 5',
              },
              {
                type: 0,
                i: "recall_preset_6",
                x: 5,
                y: 14,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-success',
                text: 'Preset 6',
              },
              {
                type: 0,
                i: "save_preset_1",
                x: 0,
                y: 15,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Save Preset 1',
              },
              {
                type: 0,
                i: "save_preset_2",
                x: 1,
                y: 15,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Save Preset 2',
              },
               {
                type: 0,
                i: "save_preset_3",
                x: 2,
                y: 15,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Save Preset 3',
              },
              {
                type: 0,
                i: "save_preset_4",
                x: 3,
                y: 15,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Save Preset 4',
              },
               {
                type: 0,
                i: "save_preset_5",
                x: 4,
                y: 15,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Save Preset 5',
              },
              {
                type: 0,
                i: "save_preset_6",
                x: 5,
                y: 15,
                w: 1,
                h: 1,
                className: 'btn-block btn btn-danger',
                text: 'Save Preset 6',
              },
            ],
            presets:[
            {
              spotIntensity: '127',
              spotPan: '0',
              spotFinePan: '127',
              spotTilt: '0',
              spotFineTilt: '127',
              spotSpeed: '215',
            }
            ,{},{},{},{},{},{}],
      });
  }
}
DMXGroup3.defaultProps = {
    className: "layout",
    rowHeight: 30,
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
};
