import React, {Component} from "react";
import {Container} from "react-bootstrap";
import ShopProducts from "../../components/shop-products";
import Head from "next/head";
import {serverRedirect} from "../../utils";
import {DataService} from "../../services";
import wrapper from "../../store";
import {setShopProducts} from "../../redux/actions";

export default () => {
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

export const getServerSideProps = wrapper.getServerSideProps( async (ctx) => {
    serverRedirect(ctx);
    const dataService = new DataService();
    const {products} = await dataService.getShopProducts(ctx.query, ctx);

    ctx.store.dispatch(setShopProducts(products));
});
