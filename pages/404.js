import React from "react";
import {Container} from "react-bootstrap";

export default () => {
    return (
        <Container>
            <div className="feather-shadow p-4 mt-4">
                <h1 className="text-center">404</h1>
                <h3 className="text-center">Упс... таой страницы не существует</h3>
            </div>
        </Container>
    )
}