import {Container} from "react-bootstrap";
import TraitItems from "../../../../components/traits-list";
import {DataService} from "../../../../services";
import React from "react";
import Head from "next/head";
const qs = require('qs');

export default (props) => {
    return (
        <React.Fragment>
            <Head>
                <title>
                    Животные с морофой
                    {
                        props.selectedMorphs.map( ({geneTitle, traitTitle}) => ` ${traitTitle && (traitTitle !== 'Normal' || traitTitle !== 'Visual') ? traitTitle + ' ' : ''}${geneTitle}`)
                    }
                </title>
            </Head>
            <Container>
                <TraitItems {...props}/>
            </Container>
        </React.Fragment>
    )
};

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const {query} = await ctx;

    const props = await dataService.getProducts({}, qs.stringify(query));

    return {
        props: {
            ...props
        }
    }
};
