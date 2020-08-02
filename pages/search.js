import React from "react";
import {Container} from "react-bootstrap";
import TraitItems from "../components/traits-list";
import {DataService} from "../services";
import Head from "next/head";
const qs = require('qs');

const SearchPage = (props) => {
    return (
        <Container>
            <Head>
                <title>Поиск | Breeders Zone</title>
                <meta name="description" content="Breeders Zone это маркетплейс где вы можете бысто найти и продать животное, больше никаних групп и форумов, все в одном месте"/>
            </Head>
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
