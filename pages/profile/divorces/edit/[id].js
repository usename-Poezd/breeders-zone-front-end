import React from "react";
import Error from "../../../_error";
import {DivorceEditPage} from "../../../../components/pages";
import DataService from "../../../../services/DataService";
import {serverRedirect} from "../../../../utils";

export default ({divorceSSR, statusCode}) => {
    if (statusCode && statusCode !== 200) {
        return <Error statusCode={statusCode}/>
    }

    return <DivorceEditPage divorceSSR={divorceSSR}/>
}

export const getServerSideProps = async (ctx) => {
    try {
        serverRedirect(ctx);
        const dataService = await new DataService();
        const divorceSSR = await dataService.getDivorce(ctx.query.id, true, ctx);

        return {
            props: {
                statusCode: 200,
                divorceSSR
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
