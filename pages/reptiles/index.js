import {Container} from "react-bootstrap";
import TraitItems from "../../components/traits-list";
import {DataService} from "../../services";
import React from "react";
import {num2str} from "../../utils";
import Head from "next/head";

const qs = require('qs');

export default (props) => {
    const {selectedMorphs = []} = props;
    return (
        <Container>
            <Head>
                <title>
                    {
                        selectedMorphs && selectedMorphs.length === 0 ?
                            `Рептилии | Breeders Zone`
                            : `${num2str(selectedMorphs.length, ['Морфа', 'Морфы'])} ${selectedMorphs.map((item) => `${item.traitTitle === 'Normal' || item.traitTitle === 'Visual' ? `${item.geneTitle}, ` : `${item.traitTitle} ${item.geneTitle}, `}`)} | Breeders Zone`
                    }
                </title>
                <meta
                    name="description"
                    content={
                        selectedMorphs && selectedMorphs.length === 0 ?
                            `Быстро купить рептилию | Breeders Zone`
                            : `Купить рептилию с ${num2str(selectedMorphs.length, ['морфой', 'морффми'])} ${selectedMorphs.map((item) => `${item.traitTitle === 'Normal' || item.traitTitle === 'Visual' ? `${item.geneTitle}, ` : `${item.traitTitle} ${item.geneTitle}, `}`)}`
                    }
                />
            </Head>
            <TraitItems {...props}/>
        </Container>
    )
};

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const {query} = await ctx;
    const props = await dataService.getProducts({}, qs.stringify(query));

    return {
        props: {
            ...props
        }
    }
};
