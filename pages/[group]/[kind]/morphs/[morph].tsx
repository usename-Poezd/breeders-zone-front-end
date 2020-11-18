import {Container} from "react-bootstrap";
    import {DataService} from "../../../../services";
import React from "react";
import Head from "next/head";
import {ProductsPagePropsType} from "../../../../types";
import {ProductList} from "../../../../components/ProductList";
import {NextPageContext} from "next";
import {compareMorph} from "../../../../utils";
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
    const { morph } = await query;

    const regex = /(het|possible-het|possible|visual|normal|super)?-?(.+)/gmi;
    const regExpExecArray = regex.exec(String(morph));
    let options: {gene: string, trait: string} = {
        gene: '',
        trait: ''
    };

    if (regExpExecArray) {
        options.gene = regExpExecArray[2];

        if (typeof regExpExecArray[1] !== 'undefined') {
            options.trait = regExpExecArray[1];
        }
    }


    const products = await dataService.getProducts(options, qs.stringify(query));

    return {
        props: {
            products
        }
    }
};
