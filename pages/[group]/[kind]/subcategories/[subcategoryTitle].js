import {Container} from "react-bootstrap";
import TraitItems from "../../../../components/traits-list";
import {DataService} from "../../../../services";
import React from "react";
import Head from "next/head";
import {connect} from "react-redux";

const qs = require('qs');

const mapStateToProps = ({kinds: {activeKind}}) => ({
    activeKind
});

export default connect(mapStateToProps)(
    ({products, activeKind}) => {

        return (
            <React.Fragment>
                <Head>
                    <title>Животные в подкатегории {products.selectedSubcategory ? products.selectedSubcategory.title : null} | {activeKind.title_rus}  ({activeKind.title_eng})</title>
                </Head>
                <Container>
                    <TraitItems {...products}/>
                </Container>
            </React.Fragment>
        )
    }
);

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const {query} = await ctx;
    const products = await dataService.getProducts({}, qs.stringify(query));

    return {
        props: {
            products
        }
    }
};