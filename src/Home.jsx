import React from 'react';
import 'isomorphic-fetch';
import { Link } from 'react-router';
import { Button, Glyphicon, Table, Panel } from 'react-bootstrap';

export default class Help extends React.Component {
 render() {
  return (
  	<div><center>
  <div><h1><a href="dmx_group1">GROUP 1</a></h1></div>
  <div><h1><a href="dmx_group2">GROUP 2</a></h1></div>
  <div><h1><a href="dmx_group3">Extras</a></h1></div>
  </center>
  </div>
	);
};
}
