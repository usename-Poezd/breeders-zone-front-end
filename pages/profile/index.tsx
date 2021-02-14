import React from "react";
import {Container} from "react-bootstrap";
import Head from "next/head";
import {serverRedirect} from "../../utils";
import {wrapper} from "../../redux/store";
import {UserProfile} from "../../Profile";


const ProfilePage = () => {
    return (
        <Container>
            <Head>
                <title>Профиль | Breeders Zone</title>
            </Head>
            <UserProfile/>
        </Container>
    )
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
    serverRedirect(ctx);
});

export default ProfilePage;
