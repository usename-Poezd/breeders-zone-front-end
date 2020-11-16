import React, {FC} from "react";
import {Container} from "react-bootstrap";
import TraitItems from "../components/traits-list";
import {DataService} from "../services";
import Head from "next/head";
import {ProductList} from "../components/ProductList";
import {GetProductsDataType} from "../types";
const qs = require('qs');

type SearchPagePropsType = {
    products: GetProductsDataType
}

const SearchPage: FC<SearchPagePropsType> = ({products}) => {
    return (
        <Container>
            <Head>
                <title>Поиск | Breeders Zone</title>
                <meta name="description" content="Breeders Zone это маркетплейс где вы можете бысто найти и продать животное, больше никаних групп и форумов, все в одном месте"/>
            </Head>
            <ProductList products={products.data} meta={products.meta}/>
        </Container>
    )
};

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const {query} = await ctx;
    const products = await dataService.getProducts(query);
    return {
        props: {products}
    }
};

export default SearchPage;
