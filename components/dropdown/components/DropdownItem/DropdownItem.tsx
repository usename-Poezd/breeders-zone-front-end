import * as React from "react";
import {FC} from "react";
import {Dropdown as BootstrapDropdown} from "react-bootstrap";

const DropdownItem: FC<any> = ({children, ...props}) => {
    return (
        <BootstrapDropdown.Item
            {...props}
            as={(props) => <li {...props}>{props.children}</li>}
        >
            {children}
        </BootstrapDropdown.Item>
    )
};

export {
    DropdownItem
};
