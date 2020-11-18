import * as React from "react";
import {FC} from "react";
import ReactSelect, { components } from "react-select";
import AsyncSelect from 'react-select/async';

const DropdownIndicator = (props: any) => {
    return (
        <components.DropdownIndicator {...props}>
            <img className="m-0 select-arrow" src="/images/arrow-black.svg" alt="arrow"/>
        </components.DropdownIndicator>
    );
};

const Select: FC<any> = ({components = {}, ...props}) => {
    if (props.async) {
        return <AsyncSelect
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
            id={props.id}
            instanceId={props.id}/>;
    }
    return (
        <ReactSelect
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
            id={props.id} instanceId={props.id}
        />
    )
};

export {
    Select
}
