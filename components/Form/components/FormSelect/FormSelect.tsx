import React, {FC} from "react";
import {Form} from "react-bootstrap";
import {ErrorMessage, FieldProps} from "formik";
import {Select} from "../../../Select";
import {IFormComponentProps} from "../../types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import {FormErrorMessage} from "../FormErrorMessage";

const FormSelect: FC<IFormComponentProps & FieldProps> = ({field, form, required, group = true, options, ...props}) => {
    if (group) {
        return (
            <Form.Group>
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
                    options={options}
                    value={options ? options.find(option => option.value === field.value) : ''}
                    onChange={(option) => form.setFieldValue(field.name, option.value)}
                />
                <ErrorMessage component={FormErrorMessage} name={field.name}/>
            </Form.Group>
        )
    }

    return (
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
                options={options}
                value={options ? options.find(option => option.value === field.value) : ''}
                onChange={(option) => form.setFieldValue(field.name, option.value)}
            />
            <ErrorMessage component={FormErrorMessage} name={field.name}/>
        </React.Fragment>
    )
};

export {
    FormSelect
}
