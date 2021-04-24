import {ProductPage} from "../../../components/pages";
import {DataService} from "../../../services";
import Error from '../../_error';
import React from "react";
import {prepareSeo} from "../../../utils";
import {setSeo} from "../../../actions";
import wrapper from "../../../store";

export default ({product, statusCode}) => {
    if (statusCode && statusCode !== 200) {
        return <Error statusCode={statusCode}/>;
    }

    return <ProductPage product={product}/>
};

export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
    try {
        const dataService = await new DataService();
        const product = await dataService.getProduct(ctx.query.id);
        ctx.store.dispatch(setSeo(prepareSeo(product.seo)));

        return {
            props: {
                statusCode: 200,
                product
            }
        }
    } catch (e) {
        ctx.res.statusCode = e.response.status;
        return {
            props: {
                statusCode: e.response.status
            }
        };
    }
});
