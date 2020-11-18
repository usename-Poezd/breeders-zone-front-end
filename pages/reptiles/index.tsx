import {Container} from "react-bootstrap";
import {DataService} from "../../services";
import React from "react";
import {compareMorph, num2str} from "../../utils";
import Head from "next/head";
import {NextPageContext} from "next";
import {ProductsPagePropsType} from "../../types";
import {ProductList} from "../../components/ProductList";

const qs = require('qs');

export default (props: ProductsPagePropsType) => {
    const {
        products: {
            meta: {
                selected_morphs = []
            }
        }
    } = props;
    return (
        <Container>
            <Head>
                <title>
                    {
                        selected_morphs && selected_morphs.length === 0 ?
                            `Рептилии | Breeders Zone`
                            : `${num2str(selected_morphs.length, ['Морфа', 'Морфы'])} ${selected_morphs.map((item) => compareMorph(item.trait_title, item.gene_title))} | Breeders Zone`
                    }
                </title>
                <meta
                    name="description"
                    content={
                        selected_morphs && selected_morphs.length === 0 ?
                            `Быстро купить рептилию | Breeders Zone`
                            : `Купить рептилию с ${num2str(selected_morphs.length, ['морфой', 'морффми'])} ${selected_morphs.map((item) => compareMorph(item.trait_title, item.gene_title))} | Breeders Zone`
                    }
                />
            </Head>
            <ProductList products={props.products.data} meta={props.products.meta}/>
        </Container>
    )
};

export const getServerSideProps = async (ctx: NextPageContext) => {
    const dataService = await new DataService();
    const {query} = await ctx;
    const products = await dataService.getProducts({}, qs.stringify(query));

    return {
        props: {
            products: products
        }
    }
};
