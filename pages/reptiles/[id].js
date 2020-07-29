import {ProductPage} from "../../components/pages";
import {DataService} from "../../services";
import Error from "../_error";
import React from "react";

export default ({product, statusCode}) => {
    if (statusCode && statusCode !== 200) {
        return <Error statusCode={statusCode}/>;
    }

    return <ProductPage product={product}/>
};

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const product = await dataService.getProduct(ctx.query.id, true);

    return {
        props: {
            product
        }
    }
};
