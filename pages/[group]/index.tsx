import {Container} from "react-bootstrap";
import {DataService} from "../../services";
import React from "react";
import Head from "next/head";
import {compareMorph, num2str, serverSetKinds, ucFirst} from "../../utils";
import Error from "../_error";
import {wrapper} from "../../redux/store";
import {ProductsPagePropsType} from "../../types";
import {useRouter} from "next/router";
import {ProductList} from "../../components/ProductList";

const qs = require('qs');

export default ({ products , statusCode}: ProductsPagePropsType) => {
    if (statusCode && statusCode !== 200) {
        return <Error statusCode={statusCode}/>;
    }

    const {meta: {selected_morphs}} = products;
    const router = useRouter();

    return (
        <React.Fragment>
            <Head>
                <title>
                    {
                        selected_morphs && selected_morphs.length === 0 ?
                            `Животные в группе ${ucFirst(router.query.group)} | Breeders Zone`
                            : `${num2str(selected_morphs.length, ['Морфа', 'Морфы'])} ${selected_morphs.map( ({gene_title, trait_title}) => ` ${trait_title ? compareMorph(trait_title, gene_title) : gene_title}`)}в группе ${ucFirst(router.query.group)} купить | Breeders Zone`
                    }
                </title>
                <meta
                    name="description"
                    content={
                        selected_morphs && selected_morphs.length === 0 ?
                            `Купить рептилию в группе ${ucFirst(router.query.group)}`
                            : `Купить рептилию с ${num2str(selected_morphs.length, ['морфой', 'морффми'])} ${selected_morphs.map( ({gene_title, trait_title}) => ` ${trait_title ? compareMorph(trait_title, gene_title) : gene_title}`)}в группе ${ucFirst(router.query.group)}`
                    }
                />
            </Head>
            <Container>
                <ProductList products={products.data} meta={products.meta}/>
            </Container>
        </React.Fragment>
    )
}
export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
    try {
        const dataService = await new DataService();
        const {query} = await ctx;
        const products = await dataService.getProducts({}, qs.stringify(query));

        await serverSetKinds(ctx, true);

        return {
            props: {
                products
            }
        }
    } catch (e) {
        ctx.res.statusCode = e.response.status;

        if (e.response.status === 422) {
            ctx.res.setHeader("location", "/");
            ctx.res.statusCode = 301;
            ctx.res.end();
        }
        return {
            props: {
                statusCode: e.response.status
            }
        };
    }
});
