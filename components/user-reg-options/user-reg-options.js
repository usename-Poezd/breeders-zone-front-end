import React from "react";
import GroupFormControl from "../group-form-control";


const UserRegOptions = ({ register, errors, onChange, ...params}) => {
    const {
        regExp
    } = params;

    return (
        <React.Fragment>
            <GroupFormControl
                label="Имя"
                nec = {true}
                errors={errors}
                controls={{
                    type: "text",
                    name: "name",
                    placeholder: "Ваше имя",
                    ref: register({
                        required: true
                    })
                }}
            />
            <GroupFormControl
                label="Фамилия"
                nec = {true}
                errors={errors}
                controls={{
                    type: "text",
                    name: "surname",
                    placeholder: "Ваша фамилия",
                    ref: register({
                        required: true
                    })
                }}
            />
            <GroupFormControl
                label="Отчество"
                nec = {true}
                errors={errors}
                controls={{
                    type: "text",
                    name: "patronymic",
                    placeholder: "Ваше отчество",
                    ref: register({
                        required: true
                    })
                }}
            />
            <GroupFormControl
                label="Электронная почта"
                nec = {true}
                errors={errors}
                controls={{
                    type: "email",
                    name: "email",
                    placeholder: "mymail123@mail.com",
                    ref: register({
                        required: true,
                        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    })
                }}
            />
            <GroupFormControl
                label="Пароль"
                nec = {true}
                errors={errors}
                controls={{
                    type: "password",
                    name: "password",
                    placeholder: "Пароль",
                    min: 8,
                    ref: register({
                        required: true,
                        minLength: 8
                    })
                }}
            />
            <GroupFormControl
                label="Подтвердите пароль"
                nec = {true}
                errors={errors}
                controls={{
                    type: "password",
                    name: "confirmPassword",
                    placeholder: "Подтвердите пароль",
                    ref: register({
                        required: true,
                        pattern: regExp
                    })
                }}
            />
        </React.Fragment>
    )
};

export default UserRegOptions;
