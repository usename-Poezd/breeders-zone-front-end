import React, {FC} from "react";
import {DataService} from "../../services";
import {ApiSuccessReturnType, IShop} from "../../types";
import {Shops} from "../../Shop";
const qs = require('qs');

const ShopsPage: FC<{
    shops: ApiSuccessReturnType<Array<IShop>>
}> = (props) => <Shops shops={props.shops}/>;

export const getServerSideProps = async (ctx) => {
    const  dataService = await new DataService();
    const shops = await dataService.getShops(ctx.query);

    return {
        props: {
            shops
        }
    }
};

export default ShopsPage;
