import {Container} from "react-bootstrap";
import TraitItems from "../../../components/traits-list";
import {DataService} from "../../../services";
import React from "react";
import Head from "next/head";
import {connect} from "react-redux";
import {num2str} from "../../../utils";
import Error from "../../_error";

const qs = require('qs');


const mapStateToProps = ({kinds: {activeKind}}) => ({
    activeKind
});

export default connect(mapStateToProps)(
    ({products = {selectedMorphs: []}, statusCode}) => {
        if (statusCode && statusCode !== 200) {
            return <Error statusCode={statusCode}/>;
        }
        return (
            <React.Fragment>
                <Container as="section">
                    <TraitItems {...products}/>
                </Container>
            </React.Fragment>
        )
    }
)
export const getServerSideProps = async (ctx) => {
    try {
        const dataService = await new DataService();
        const {query} = await ctx;
        const products = await dataService.getProducts({}, qs.stringify(query));

        return {
            props: {
                statusCode: 200,
                products
            }
        }
    } catch (e) {
        ctx.res.statusCode = e.response.status;

        if (e.response.status === 422) {
            ctx.res.setHeader("location", "/");
            ctx.res.statusCode = 301;
            ctx.res.end();
        }

        return {
            props: {
                statusCode: e.response.status
            }
        };
    }
};
