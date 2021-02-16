import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import NavProfile from './NavProfile';

const HeaderNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar className="sticky-top" color="dark" dark expand="md">
        <div className="container">
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
                <NavItem>
                    <NavLink 
                    tag={RRNavLink} 
                    exact 
                    to="/" 
                    activeClassName="active"
                    >Find Player</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink 
                     tag={RRNavLink} 
                     to="/match" 
                     activeClassName="active"
                    >Player Information</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink 
                     tag={RRNavLink} 
                     to="/details" 
                     activeClassName="active"
                    >Match Details</NavLink>
                </NavItem>
            </Nav>
            </Collapse>
            <NavProfile></NavProfile>
        </div>
    </Navbar>
  );
}

export default HeaderNavbar;