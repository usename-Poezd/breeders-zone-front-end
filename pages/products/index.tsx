import React from "react";
import {Container} from "react-bootstrap";
import {ShopProducts} from "../../Shop";
import Head from "next/head";
import {serverRedirect} from "../../utils";
import {DataService} from "../../services";
import {wrapper} from "../../redux/store";
import {setShopProducts} from "../../redux/Shop";

const ShopProductsPage = () => {
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

export default ShopProductsPage;

export const getServerSideProps = wrapper.getServerSideProps( async (ctx) => {
    serverRedirect(ctx);
    const dataService = new DataService();
    const data = await dataService.getShopProducts(ctx.query, ctx);
    console.log(ctx.req.url);

    ctx.store.dispatch(setShopProducts(data));
});
