import React, {FC} from "react";
import {IFormComponentProps} from "../../types";
import {FieldProps} from "formik";

const FormRadio: FC<IFormComponentProps & FieldProps> = ({field, form, required, ...props}) => {
    return (
        <div className="form-check">
            <input
                {...field}
                {...props}
                onChange={() => form.setFieldValue(field.name, props.value)}
                className={"form-check-input" + (form.errors[field.name] && form.touched[field.name] ? ' border-danger' : '')}
                type="radio"

            />
            {
                props.label &&
                <label className="form-check-label" htmlFor={props.id ? props.id : 'none'}>
                    <span>{props.label}:</span>
                </label>
            }
        </div>
    )
};

export {
    FormRadio
}
