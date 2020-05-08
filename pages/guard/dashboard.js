import Header from "../../components/header";
import Head from "next/head";
import {Container} from "react-bootstrap";
import React from "react";
import GuardDashboard from "../../components/guard/guard-dashboard";

const Dashboard = (props) => {
    return (
        <React.Fragment>
            <Container>
                <GuardDashboard/>
            </Container>
        </React.Fragment>
    );
};

export default Dashboard;