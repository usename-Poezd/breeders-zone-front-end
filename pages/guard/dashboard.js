import {Container} from "react-bootstrap";
import React from "react";
import GuardDashboard from "../../components/guard/guard-dashboard";
import ReportModal from "../../components/report-modal";

const Dashboard = (props) => {
    return (
        <Container>
            <ReportModal/>
            <GuardDashboard/>
        </Container>
    );
};

export default Dashboard;