import React from "react";
import {Dropdown as BootstrapDropdown} from "react-bootstrap";

const DropdownItem = ({children, className, ...props}) => {
    return (
        <BootstrapDropdown.Item
            {...props}
            as={(props) => <li {...props}>{props.children}</li>}
        >
            {children}
        </BootstrapDropdown.Item>
    )
};

export default DropdownItem;
