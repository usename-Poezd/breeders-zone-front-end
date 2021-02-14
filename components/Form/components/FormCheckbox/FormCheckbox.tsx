import * as React from "react";
import {FC} from "react";
import {Form} from "react-bootstrap";
import {ErrorMessage, FieldProps} from "formik";
import {FormErrorMessage} from "../FormErrorMessage";
import {IFormComponentProps} from "../../types";

const FormCheckbox: FC<IFormComponentProps & FieldProps> = ({field, form, className, required, group = true, ...props}) => {
    if (group) {
        return (
            <Form.Group className="d-flex">
                <Form.Check
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
            <Form.Check
                {...field}
                {...props}
                className={ (form.errors[field.name] && form.touched[field.name] ? 'border-danger ' : ' ') + className}
            />
            <ErrorMessage component={FormErrorMessage} name={field.name}/>
        </React.Fragment>
    )
};

export {
    FormCheckbox
}
