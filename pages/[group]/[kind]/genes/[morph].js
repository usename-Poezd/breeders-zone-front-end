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
                        props.selectedMorphs.map( ({geneTitle, traitTitle, type}) => ` ${traitTitle} ${geneTitle}`)
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
    const { morph } = await query;

    const regex = /(het|possible-het|visual|normal|super)?\-?([Aa-zZ0-9]+\-?\(?[Aa-zZ]{0,}\)?)/gmi;
    const regExpExecArray = regex.exec(morph);

    const options = {
        geneTitle: regExpExecArray[2]
    };

    if (typeof regExpExecArray[1] !== 'undefined') {
        options.traitTitle = regExpExecArray[1];
    }

    const props = await dataService.getProducts(options, qs.stringify(query));

    return {
        props: {
            ...props
        }
    }
};