import React, {Component} from "react";
import {Container} from "react-bootstrap";
import Header from "../../components/header/header";
import ShopProducts from "../../components/shop-products";
import Head from "next/head";
import Link from "next/link";

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


export default ProductsPage;
