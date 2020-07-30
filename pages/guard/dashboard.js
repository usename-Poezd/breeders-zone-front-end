import {Container} from "react-bootstrap";
import React from "react";
import GuardDashboard from "../../components/guard/guard-dashboard";
import ReportModal from "../../components/report-modal";
import Head from "next/head";

const Dashboard = (props) => {
    return (
        <Container>
            <Head>
                <title>Рабочий стол хранителя | Breeders Zone</title>
            </Head>
            <ReportModal/>
            <GuardDashboard/>
        </Container>
    );
};

export default Dashboard;
