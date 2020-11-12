import React, {FC} from "react";
import {FormInput} from "../../../components/Form";
import {Field} from "formik";

const UserRegistrationOptions: FC = () => (
    <React.Fragment>
        <Field id="name" name="name" required label="Имя" placeholder="Ваше имя" component={FormInput} />
        <Field id="surname" name="surname" required label="Фамилия" placeholder="Ваша фамилия" component={FormInput} />
        <Field id="patronymic" name="patronymic" required label="Отчество" placeholder="Ваше отчество" component={FormInput} />
        <Field id="email" name="email" required label="Электронная почта" placeholder="Ваша электронная почта" component={FormInput} />
        <Field id="password" name="password" required type="password" autoComplete="new-password" label="Пароль" placeholder="Пароль" component={FormInput} />
        <Field id="confirmPassword" name="confirmPassword" required type="password" label="Подтвердите пароль" placeholder="Подтвердите ваш пароль" component={FormInput} />
    </React.Fragment>
);

export {
    UserRegistrationOptions
}
