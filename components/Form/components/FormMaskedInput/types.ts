import {IFormComponentProps} from "../../types";
import {FieldProps} from "formik";

interface IFormMaskerInputProps {
    mask: string
}

export type FormMaskedInputPropsType = IFormComponentProps & FieldProps & IFormMaskerInputProps
