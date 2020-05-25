import React, {useState} from 'react';
import {Spinner as BootstrapSpinner} from "react-bootstrap";
import { Pipes } from '../../services';
import Link from "next/link";
import {setActiveKind} from "../../actions";
import {connect} from "react-redux";

const ShopMorphs = ({kinds, morphs, groupAndKindUrl, shopName, activeTab, onTab, loadingMorphs, setActiveKind}) => {

    const pipes = new Pipes();

    return (
        <React.Fragment>
            <h2 className="shop-title">Морфы:</h2>
            <div className="shop-container shop-morphs">
                <nav className="d-flex shop-morphs-nav">
                    <ul className="morph-list">
                        {
                            kinds.map( ({ title_rus }, idx) => (
                                <li
                                    className={`morph-list-item h3 ` + (activeTab === idx ? 'active' : '')}
                                    onClick={ () => onTab(idx)}
                                >
                                    {title_rus}
                                </li>
                            ))
                        }
                    </ul>
                </nav>
                <div className="morphs">
                    {
                        morphs.length === 0 && loadingMorphs ?
                            <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                            : null
                    }
                    {
                        morphs.length === 0 && !loadingMorphs ?
                            <p className="m-auto">Похоже отдельный морф нет, <Link href="/[group]/[kind]" as={`/${kinds[activeTab].group}/${pipes.toUrl(kinds[activeTab].title_eng)}?shop=${shopName}`}><a>но вы можете посмотреть всех животный с данной категорией у данного заводчика</a></Link></p>
                            : null
                    }
                    {
                        loadingMorphs && morphs.length > 0  ?
                            (
                                <div className="load">
                                    <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                                </div>
                            ) : null
                    }
                    {
                        morphs.map( ({ traitTitle, geneTitle, type }) => (
                            <Link
                                href="/[group]/[kind]/genes/[morph]"
                                as={`${groupAndKindUrl}/genes/${pipes.toUrl(`${traitTitle}-${geneTitle}`)}?shop=${pipes.toUrl(shopName)}`}
                            >
                                <a
                                    className={`morph-indicator d-inline-block morph-${type}-${pipes.toTraitClass(traitTitle)}`}
                                    onClick={() => setActiveKind(kinds[activeTab])}
                                >
                                    {traitTitle} {geneTitle}
                                </a>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </React.Fragment>
    );
};

export default connect(null, {setActiveKind})(ShopMorphs);