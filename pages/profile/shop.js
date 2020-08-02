import React from "react";
import {Container} from "react-bootstrap";
import ShopProfile from "../../components/shop-profile";
import wrapper from "../../store";
import {DataService} from "../../services";
import {setCountries} from "../../actions";
import Head from "next/head";
import {serverRedirect} from "../../utils";

const ShopProfilePage = (props) => {
    return (
        <Container>
            <Head>
                <title>Профиль магазина | Breeders Zone</title>
            </Head>
            <ShopProfile/>
        </Container>
    )
};

export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
    serverRedirect(ctx);
    if(ctx.store.getState().countries.all.length === 0) {
        const dataService = await new DataService();
        const data = await dataService.getCountries();
        ctx.store.dispatch(setCountries(data))
    }
});

export default ShopProfilePage;
