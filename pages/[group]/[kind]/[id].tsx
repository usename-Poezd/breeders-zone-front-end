import {ProductPage} from "../../../components/pages";
import {DataService} from "../../../services";
import Error from '../../_error';
import React from "react";
import {NextPageContext} from "next";
import {IProduct} from "../../../types";

export default ({product, statusCode}: {
    product: IProduct
    statusCode: number
}) => {
    if (statusCode && statusCode !== 200) {
        return <Error statusCode={statusCode}/>;
    }

    return <ProductPage product={product}/>
};

export const getServerSideProps = async (ctx: NextPageContext) => {
    try {
        const dataService = await new DataService();
        const {data: product} = await dataService.getProduct(String(ctx.query.id), false, ctx);

        return {
            props: {
                statusCode: 200,
                product
            }
        }
    } catch (e) {
        if (ctx.res) {
            ctx.res.statusCode = e.response.status;
        }
        return {
            props: {
                statusCode: e.response.status
            }
        };
    }
};
