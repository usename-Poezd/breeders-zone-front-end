import React from "react";
import {Container} from "react-bootstrap";
import Header from "../../components/header/header";
import Profile from "../../components/profile";
import Head from "next/head";


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

export default ProfilePage;
