import React, {Component} from "react";
import {Container} from "react-bootstrap";
import ShopProducts from "../../components/shop-products";
import Head from "next/head";
import {serverRedirect} from "../../utils";

const ProductsPage = () => {
    return (
        <React.Fragment>
            <Head>
                <title>Мои товары | Breeders Zone</title>
            </Head>
            <Container>
                <ShopProducts/>
            </Container>
        </React.Fragment>
    );
};

export const getServerSideProps = (ctx) => {
    serverRedirect(ctx);

    return {
        props: {}
    }
};

export default ProductsPage;
