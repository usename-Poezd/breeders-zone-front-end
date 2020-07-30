import React from "react";
import {Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";

const HandelError = ({errors, name, controls}) => (
    <React.Fragment>
        {   errors[name] &&
        errors[name].type === 'required' &&
        <p className="form-err text-danger">Пожалуйста заполните это поле</p>
        }
        {   errors[name] &&
        errors[name].type === 'pattern' &&
        name !== 'confirmPassword' &&
        <p className="form-err text-danger">Пожалуйста заполните это поле правильно</p>
        }
        {   errors[name] &&
        errors[name].type === 'pattern' &&
        name === 'confirmPassword' &&
        <p className="form-err text-danger">Пароли не совподают</p>
        }
        {   errors[name] &&
        errors[name].type === 'minLength' &&
        <p className="form-err text-danger">Минимальное значение для данного поля {controls.min} символов</p>
        }
        {   errors[name] &&
        errors[name].type === 'maxLength' &&
        <p className="form-err text-danger">Максимальное значение для данного поля {controls.max} символов</p>
        }
    </React.Fragment>
);

const GroupFormControl = ({
    label = '',
    nec = false,
    errors,
    min = 0,
    max = 255,
    textArea = false,
    info = {
        isInfo: false
    },
    controls = {}
}) => {

    const name = controls.name;

    if (label) {
        return (
            <Form.Group>
                <Form.Label className={ nec ? 'nec' : ''}>
                    {label}:

                    {
                        info.isInfo ?
                            (
                                <span className="info">
                                <FontAwesomeIcon icon={faQuestionCircle}/>
                                <p className="info-text">{info.text}</p>
                            </span>
                            )

                            : null
                    }
                </Form.Label>

                <Form.Control
                    as={ textArea ? 'textarea' : 'input' }
                    className={ errors[name] && 'border-danger' }
                    {...controls}
                />
                <HandelError errors={errors} name={name} controls={controls}/>
            </Form.Group>
        )
    }

    return (
        <Form.Group>
            <Form.Control
                as={ textArea ? 'textarea' : 'input' }
                className={ errors[name] && 'border-danger' }
                {...controls}
            />
            <HandelError errors={errors} name={name}/>
        </Form.Group>
    )
};

export default GroupFormControl;
