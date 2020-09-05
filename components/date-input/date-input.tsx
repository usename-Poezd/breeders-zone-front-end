import React, {Component} from "react";
import InputMask from "react-input-mask";

//ONLY class component works
class DateInput extends Component {
    render() {
        return <React.Fragment>
            <InputMask {...this.props} mask="99.99.9999"/>
        </React.Fragment>
    }
}

export default DateInput
