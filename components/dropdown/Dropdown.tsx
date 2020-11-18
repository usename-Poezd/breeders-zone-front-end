import * as React from "react";
import {FC} from "react";
import {Dropdown as BootstrapDropdown} from "react-bootstrap";

const CustomDropdownToggle = React.forwardRef<any>(({children, onClick, variant}: any, ref) => {
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

const CustomDropdownMenu = React.forwardRef<any>(({children, className, style, labeledBy}: any, ref) => (
    <ul
        ref={ref}
        style={{
            ...style,
            right: 0,
            transform: "translate(-50%, 28px)"
        }}
        className={"dropdown-list " + (className === 'dropdown-menu show' ? '' : 'hidden')}
        aria-labelledby={labeledBy}
    >
        {children}
    </ul>
));

const Dropdown: FC<any> = (props) => {
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

export {
    Dropdown
};
