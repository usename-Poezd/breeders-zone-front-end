import React from "react";
import Header from "../../../components/header";
import {Container} from "react-bootstrap";
import SecondHeader from "../../../components/second-header";
import Morphs from "../../../components/morphs";
import {DataService} from "../../../services";
import Head from "next/head";
import {connect} from "react-redux";

const MorphsPage = ({morphs, activeKind}) => {
    return (
        <React.Fragment>
            <Head>
                <title>Морфы {activeKind.title_rus}  ({activeKind.title_eng})</title>
            </Head>
            <Container>
                <Morphs morphs={morphs}/>
            </Container>
        </React.Fragment>
    )
};

export const getServerSideProps = async (ctx) => {
    const { group, kind } = await ctx.query;
    const dataService = await new DataService();
    const morphs = await dataService.getActiveGenes({group, kindTitle: kind.replace('-', ' ') });

    return {
        props: {
            morphs
        }
    }
};

const mapStateToProps = ({kinds: {activeKind}}) => ({
    activeKind
});

export default  connect(mapStateToProps)(MorphsPage);