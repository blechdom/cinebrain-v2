import React, {PropTypes} from 'react'
import {Responsive, WidthProvider} from 'react-grid-layout';
import lomap from 'lodash.map'
import loresult from 'lodash.result'
import lorange from 'lodash.range'
import lorandom from 'lodash.random'
import 'isomorphic-fetch';
import { Link } from 'react-router';
import { Button, Glyphicon, Table, Panel } from 'react-bootstrap';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function generateLayout() {
  return lomap( lorange(0, 25), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: lorandom(0, 5) * 2 % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: false,
      sliderValue: 50
    };
  });
}

export default class ControllerSetup extends React.Component {

  constructor(props, context){
    super(props, context);
   this.state = {
      currentBreakpoint: 'lg',
      compactType: 'vertical',
      mounted: false,
      layouts: {lg: this.props.initialLayout},
    };
 this.onNewLayout = this.onNewLayout.bind(this);  
}
 handleSliderChange (event)  {

   // this.setState({sliderValue: event.target.value});
   // console.log(event.target.id + ': ' + this.state.i + ' ' + this.state.sliderValue);
  }
  componentDidMount() {
    this.setState({
      mounted: true
    })
  }

  generateDOM() {

    const styles = {
      background: "#eee"
    }

return lomap(this.state.layouts.lg, (l, i) => {
      return (
      
<div style={styles} key={i} className={l.static ? 'static': ''}>
          {
            l.static ? 
              <span className="text" title="This item is static and can't be removed or resized">
                static - {i}
              </span> :
              <span className="text">{i}</span> 
          }
<div id="slidecontainer">
                <input type="range" min="1" max="100" value={this.state.sliderValue} className="slider" id={i} ref={i} onChange={this.handleSliderChange}/>
</div>
        </div>
      )
    })
  }

  onBreakPointChange(breakpoint) {
    this.setState({
      currentBreakPoint: breakpoint
    })
  }

  onLayoutChange(layout, layouts) {
  console.log(layout, layouts);
  }

  onNewLayout() {
    this.setState({
      layouts: {
        lg: generateLayout()
      }
    })
  }

  render() {
  return (
      <div>
        <div>Current Breakpoint: {this.state.currentBreakpoint} ({this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <button onClick={this.onNewLayout}>Randomize Layout</button>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
    measureBeforeMount={false}
        useCSSTransforms={this.state.mounted}>
            {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    )
  }
}
ControllerSetup.defaultProps = {
    className: "layout",
    isResizable: true,
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
    initialLayout: generateLayout()
}; 