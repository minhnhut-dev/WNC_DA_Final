import React from "react";

import { NavItem, NavLink, Nav } from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";

const SideBar = ({toggle }) => (
    <div className="sidebar is-open">
      <div className="sidebar-header">
      <span color="info" onClick={toggle} style={{ color: "#fff" }}>
        &times;
      </span>
        <h3>Bootstrap Sidebar</h3>
      </div>
    </div>
);



export default SideBar;
