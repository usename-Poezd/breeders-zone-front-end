import React, {FC} from "react";
import ReactSelect, { components } from "react-select";
import AsyncSelect from 'react-select/async';

const DropdownIndicator = props => {
    return (
        <components.DropdownIndicator {...props}>
            <img className="m-0 select-arrow" src="/images/arrow-black.svg" alt="arrow"/>
        </components.DropdownIndicator>
    );
};

const Select: FC<any> = ({components = {}, ...props}) => {
    const SelectComponent = props.async ? (props) => <AsyncSelect {...props}/> : (props) => <ReactSelect {...props}/>;

    return (
        <SelectComponent
            {...props}
            styles={props.autoSize ?
                {
                    placeholder: ({ maxWidth, position, top, transform, ...otherStyles }) => ({ ...otherStyles }),
                    singleValue: ({ maxWidth, position, top, transform, ...otherStyles }) => ({ ...otherStyles }),
                }
                : {}}
            components={{
                DropdownIndicator,
                IndicatorSeparator: () => null,
                ...components
            }}
            className={"select " + props.className}
            classNamePrefix="select"
        />
    )
};

export {
    Select
}
