import 'babel-polyfill';
import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import MdMoreVert from 'react-icons/lib/md/more-vert';

const Header = () => (
  <Navbar fluid>
    <Navbar.Header>
      <Navbar.Brand><a href="/">Cinebrain</a></Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavDropdown id="user-dropdown" title="Group 1">
        <LinkContainer to="/dmx_spot_group1">
          <NavItem>Spot Light</NavItem>
        </LinkContainer>
        <LinkContainer to="/dmx_255_group2">
          <NavItem>Spot Light 255</NavItem>
      </LinkContainer>
        <LinkContainer to="/ptz_group1">
          <NavItem>Camera</NavItem>
        </LinkContainer>
        <LinkContainer to="/video_group1">
          <MenuItem>Video</MenuItem>
        </LinkContainer>
        <LinkContainer to="/audio_group1">
          <MenuItem>Audio</MenuItem>
        </LinkContainer>
	    </NavDropdown>
      <NavDropdown id="user-dropdown" title="Group 2">
       <LinkContainer to="/dmx_155_group2">
        <NavItem>Spot Light 155</NavItem>
      </LinkContainer>
      <LinkContainer to="/dmx_wash_group1">
          <NavItem>Wash Light</NavItem>
        </LinkContainer>
       <LinkContainer to="/ptz_group2">
        <NavItem>Camera</NavItem>
      </LinkContainer>
       <LinkContainer to="/video_group2">
          <MenuItem>Video</MenuItem>
        </LinkContainer>
        <LinkContainer to="/audio_group2">
          <MenuItem>Audio</MenuItem>
        </LinkContainer>
      </NavDropdown>
    </Nav>
    <Nav pullRight>
      <NavDropdown id="user-dropdown" title={<MdMoreVert size={18} />} noCaret>
       <LinkContainer to="/diagnostics">
        <MenuItem>Diagnostics</MenuItem>
      </LinkContainer>
      <LinkContainer to="/control_interface">
        <MenuItem>Control Interface</MenuItem>
      </LinkContainer>
       <LinkContainer to="/new_controllers">
        <MenuItem>New Controllers</MenuItem>
      </LinkContainer>
      <LinkContainer to="/devices">
        <MenuItem>Devices</MenuItem>
      </LinkContainer>
      <LinkContainer to="/issues">
        <MenuItem>Issues</MenuItem>
      </LinkContainer>
       <LinkContainer to="/issue_add_item">
        <MenuItem>Add Issue</MenuItem>
      </LinkContainer>
      <LinkContainer to="/midi_looper">
          <NavItem>MIDI Looper</NavItem>
        </LinkContainer>
		    <LinkContainer to="/help">
			 <MenuItem>Help</MenuItem>
      	</LinkContainer>
	</NavDropdown>
    </Nav>
  </Navbar>
);

const App = (props) => (
  <div>
    <Header />
    <div className="container-fluid">
      {props.children}
      <hr />
    </div>
  </div>
);

App.propTypes = {
  children: React.PropTypes.object.isRequired,
};

export default App;
