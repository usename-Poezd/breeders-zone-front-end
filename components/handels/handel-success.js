import React, {Component} from "react";
import {Alert} from "react-bootstrap";
import Fade from "react-bootstrap/Fade";

class HandelSuccess extends Component {
    state = {
        isToggle: false
    };

    componentDidMount(){
        if(this.props.success){
            this.setState({isToggle: true}, () => {
                setTimeout(() => this.setState({isToggle: false}), 3000)
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.success !== this.props.success){
            if(this.props.success){
                this.setState({isToggle: true}, () => {
                    setTimeout( () => this.setState({isToggle: false}), 3000)
                });
            }
        }
    }

    componentWillUnmount() {
        clearTimeout(3000);
    }

    render() {
        const { isToggle } = this.state;
        const { success } = this.props;
        let body = <h3 className="text-center">{success}</h3>;

        switch (success) {
            case 'Reset Email is send successfully, please check your inbox':
                body = <p>На вашу электронную почту выслано письмо с дальнейшими указаниями, пожалуйста проверте свой почтовый ящик.</p>;
                break;
            case 'Password successfully changed':
                body = <p>Пароль успешно сменен.</p>;
                break;
            case 'Success update profile':
                body = <h3 className="text-center">Профиль успешно обновлен.</h3>;
                break;
            case 'Success update shop':
                body = <h3 className="text-center">Профиль магазина успешно обновлен.</h3>;
                break;
            default:
                body = <h3 className="text-center">{success}</h3>
        }

        return (
            <Fade in={isToggle}>
                <Alert variant="success" show={isToggle}>
                    {body}
                </Alert>
            </Fade>

        )
    }
}

export default HandelSuccess;
