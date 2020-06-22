import {DataService} from "../../../services";
import Error from "../../_error";
import {ProductEditPage} from "../../../components/pages";
import React from "react";

export default ({productSSR, statusCode}) => {
    if (statusCode && statusCode !== 200) {
        return <Error statusCode={statusCode}/>
    }

    return <ProductEditPage productSSR={productSSR}/>
}

export const getServerSideProps = async (ctx) => {
    try {
        const dataService = await new DataService();
        const productSSR = await dataService.getProduct(ctx.query.id, true, ctx);

        return {
            props: {
                statusCode: 200,
                productSSR
            }
        }
    } catch (error) {
        ctx.res.statusCode = error.response.status;
        return {
            props: {
                statusCode: error.response.status
            }
        };
    }
};
