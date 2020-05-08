import React from 'react';
import {useForm} from "react-hook-form";

const withHookForm = (Wrapped) => {
    return (props) => {
        const { register, handleSubmit, watch, setValue, errors } = useForm();
        return (
            <Wrapped {...props}
                     register={register}
                     handleSubmit={handleSubmit}
                     errors={errors}
                     watch={watch}
                     setValue={setValue}
            />
        )
    }
}

export default withHookForm;
