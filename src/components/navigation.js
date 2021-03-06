import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import Avatar from 'react-avatar';
import { ToastContainer } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import 'react-toastify/dist/ReactToastify.css';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.toggleOnClick = this.toggleOnClick.bind(this);
    this.isOpen = this.isOpen.bind(this);

    this.state = {};
  }

  componentDidMount() {
    this.setState({
      collapsed: true
    })
  }

  isOpen() {
    return this.state.collapsed;
  }

  toggleOnClick() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  showUserInformation() {
    return (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink href="/accounts">Accounts</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">Buckets</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">Settings</NavLink>
        </NavItem>
      </Nav>
    )
  }

  render() {
    return (
      <div>
        <ReactTooltip />
        <Navbar color="light" light expand="md" className="mb-3">
          <NavbarBrand href="/">
            <img alt="Plutus Logo" style={{ height: "25px" }} className="plutus-logo-svg" src="/logo.svg"/>
            <span className="plutus-logo-text">
              Plutus
            </span>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleOnClick} />
          <Collapse isOpen={false} navbar>
            {this.showUserInformation()}
          </Collapse>
        </Navbar>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(Navigation);
