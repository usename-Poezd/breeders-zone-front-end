import React from "react";
import Header from "../../../components/header";
import {Container} from "react-bootstrap";
import SecondHeader from "../../../components/second-header";
import Morphs from "../../../components/morphs";
import {DataService} from "../../../services";

const MorphsPage = ({morphs}) => {
    return (
        <Container>
            <Morphs morphs={morphs}/>
        </Container>
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

export default MorphsPage;