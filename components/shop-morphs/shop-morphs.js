import React, {useEffect, useState} from 'react';
import {Spinner as BootstrapSpinner} from "react-bootstrap";
import { Pipes } from '../../services';
import Link from "next/link";
import {setActiveKind} from "../../redux/actions";
import {connect} from "react-redux";
import {compareMorph} from "../../utils";
import Dropdown, {DropdownItem} from "../Dropdown";

const ShopMorphs = ({kinds, morphs, groupAndKindUrl, shopName, activeTab, onTab, loadingMorphs, setActiveKind}) => {
    const [isMobile, setIsMobile] = useState(false);
    const pipes = new Pipes();
    const activeKind = kinds.find((item, idx) => activeTab === idx);
    const onResize = () => {
        if (window.innerWidth < 992) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', onResize);
        window.addEventListener('load', onResize)
    });

    return (
        <React.Fragment>
            <h2 className="shop-title">Морфы:</h2>
            <div className="shop-container shop-morphs">
                <nav className="d-flex shop-morphs-nav">
                    {
                        isMobile ?
                            <Dropdown label={activeKind?.title_rus}>
                                {
                                    kinds.map( ({ title_rus }, idx) => (
                                        <DropdownItem
                                            key={"shop-morphs-category-" + idx}
                                            className={`morph-list-item h3 ` + (activeTab === idx ? 'active' : '')}
                                            onClick={ () => onTab(idx)}
                                        >
                                            {title_rus}
                                        </DropdownItem>
                                    ))
                                }
                            </Dropdown>
                            : (
                                <ul className="morph-list">
                                    {
                                        kinds.map( ({ title_rus }, idx) => (
                                            <li
                                                key={"shop-morphs-category-" + idx}
                                                className={`morph-list-item h3 ` + (activeTab === idx ? 'active' : '')}
                                                onClick={ () => onTab(idx)}
                                            >
                                                {title_rus}
                                            </li>
                                        ))
                                    }
                                </ul>
                            )
                    }

                </nav>
                <div className="morphs">
                    {
                        morphs.length === 0 && loadingMorphs ?
                            <BootstrapSpinner animation="border" variant="dark" className="m-auto"/>
                            : null
                    }
                    {
                        morphs.length === 0 && !loadingMorphs ?
                            <p className="m-auto">Похоже отдельный морф нет, <Link href="/[group]/[kind]" as={`/${kinds[activeTab]?.group}/${pipes.toUrl(kinds[activeTab]?.title_eng)}?shop=${shopName}`}><a>но вы можете посмотреть всех животный с данной категорией у данного заводчика</a></Link></p>
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
                        morphs.map( ({ traitTitle, geneTitle, type, label }) => (
                            <Link
                                key={`shop-morph-${traitTitle}-${type}-${geneTitle}`}
                                href="/[group]/[kind]/morphs/[morph]"
                                as={`${groupAndKindUrl}/morphs/${pipes.toUrl(label ? label : traitTitle)}-${pipes.toUrl(geneTitle)}?shop=${shopName}`}
                            >
                                <a
                                    className={`morph-indicator d-inline-block morph-${type}-${pipes.toTraitClass(label ? label : traitTitle)}`}
                                    onClick={() => setActiveKind(kinds[activeTab])}
                                >
                                    {compareMorph(traitTitle, geneTitle)}
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
