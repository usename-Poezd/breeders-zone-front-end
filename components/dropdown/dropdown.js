import React, {useState} from "react";
import {Dropdown as BootstrapDropdown} from "react-bootstrap";

const CustomDropdownToggle = React.forwardRef(({children, onClick, variant}, ref) => {
    return (
        <div
            className="dropdown-actived"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            <span className={"dropdown-actived-span" + (variant === 'white' ? ' text-white' : '')}>
                {children}
            </span>
            <img src={`/images/arrow-${variant}.svg`} className="arrow img-fluid" alt="arrow"/>
        </div>
    )
});
const CustomDropdownMenu = React.forwardRef(({children, className, style, labeledBy}, ref) => (
    <ul
        ref={ref}
        style={{
            ...style,
            right: 0
        }}
        className={"dropdown-list " + (className === 'dropdown-menu show' ? '' : 'hidden')}
        aria-labelledby={labeledBy}
    >
        {children}
    </ul>
));

const Dropdown = (props) => {
    const {label, variant = 'black', children} = props;

    return (
        <React.Fragment>
            <BootstrapDropdown>
                <BootstrapDropdown.Toggle variant={variant} as={CustomDropdownToggle}>{label}</BootstrapDropdown.Toggle>
                <BootstrapDropdown.Menu as={CustomDropdownMenu}>
                    {children}
                </BootstrapDropdown.Menu>

            </BootstrapDropdown>
        </React.Fragment>
    )
};

export default Dropdown;
