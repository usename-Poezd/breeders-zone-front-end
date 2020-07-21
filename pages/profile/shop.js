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

export const getServerSideProps = wrapper.getStaticProps(async ({store}) => {
    if(store.getState().countries.all.length === 0) {
        const dataService = await new DataService();
        const data = await dataService.getCountries();
        store.dispatch(setCountries(data))
    }
});

export default ShopProfilePage;