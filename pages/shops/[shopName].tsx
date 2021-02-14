import React from "react";
import {DataService} from "../../services";
import {Shop} from "../../Shop";
import {NextPageContext} from "next";
export default (props: any) => <Shop {...props}/>;

export const getServerSideProps = async (ctx: NextPageContext) => {
    try {
        const dataService = await new DataService();
        const {shopName} = await ctx.query;
        const {data: shop} = await dataService.getShop(String(shopName));


        return {
            props: {
                statusCode: 200,
                shop
            }
        }
    } catch (error) {
        if (ctx.res) {
            ctx.res.statusCode = error.response.status;
            return {
                props: {
                    statusCode: error.response.status
                }
            };
        }
    }
};
