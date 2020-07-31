import {Container} from "react-bootstrap";
import React from "react";
import GuardDashboard from "../../components/guard/guard-dashboard";
import ReportModal from "../../components/report-modal";
import Head from "next/head";
import {serverRedirect} from "../../utils";

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

export const getServerSideProps = (ctx) => {
    serverRedirect(ctx);

    return {
        props: {}
    }
};

export default Dashboard;
