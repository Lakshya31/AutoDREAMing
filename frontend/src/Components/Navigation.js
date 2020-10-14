import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';

export default class Navigation extends Component {
    render() {
        return (
            <div style={{borderBottom:"1px solid black"}}>
                <Navbar className="Nav" variant="dark">
                    <Navbar.Brand>AutoDREAMing</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link onClick={() => { window.location.reload(false); }}>Home</Nav.Link>
                    </Nav>
                </Navbar>
            </div>
        )
    }
}
