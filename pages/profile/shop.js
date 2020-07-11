import React from "react";
import {Container} from "react-bootstrap";
import Header from "../../components/header/header";
import ShopProfile from "../../components/shop-profile";
import wrapper from "../../store";
import {DataService} from "../../services";
import {setCountries} from "../../actions";

const ShopProfilePage = (props) => {
    return (
        <Container>
            <ShopProfile/>
        </Container>
    )
};

export const getStaticProps = wrapper.getStaticProps(async ({store}) => {
    const dataService = await new DataService();
    const data = await dataService.getCountries();
    store.dispatch(setCountries(data))
});

export default ShopProfilePage;