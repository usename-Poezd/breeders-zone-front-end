import React, {FC} from 'react';
import Link from "next/link";
import { Col } from 'react-bootstrap';
import {useRouter} from "next/router";
import {toUrl} from "../../../utils";
import {IMorphsItemProps} from "./types";

const MorphsItem: FC<IMorphsItemProps> = ({ title, traits}) => {
    const { query: { group, kind } } = useRouter();
    return (
        <Col xs={12} sm={6} md={4} lg={3} className="morph-item d-flex justify-content-between align-items-start">
            <Link href="/[group]/[kind]/genes/[geneTitle]" as={`/${group}/${kind}/genes/${toUrl(title)}`}>
                <a className="morph-title">
                    {title}
                </a>
            </Link>
            <div className="morph-counts">
                {
                    traits.map( ({title: traitTitle, label, type, products_count}) => {
                        if(products_count > 0) {
                            return (
                                <Link key={title + '-' + traitTitle} href="/[group]/[kind]/morphs/[morph]"
                                      as={`/${group}/${kind}/morphs/${toUrl(`${label ? label : traitTitle}-${title}`)}`}>
                                    <a className={`morph-indicator-count morph-${toUrl(type) + '-' + toUrl(label ? label : traitTitle)}`}>
                                        <span>{products_count}</span>
                                    </a>
                                </Link>
                            );
                        }
                    })
                }
            </div>
        </Col>
    );
};

export {
    MorphsItem
};
