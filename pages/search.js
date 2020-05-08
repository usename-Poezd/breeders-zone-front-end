import React from "react";
import Header from "../components/header";
import SecondHeader from "../components/second-header";
import {Container} from "react-bootstrap";
import TraitItems from "../components/trait-item";
import {DataService} from "../services";
const qs = require('qs');

const SearchPage = (props) => {
    return (
        <Container>
            <TraitItems {...props}/>
        </Container>
    )
};

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const {query} = await ctx;
    const { traitTitle = '' } = await query;
    const options = {
        traitTitle
    };

    if (traitTitle === 'possible') {
        options.traitTitle = 'possible het';
        options.geneTitle =  await options.geneTitle.replace(/het\s/gi, '');
    }

    const props = await dataService.getProducts(options, qs.stringify(query));

    return {
        props: {...props}
    }
};

export default SearchPage;