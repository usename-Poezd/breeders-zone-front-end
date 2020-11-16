import React from "react";
import {DataService} from "../../services";
import {Shop} from "../../Shop";
export default (props) => <Shop {...props}/>;

export const getServerSideProps = async (ctx) => {
    try {
        const dataService = await new DataService();
        const {shopName} = await ctx.query;
        const {data: shop} = await dataService.getShop(shopName);


        return {
            props: {
                statusCode: 200,
                shop
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
