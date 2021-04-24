import React from "react";
import {Container} from "react-bootstrap";
import Morphs from "../../../../components/morphs";
import {DataService} from "../../../../services";
import Head from "next/head";
import {connect} from "react-redux";
import Error from "../../../_error";

const MorphsPage = ({morphs, activeKind, statusCode}) => {
    if (statusCode && statusCode !== 200) {
        return <Error statusCode={statusCode}/>
    }

    return (
        <React.Fragment>
            <Container as="section" className="body-container">
                <Morphs morphs={morphs}/>
            </Container>
        </React.Fragment>
    )
};

export const getServerSideProps = async (ctx) => {
    try {
        const { group, kind } = await ctx.query;
        const dataService = await new DataService();
        const morphs = await dataService.getActiveGenes({group, kindTitle: kind.replace('-', ' ') });

        return {
            props: {
                statusCode: 200,
                morphs
            }
        }
    } catch (error) {
        ctx.res.statusCode = error.response.status;
        return {
            props: {
                statusCode: error.response.status
            }
        };
    }
};

const mapStateToProps = ({kinds: {activeKind}}) => ({
    activeKind
});

export default  connect(mapStateToProps)(MorphsPage);
