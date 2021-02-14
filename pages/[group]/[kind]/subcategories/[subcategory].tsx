import {Container} from "react-bootstrap";
import {DataService} from "../../../../services";
import React from "react";
import Head from "next/head";
import {connect} from "react-redux";
import {ProductList} from "../../../../components/ProductList";
import {IRootState, wrapper} from "../../../../redux/store";
import {IKind, ProductsPagePropsType} from "../../../../types";
import {serverSetKinds} from "../../../../utils";

const qs = require('qs');

interface ISubcategoriesStateProps {
    activeKind: IKind|null
}

const mapStateToProps = ({kinds: {activeKind}}: IRootState): ISubcategoriesStateProps => ({
    activeKind
});

export default connect(mapStateToProps)(
    ({products, activeKind}: ProductsPagePropsType & ISubcategoriesStateProps) => {

        return (
            <React.Fragment>
                <Head>
                    <title>Животные в подкатегории {products.meta.selected_subcategory ? products.meta.selected_subcategory.title : null} | {activeKind?.title_rus}  ({activeKind?.title_eng}) | Breeders Zone</title>
                </Head>
                <Container>
                    <ProductList products={products.data} meta={products.meta}/>
                </Container>
            </React.Fragment>
        )
    }
);

export const getServerSideProps = wrapper.getServerSideProps( async (ctx) => {
    const dataService = await new DataService();
    const {query} = await ctx;
    await serverSetKinds(ctx, true);
    const products = await dataService.getProducts({}, qs.stringify(query));

    return {
        props: {
            products
        }
    }
});
