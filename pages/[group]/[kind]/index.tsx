import {Container} from "react-bootstrap";
import {DataService} from "../../../services";
import React from "react";
import Head from "next/head";
import {connect} from "react-redux";
import {compareMorph, num2str, serverSetKinds} from "../../../utils";
import Error from "../../_error";
import {IKind, ProductsPagePropsType} from "../../../types";
import {IRootState, wrapper} from "../../../redux/store";
import {ProductList} from "../../../components/ProductList";

const qs = require('qs');

interface IKindPageStateProps {
    activeKind: IKind|null
}

const mapStateToProps = ({kinds: {activeKind}}: IRootState): IKindPageStateProps => ({
    activeKind
});

export default connect(mapStateToProps)(
    ({activeKind, products, statusCode}: ProductsPagePropsType & IKindPageStateProps) => {
        if (statusCode && statusCode !== 200) {
            return <Error statusCode={statusCode}/>;
        }

        const {meta: {selected_morphs}} = products;

        return (
            <React.Fragment>
                <Head>
                    <title>
                        {
                            selected_morphs && selected_morphs.length === 0 ?
                                `Животные в категории ${activeKind?.title_rus}  (${activeKind?.title_eng}) | Breeders Zone`
                                : `${num2str(selected_morphs.length, ['Морфа', 'Морфы'])} ${selected_morphs.map( ({gene_title, trait_title}) => ` ${trait_title ? compareMorph(trait_title, gene_title) : gene_title}`)}в категории ${activeKind?.title_rus}  (${activeKind?.title_eng}) купить | Breeders Zone`
                        }
                    </title>
                    <meta
                        name="description"
                        content={
                            selected_morphs && selected_morphs.length === 0 ?
                                `Купить рептилию в категории ${activeKind?.title_rus}  (${activeKind?.title_eng})`
                                : `Купить рептилию с ${num2str(selected_morphs.length, ['морфой', 'морффми'])} ${selected_morphs.map( ({gene_title, trait_title}) => ` ${trait_title ? compareMorph(trait_title, gene_title) : gene_title}`)}в категории ${activeKind?.title_rus}  (${activeKind?.title_eng})`
                        }
                    />
                </Head>
                <Container>
                    <ProductList products={products.data} meta={products.meta}/>
                </Container>
            </React.Fragment>
        )
    }
)
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
