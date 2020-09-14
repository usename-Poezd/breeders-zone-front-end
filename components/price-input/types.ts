import {Control, DeepMap, FieldError} from "react-hook-form";

export interface PriceInputProps {
    errors: DeepMap<Record<string, any>, FieldError>,
    control: Control
}
