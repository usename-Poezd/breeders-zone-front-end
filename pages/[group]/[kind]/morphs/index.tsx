import React from "react";
import {Container} from "react-bootstrap";
import {Morphs} from "../../../../Morphs";
import {DataService} from "../../../../services";
import Head from "next/head";
import {connect} from "react-redux";
import Error from "../../../_error";
import {setActiveKind, setKinds} from "../../../../redux/Kinds";
import {toUrl} from "../../../../utils";
import {wrapper} from "../../../../redux/store";

const MorphsPage = ({morphs, activeKind, statusCode}) => {
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
        const dataService = await new DataService();

        const {data} = await dataService.getKinds();
        ctx.store.dispatch(setKinds(data));

        const state = await ctx.store.getState();

        const activeKind = await state.kinds.all.find((item) => toUrl(item.title_eng) === toUrl(String(kind)));
        if (activeKind)
            ctx.store.dispatch(setActiveKind(activeKind));


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

const mapStateToProps = ({kinds: {activeKind}}) => ({
    activeKind
});

export default  connect(mapStateToProps)(MorphsPage);
