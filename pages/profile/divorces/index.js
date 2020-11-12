import React from "react";
import {Container} from "react-bootstrap";
import Header from "../../../components/Header/Header";
import Head from "next/head";
import ShopDivorces from "../../../components/shop-divorces/shop-divorces";
import {serverRedirect} from "../../../utils";
import wrapper from "../../../store";
import {DataService} from "../../../services";
import {setShopDivorces} from "../../../redux/actions";

const DivorcesPage = () => {
    return (
        <React.Fragment>
            <Head>
                <title>Мои разводы | Breeders Zone</title>
            </Head>
            <Container>
                <ShopDivorces/>
            </Container>
        </React.Fragment>
    )
};

export const getServerSideProps = wrapper.getServerSideProps( async (ctx) => {
    serverRedirect(ctx);
    const dataService = await new DataService();
    const data = await dataService.getDivorces({...ctx.query, onlyBreeder: true}, '', null, null, ctx);
    ctx.store.dispatch(setShopDivorces(data));
});

export default DivorcesPage;
