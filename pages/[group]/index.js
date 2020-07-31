import {Container} from "react-bootstrap";
import TraitItems from "../../components/traits-list";
import {DataService} from "../../services";
import React from "react";
import Head from "next/head";
import {num2str, ucFirst} from "../../utils";
import {withRouter} from "next/router";
import Error from "../_error";

const qs = require('qs');

export default withRouter(({ products, router, statusCode}) => {
    if (statusCode && statusCode !== 200) {
        return <Error statusCode={statusCode}/>;
    }

    const {selectedMorphs} = products;
    return (
        <React.Fragment>
            <Head>
                <title>
                    {
                        selectedMorphs.length === 0 ?
                            `Животные в группе ${ucFirst(router.query.group)} | Breeders Zone`
                            : `${num2str(selectedMorphs.length, ['Морфа', 'Морфы'])} ${selectedMorphs.map((item) => `${item.traitTitle === 'Normal' || item.traitTitle === 'Visual' ? `${item.geneTitle}, ` : `${item.traitTitle} ${item.geneTitle}, `}`)}в группе ${ucFirst(router.query.group)} купить | Breeders Zone`
                    }
                </title>
                <meta
                    name="description"
                    content={
                        selectedMorphs.length === 0 ?
                            `Купить рептилию в группе ${ucFirst(router.query.group)}`
                            : `Купить рептилию с ${num2str(selectedMorphs.length, ['морфой', 'морффми'])} ${selectedMorphs.map((item) => `${item.traitTitle === 'Normal' || item.traitTitle === 'Visual' ? `${item.geneTitle}, ` : `${item.traitTitle} ${item.geneTitle}, `}`)}в группе ${ucFirst(router.query.group)}`
                    }
                />
            </Head>
            <Container>
                <TraitItems {...products}/>
            </Container>
        </React.Fragment>
    )
})
export const getServerSideProps = async (ctx) => {
    try {
        const dataService = await new DataService();
        const {query} = await ctx;
        const products = await dataService.getProducts({}, qs.stringify(query));

        return {
            props: {
                products
            }
        }
    } catch (e) {
        ctx.res.statusCode = e.response.status;
        return {
            props: {
                statusCode: e.response.status
            }
        };
    }
};
