import React, {Component} from "react";
import {Alert, ListGroup} from "react-bootstrap";
import {HandleErrorPropsType} from "./types";

class HandleError extends Component<HandleErrorPropsType> {
    state = {
        isToggle: false,
        error: []
    };

    componentDidMount(){
        this.checkForErrors();
    }

    componentDidUpdate(prevProps: HandleErrorPropsType) {
        if(prevProps !== this.props) {
            this.checkForErrors();
        }
    }

    componentWillUnmount() {
        clearTimeout(3000);
    }

    checkForErrors = () => {
        if(this.props.error.errors){
            const arr = Object.values(this.props.error.errors);
            this.setState({isToggle: true, error: arr}, () => {
                setTimeout(() => this.setState({isToggle: false}), 5000)
            });
        }
    };

    render() {
        const { isToggle, error } = this.state;
        const { status } = this.props.error;
        let body;


        if(status === 503 || status === 500){
            body = <p>Какие-то неполадки на сервере, обратитесь в тех. поддержку.</p>
        }



        return (

            <Alert variant="danger" show={isToggle}>
                {
                    !body ?
                        (
                            <ListGroup variant="flush" className="error-list">
                                {
                                    error.map( (message, idx) =>  <ListGroup.Item key={'err-msg-'+idx}>{message}</ListGroup.Item>)
                                }
                            </ListGroup>
                        ) : body
                }
            </Alert>

        )
    }
}

export {
    HandleError
};
