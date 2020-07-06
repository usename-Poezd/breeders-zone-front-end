import React from "react";
import {Container} from "react-bootstrap";

export default () => {
    return (
        <Container>
            <div className="feather-shadow p-4 mt-4">
                <h1 className="text-center">404</h1>
                <p className="text-center">Упс... такой страницы не существует</p>
            </div>
        </Container>
    )
}