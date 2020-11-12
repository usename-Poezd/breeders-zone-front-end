import React, {FC} from 'react';
import {useRouter} from 'next/router'
import {Formik, FormikProps, Field, Form as FormikForm} from "formik";
import {FormInput} from "../../../components/Form";
import * as Yup from "yup";

const initialValues = {
    name: '',
    surname: '',
    email: ''
};

const ContinueRegistration: FC = () => {
    const router = useRouter();
    const onSubmit = data => {
        router.push(`/registration?name=${data.name}&surname=${data.surname}&email=${data.email}`)
    };

    return (
        <div className="reg form-container">
            <h2 className="form-container-title">Впервые на Breeders Zone?</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object({
                    name: Yup.string()
                        .required('Имя должно быть указанно'),
                    surname: Yup.string()
                        .required('Имя должно быть указанно'),
                    email: Yup.string()
                        .required('Электронная почта должна быть указанна')
                        .email('Электронная почта введена не парвильно')
                })}
                onSubmit={onSubmit}
            >
                <FormikForm className="form login-form">
                    <Field component={FormInput} name="name" placeholder="Имя"/>
                    <Field component={FormInput} name="surname" placeholder="Фамилия"/>
                    <Field component={FormInput} name="email" placeholder="Электронная почта"/>
                    <button type="submit" className="btn btn-success btn-bn w-100">Продолжить регистрацию</button>
                </FormikForm>
            </Formik>
        </div>
    )
};

export {
    ContinueRegistration
};
