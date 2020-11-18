import * as React from "react";
import {FC} from "react";

const FormErrorMessage: FC = (props) => {
    return <p className="form-err text-danger">{props.children}</p>
};

export {
    FormErrorMessage
}
