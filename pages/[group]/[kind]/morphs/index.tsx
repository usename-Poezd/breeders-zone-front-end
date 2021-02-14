import React, {FC} from "react";
import {Container} from "react-bootstrap";
import {Morphs} from "../../../../Morphs";
import {DataService} from "../../../../services";
import Head from "next/head";
import {connect} from "react-redux";
import Error from "../../../_error";
import {serverSetKinds} from "../../../../utils";
import {IRootState, wrapper} from "../../../../redux/store";
import {IGene, IKind, ISubcategory} from "../../../../types";

type MorphsPagePropsType = {
    morphs: {
        genes: Array<IGene & {
            traits: Array<{
                title: string
                label?: string
                type: string
                products_count: number
            }>
        }>
        subcategories: Array<ISubcategory & {
            products_count: number
        }>
    }
    activeKind: IKind
    statusCode: number
}

const MorphsPage: FC<MorphsPagePropsType> = ({morphs, activeKind, statusCode}) => {
    if (statusCode && statusCode !== 200) {
        return <Error statusCode={statusCode}/>
    }

    return (
        <React.Fragment>
            <Head>
                <title>Морфы {activeKind.title_rus}  ({activeKind.title_eng}) | Breeders Zone</title>
            </Head>
            <Container className="body-container">
                <Morphs morphs={morphs}/>
            </Container>
        </React.Fragment>
    )
};

export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
    try {
        const { kind } = await ctx.query;
        const dataService = new DataService();
        await serverSetKinds(ctx, true);


        const {data: morphs} = await dataService.getActiveProps(String(kind));

        return {
            props: {
                statusCode: 200,
                morphs
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
});

const mapStateToProps = ({kinds: {activeKind}}: IRootState) => ({
    activeKind
});

export default  connect(mapStateToProps)(MorphsPage);
