import React from "react";
import {Container} from "react-bootstrap";
import Profile from "../../components/profile";
import Head from "next/head";
import {serverRedirect} from "../../utils";


const ProfilePage = (props) => {
    return (
        <Container>
            <Head>
                <title>Профиль | Breeders Zone</title>
            </Head>
            <Profile/>
        </Container>
    )
};

export const getServerSideProps = (ctx) => {
    serverRedirect(ctx);

    return {
        props: {}
    }
};

export default ProfilePage;
