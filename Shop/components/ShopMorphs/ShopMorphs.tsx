import * as React from "react";
import {FC, useEffect, useState} from 'react';
import {Spinner as BootstrapSpinner} from "react-bootstrap";
import Link from "next/link";
import {setActiveKind} from "../../../redux/Kinds";
import {compareMorph, toUrl} from "../../../utils";
import {Dropdown, DropdownItem} from "../../../components/Dropdown";
import {useDataService} from "../../../hooks";
import {ShopMorphsType} from "./types";

const ShopMorphs: FC<ShopMorphsType> = (props) => {
    const {kinds, shopName} = props;
    const dataService = useDataService();
    const [morphs, setMorphs] = useState([]);
    const [loadingMorphs, setLoadingMorphs] = useState(false);

    const [isMobile, setIsMobile] = useState(false);

    const [activeTab, setActiveTab] = useState(0);
    const activeKind = kinds[activeTab];

    const onResize = () => {
        if (window.innerWidth < 992) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        if (activeKind) {
            setLoadingMorphs(true);
            dataService.getShopMorphs(shopName, activeKind.id)
                .then(({data}) => {
                    setMorphs(data);
                    setLoadingMorphs(false);
                })
        }
    }, [activeKind]);

    useEffect(() => {
        window.addEventListener('resize', onResize);
        window.addEventListener('load', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('load', onResize);
        }
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
                                            onClick={ () => setActiveTab(idx)}
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
                                                onClick={ () => setActiveTab(idx)}
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
                            <p className="m-auto">Похоже отдельный морф нет, <Link href="/[group]/[kind]" as={`/${activeKind?.group}/${toUrl(activeKind?.title_eng)}?shop=${shopName}`}><a>но вы можете посмотреть всех животный с данной категорией у данного заводчика</a></Link></p>
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
                        morphs.map( ({ trait_title, gene_title, type, label }) => (
                            <Link
                                key={`shop-morph-${trait_title}-${type}-${gene_title}`}
                                href="/[group]/[kind]/morphs/[morph]"
                                as={`${activeKind?.group}/${toUrl(activeKind?.title_eng)}/morphs/${label ? label : trait_title}-${toUrl(gene_title)}?shop=${shopName}`}
                            >
                                <a
                                    className={`morph-indicator d-inline-block morph-${type}-${toUrl(label ? label : trait_title)}`}
                                    onClick={() => setActiveKind(kinds[activeTab])}
                                >
                                    {compareMorph(trait_title, gene_title)}
                                </a>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </React.Fragment>
    );
};

export {
    ShopMorphs
};
