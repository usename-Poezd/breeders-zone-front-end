import React, {useState} from "react";
import { PriceInputProps } from "./types";
import {Controller} from "react-hook-form";
import NumberFormat from "react-number-format";


const PriceInput = (props: PriceInputProps) => {
    const {errors, control} = props;

    return (
        <React.Fragment>
            <Controller
                render={(props) => <NumberFormat {...props} thousandSeparator={" "} className={"form-control"} allowNegative={false}/>}
                control={control}
                name="price"
                rules={{
                    required: true,
                    pattern: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/
                }}
            />
            {   errors.price &&
                errors.price.type === 'required' &&
            <p className="form-err text-danger">Пожалуйста заполните это поле</p>
            }
            {   errors.price &&
                errors.price.type === 'pattern' &&
                <p className="form-err text-danger">Пожалуйста заполните это поле правильно</p>
            }
        </React.Fragment>
    );
};

export default PriceInput;
