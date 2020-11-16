import React, {FC} from "react";
import {Form} from "react-bootstrap";
import {ErrorMessage, FieldProps} from "formik";
import {FormErrorMessage} from "../FormErrorMessage";
import {IFormComponentProps} from "../../types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";

const FormInput: FC<IFormComponentProps & FieldProps> = ({field, form, className, required, group, ...props}) => {
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
                <Form.Control
                    {...field}
                    {...props}
                    className={ (form.errors[field.name] && form.touched[field.name] ? 'border-danger ' : ' ') + className}
                />
                <ErrorMessage component={FormErrorMessage} name={field.name}/>
            </Form.Group>
        );
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
            <Form.Control
                {...field}
                {...props}
                className={ (form.errors[field.name] && form.touched[field.name] ? 'border-danger ' : ' ') + className}
            />
            <ErrorMessage component={FormErrorMessage} name={field.name}/>
        </React.Fragment>
    )
};

export {
    FormInput
}
