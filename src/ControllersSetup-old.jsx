import React from 'react';
import 'isomorphic-fetch';
import _ from 'lodash';
import { Link } from 'react-router';
import { Button, Glyphicon, Table, Panel } from 'react-bootstrap';
import Toast from './Toast.jsx';
import {Responsive, WidthProvider} from 'react-grid-layout';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class ControllerSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBreakpoint: 'lg',
      compactType: 'vertical',
      mounted: false,
      layouts: {lg: this.props.initialLayout},
    };
}
componentDidMount() {
    this.setState({mounted: true});
  }

  generateDOM() {
    return _.map(this.state.layouts.lg, function (l, i) {
      return (
        <div key={i} className={l.static ? 'static' : ''}>
          {l.static ?
            <span className="text" title="This item is static and cannot be removed or resized.">Static - {i}</span>
            : <span className="text">{i}</span>
          }
        </div>);
    });
  }

onBreakpointChange(breakpoint) {
    console.log('onBreakpointChange breakpoint' + breakpoint);
    this.setState({
      currentBreakpoint: breakpoint,
    });
  }

onCompactTypeChange() {
    const {compactType: oldCompactType} = this.state;
    const compactType = oldCompactType === 'horizontal' ? 'vertical' :
                        oldCompactType === 'vertical' ? null : 'horizontal';
    this.setState({compactType});
 }

 onLayoutChange(layout, layouts){
 //   this.props.onLayoutChange(layout, layouts);
//	this.onLayoutChange(layout,layouts); 
console.log(layout, layouts);
}

  onNewLayout() {
    this.setState({
      layouts: {lg: generateLayout()}
    });
  }
render() {


    return (
        <div><div>
	<div>
          Current Breakpoint: {this.state.currentBreakpoint} ({this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <div>Compaction type: {_.capitalize(this.state.compactType) || 'No Compaction'}</div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>Change Compaction Type</button>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
	  measureBeforeMount={false}
	  useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
         >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
	</div></div>

    );

  }


}

ControllerSetup.propTypes = {
//	onLayoutChange: React.PropTypes.func.isRequired,
	params: React.PropTypes.object.isRequired,
};

ControllerSetup.defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
    initialLayout: generateLayout()
};

function generateLayout() {
  return _.map(_.range(0, 25), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: _.random(0, 5) * 2 % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05
    };
  });
}

