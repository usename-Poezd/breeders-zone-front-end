import * as React from "react";
import {FC, useState} from "react";
import {useRouter} from "next/router";
import {Select} from "../Select";
import {FilterPropsType, IOption} from "./types";
import {IRootState} from "../../redux/store";
import {useStore} from "react-redux";
const qs = require('qs');


const Filter: FC<FilterPropsType > = ({autoSize, isSearchable = false, onFilter, placeholder = "Выберите фильтрацию", ...props}) => {
    const {router: {location: {pathname, search}}}: IRootState = useStore().getState();
    const router = useRouter();

    const onChange = (option: IOption) => {
        setFilter(option);
        const newQuery = qs.parse(search.replace('?', ''));
        if (props.name === 'sort' && newQuery.page) {
            delete newQuery.page;
        }
        newQuery[props.name] = option.value;
        router.push(router.pathname, pathname + '?' + qs.stringify(newQuery));
        if (onFilter) {
            onFilter(option);
        }
    };

    const [filter, setFilter] = useState(router.query.sort ? props.options.find((item) => item.value === router.query.sort) : null);

    return (
        <Select
            {...props}
            autoSize={autoSize}
            isSearchable={isSearchable}
            placeholder={placeholder}
            instanceId={props.id}
            value={filter}
            onChange={onChange}
        />
    );
};


export {
    Filter
};
