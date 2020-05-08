import {Container} from "react-bootstrap";
import TraitItems from "../../../../components/trait-item";
import {DataService} from "../../../../services";
import React from "react";
const qs = require('qs');

export default (props) => {
    return (
        <Container>
            <TraitItems {...props}/>
        </Container>
    )
};

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const {query} = await ctx;
    const { morph } = await query;

    const regex = /(het|possible-het|visual|normal|super)?\-?([Aa-zZ]+\-?\(?[Aa-zZ]{0,}\)?)/gmi;
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