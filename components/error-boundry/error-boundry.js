import React, { Component } from 'react';
import ErrorInicator from '../error-indicator';

class ErrorBoundry extends Component {
    state = {
        hasError: false
    }

    componentDidCatch(){
        this.setState({ hasError: true })
    }

    render() {
        if(this.state.hasError){
            return <ErrorInicator/>
        }

        return this.props.children;
    }
}

export default ErrorBoundry;