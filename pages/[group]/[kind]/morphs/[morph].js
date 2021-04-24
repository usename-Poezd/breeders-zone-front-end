import {Container} from "react-bootstrap";
import TraitItems from "../../../../components/traits-list";
import {DataService} from "../../../../services";
import React from "react";
import Head from "next/head";
import {useSelector} from "react-redux";
const qs = require('qs');

const MorphsPage = (props) => {
    const activeKind = useSelector(state => state.kinds.activeKind);
    return (
        <React.Fragment>
            <Head>
                <title>
                    {
                        activeKind ?
                            activeKind.title_rus
                            : 'Животные'
                    }
                    {' с морофой'}
                    {
                        props.selectedMorphs.map( ({geneTitle, traitTitle}) => ` ${traitTitle && traitTitle !== 'Normal' && traitTitle !== 'Visual' ? traitTitle + ' ' : ''}${geneTitle}`)
                    }
                    {' — купить в интернет-магазине Breeders Zone'}
                </title>
            </Head>
            <Container as="section">
                <TraitItems {...props}/>
            </Container>
        </React.Fragment>
    )
};

export default MorphsPage;

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const {query} = await ctx;
    const { morph } = await query;

    const regex = /(het|possible-het|possible|visual|normal|super)?-?(.+)/gmi;
    const regExpExecArray = regex.exec(morph);

    const options = {
        geneTitle: regExpExecArray[2]
    };

    if (typeof regExpExecArray[1] !== 'undefined') {
        options.traitTitle = regExpExecArray[1];
    }

    const props = await dataService.getProducts(options, qs.stringify(query));

    return {
        props: {
            ...props
        }
    }
};
