import React from "react";
import Header from "../components/header";
import {Container} from "react-bootstrap";
import Chat from "../components/chat";

const ChatPage = (props) => {
    return (
        <Container>
            <Chat/>
        </Container>
    );
};

export default ChatPage;