import {Control} from "react-hook-form";

export interface PriceInputProps {
    errors: {
        price: {
            type: 'required'|'pattern'
        }
    },
    control: Control
}
