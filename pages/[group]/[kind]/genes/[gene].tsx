import {Container} from "react-bootstrap";
import {DataService} from "../../../../services";
import React from "react";
import Head from "next/head";
import {ProductsPagePropsType} from "../../../../types";
import {compareMorph} from "../../../../utils";
import {ProductList} from "../../../../components/ProductList";
import {NextPageContext} from "next";
const qs = require('qs');

export default (props: ProductsPagePropsType) => {
    return (
        <React.Fragment>
            <Head>
                <title>
                    Животные с морофой
                    {
                        props.products.meta.selected_morphs.map( ({gene_title, trait_title}) => ` ${trait_title ? compareMorph(trait_title, gene_title) : gene_title}`)
                    }
                </title>
            </Head>
            <Container>
                <ProductList products={props.products.data} meta={props.products.meta}/>
            </Container>
        </React.Fragment>
    )
};

export const getServerSideProps = async (ctx: NextPageContext) => {
    const dataService = await new DataService();
    const {query} = await ctx;

    const products = await dataService.getProducts({}, qs.stringify(query));

    return {
        props: {
            products
        }
    }
};
