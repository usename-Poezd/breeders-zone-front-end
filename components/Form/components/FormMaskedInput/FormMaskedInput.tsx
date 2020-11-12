import React, {FC} from "react";
import {IFormComponentProps} from "../../types";
import {ErrorMessage, FieldProps} from "formik";
import {Form} from "react-bootstrap";
import {FormErrorMessage} from "../FormErrorMessage";
import InputMask from "react-input-mask";
import {FormMaskedInputPropsType} from "./types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";

const FormMaskedInput: FC<FormMaskedInputPropsType> = ({field, form, required,  ...props}) => {

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
            <InputMask
                {...field}
                {...props}
                className={"form-control" + (form.errors[field.name] && form.touched[field.name] ? ' border-danger' : '')}
             />
            <ErrorMessage component={FormErrorMessage} name={field.name}/>
        </Form.Group>
    )
};

export {
    FormMaskedInput
}
