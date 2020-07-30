import React from "react";
import Header from "../components/header";
import {Container} from "react-bootstrap";
import Chat from "../components/chat";
import Head from "next/head";

const ChatPage = (props) => {
    return (
        <Container>
            <Head>
                <title>Чат | Breeders Zone</title>
            </Head>
            <Chat/>
        </Container>
    );
};

export default ChatPage;
