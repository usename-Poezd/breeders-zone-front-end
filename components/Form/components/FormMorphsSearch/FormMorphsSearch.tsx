import {DataService} from "../../../../services";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import React, {FC} from "react";
import {IFormComponentProps} from "../../types";
import {ErrorMessage, FieldProps} from "formik";
import {Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Select} from "../../../Select";
import {FormErrorMessage} from "../FormErrorMessage";
import {compareMorph, toUrl} from "../../../../utils";
import {components, IndicatorProps} from "react-select";
import {IMorph, MorphSearchType} from "../../../../types";

const dataService = new DataService();
const debounceSearch = AwesomeDebouncePromise(
    dataService.searchMorphs,
    500
);

    const DropdownIndicator = (props: IndicatorProps<any>) => {
    return (
        <components.DropdownIndicator {...props}>
            {
                props.selectProps.options.length === 0 ?
                    <img className="m-0 img-fluid" src="/images/search-black.svg" alt="search"/>
                    : <img className="m-0 select-arrow" src="/images/arrow-black.svg" alt="arrow"/>
            }
        </components.DropdownIndicator>
    );
};

const LoadingMessage = props => {
    return (
        <p className="p--10 text-center">Загрузка...</p>
    );
};

const NoOptionsMessage = props => {
    return  (
        <p className="p--10 text-center">
            {
                props.selectProps.inputValue ?
                    <span>По запросу <b>{ props.selectProps.inputValue}</b> ничего не найденно</span>
                    : 'Начните вводить морфу'
            }
        </p>
    )
};



const FormMorphSelect: FC<IFormComponentProps & FieldProps> = ({field, form, required, group = true, options, ...props}) => {
    const loadOptions =  (inputValue: string, callback) => {
        if (inputValue) {
            debounceSearch(inputValue)
                .then((data) => {
                    const newData = data.data.map((item) => ({
                        label: (
                            <div
                                className={
                                    `d-inline-block m-0 morph-indicator text-nowrap morph-${item.gene.type && item.trait.title ? item.gene.type : 'other' }-${item.trait.title ? toUrl(item.trait.trait_group ?  item.trait.trait_group.label : item.trait.title) : 'normal'}`
                                }
                            >
                                {compareMorph(item.trait.title, item.gene.title)}
                            </div>
                        ),
                        value: item
                    }));
                    callback(newData);
                });
        } else {
            callback([]);
        }
    };

    const onAddMorph = (option: {value: IMorph}) => {
        const morphs = (form.values[field.name] as Array<MorphSearchType>);
        const morphIdx = morphs.findIndex((item) => item.gene_id === option.value.gene_id
            && item.trait_id === option.value.trait_id
            && item.type === 'delete');
        if (morphIdx !== -1) {
            morphs[morphIdx].type = 'add';
            form.setFieldValue(field.name, [...form.values[field.name], ...morphs])
        } else if (morphs.findIndex((item) => item.gene_id === option.value.gene_id) === -1) {
            form.setFieldValue(field.name, [...form.values[field.name], {...option.value, type: 'add'}])
        }
    };

    const onDeleteMorph = (idx) => {
        const morphs = (form.values[field.name] as Array<MorphSearchType>);
        const morph = morphs[idx];
        if (morph.type === 'add') {
            morphs.splice(idx, 1);
            form.setFieldValue(field.name, [...morphs]);
        } else {
            morphs[idx].type = 'delete';
            form.setFieldValue(field.name, [...morphs]);
        }
    };

    const Component = () => (
        <React.Fragment>
            {
                props.label &&
                <Form.Label htmlFor={props.id ? props.id : 'none'}>
                    <span>{props.label}:</span>
                    {
                        required &&
                        <span className="nec">*</span>
                    }

                    {
                        props.description &&
                        <span className="info">
                                    <FontAwesomeIcon icon={faQuestionCircle}/>
                                    <p className="info-text">{props.description}</p>
                                </span>
                    }
                </Form.Label>
            }
            <Select
                {...props} {...field}
                components={{LoadingMessage, NoOptionsMessage, DropdownIndicator}}
                async
                defaultOptions
                cacheOptions
                loadOptions={loadOptions}
                options={options}
                placeholder="Начните вводить морфу"
                onChange={onAddMorph}
            />
            <ErrorMessage component={FormErrorMessage} name={field.name}/>
        </React.Fragment>
    );

    if (group) {
        return (
            <React.Fragment>
                <Form.Group>
                    <Component/>
                </Form.Group>
                <div className="morphs">
                    {
                        (form.values[field.name] as Array<MorphSearchType>).map((item, idx) => {
                            if(item.type !== 'delete' || !item.type) {
                                return (
                                    <div
                                        key={field.name + String(item.gene_id) + String(item.trait_id)}
                                        className={
                                            `d-inline-block morph-indicator text-nowrap morph-${item.gene.type && item.trait.title ? item.gene.type : 'other' }-${item.trait.title ? toUrl(item.trait.trait_group ?  item.trait.trait_group.label : item.trait.title) : 'normal'}`
                                        }
                                    >
                                        {compareMorph(item.trait.title, item.gene.title)}
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            size="lg"
                                            onClick={() => onDeleteMorph(idx)}
                                            className="delete pl-1"/>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <Component/>
            <div className="morphs">
                {
                    (form.values[field.name] as Array<MorphSearchType>).map((item, idx) => {
                        if(item.type !== 'delete' || !item.type) {
                            return (
                                <div
                                    key={field.name + String(item.gene_id) + String(item.trait_id)}
                                    className={
                                        `d-inline-block morph-indicator text-nowrap morph-${item.gene.type && item.trait.title ? item.gene.type : 'other' }-${item.trait.title ? toUrl(item.trait.trait_group ?  item.trait.trait_group.label : item.trait.title) : 'normal'}`
                                    }
                                >
                                    {compareMorph(item.trait.title, item.gene.title)}
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        size="lg"
                                        onClick={() => onDeleteMorph(idx)}
                                        className="delete pl-1"/>
                                </div>
                            )
                        }
                    })
                }
            </div>
        </React.Fragment>
    )
};

export {
    FormMorphSelect
};
