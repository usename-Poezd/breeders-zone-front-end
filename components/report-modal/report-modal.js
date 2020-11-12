import React from "react";
import {connect} from "react-redux";
import {Form, Modal, Alert, Spinner as BootstrapSpinner} from "react-bootstrap";
import {
    setReportModalError,
    setReportModalRequest,
    setReportModalShow,
    setReportModalSuccess,
} from "../../redux/actions";
import {setUserGuardXP} from "../../redux/Profile";
import {useForm} from "react-hook-form";
import GroupFormControl from "../group-form-control";
import {withDataService} from "../../HOC";

const ReportModal = (props) => {
    const {report, user} = props;
    const {handleSubmit, register, errors} = useForm();

    const onSubmit = (data) => {
        const {report, setReportModalSuccess, setReportModalError, setReportModalRequest, setReport, setUserGuardXP} = props;
        setReportModalRequest(true);
        setReport({
            ...data,
            product_id: report.productId,
            divorce_id: report.divorceId
        })
            .then( ({message}) => {
                setReportModalRequest(false);
                setReportModalSuccess(message);
                setUserGuardXP();
                setTimeout(() => setReportModalSuccess(null), 3000);
            })
            .catch( (error) => {
                setReportModalRequest(false);
                setReportModalError(error.response.data.message);
                setTimeout(() => setReportModalError(null), 3000);
            })
    };

    const modalClose = () => {
        const {setReportModalShow} = props;
        setReportModalShow(false);
    };

    if (report.request) {
        return (
            <Modal show={report.show && user.is_guard} onHide={modalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Пожаловатся</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center">
                    <BootstrapSpinner animation="border"/>
                </Modal.Body>
            </Modal>
        )
    }

    return (
        <Modal show={report.show && user.is_guard} onHide={modalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Пожаловатся</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    report.success ?
                        <Alert variant="success">
                            <h3>{report.success}</h3>
                        </Alert>
                        : null
                }
                {
                    report.error ?
                        <Alert variant="danger">
                            <h3>{report.error}</h3>
                        </Alert>
                        : null
                }
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <GroupFormControl
                        label="Причина"
                        errors={errors}
                        controls={{
                            type: 'text',
                            name: 'title',
                            ref: register({
                                required: true
                            })
                        }}
                    />
                    <GroupFormControl
                        label="Подробнее"
                        textArea={true}
                        errors={errors}
                        controls={{
                            type: 'text',
                            name: 'description',
                            ref: register({
                                required: true
                            })
                        }}
                    />
                    <div className="d-flex justify-content-center">
                        <input type="submit" value="Отправить" className="btn btn-main"/>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
};

const mapMethodsToProps = ({setReport}) => ({
    setReport
});

const mapStateToProps = ({modals: {report}, profile: {user}}) => ({
    report,
    user
});

export default connect(mapStateToProps, {
    setReportModalShow,
    setReportModalSuccess,
    setReportModalError,
    setReportModalRequest,
    setUserGuardXP
})(
    withDataService(ReportModal, mapMethodsToProps)
);
