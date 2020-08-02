import React from "react";
import {Container} from "react-bootstrap";
import Header from "../../../components/header/header";
import Head from "next/head";
import ShopDivorces from "../../../components/shop-divorces/shop-divorces";
import {serverRedirect} from "../../../utils";

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

export const getServerSideProps = (ctx) => {
    serverRedirect(ctx);

    return {
        props: {}
    }
};

export default DivorcesPage;
