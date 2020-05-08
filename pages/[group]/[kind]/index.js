import {Container} from "react-bootstrap";
import TraitItems from "../../../components/trait-item";
import {DataService} from "../../../services";
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
    const props = await dataService.getProducts({}, qs.stringify(query));

    return {
        props: {
            ...props
        }
    }
};