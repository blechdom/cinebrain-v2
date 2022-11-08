import React from 'react';
import Nipple from 'nipplejs';

export default class Joystick extends React.Component {

  
  constructor(props, context){
    super(props, context);
    this.state = {
     
  };
 
  
}
componentDidMount() {
    
     let manager = Nipple.create({
    zone: this.refs.zone_joystick,                  // active zone
    });
     console.log(manager);
  }

  render() {
  return (
      <div ref="zone_joystick" id="zone_joystick">goober doober</div>
    )
  }  

}
