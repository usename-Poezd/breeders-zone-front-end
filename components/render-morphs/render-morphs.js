import React from 'react';
import Link from "next/link";
import { Col } from 'react-bootstrap';
import {Pipes} from "../../services";
import {withRouter} from "next/router";

const RenderMorphs = ({ title, traits, router: { query: { group, kind } } }) => {
    const {toUrl} = new Pipes();
    return (
        <Col xs={12} sm={6} md={4} lg={3} className="morph-item d-flex justify-content-between align-items-start">
            <Link href="/[group]/[kind]/genes/[morph]" as={`/${group}/${kind}/genes/${toUrl(title)}`}>
                <a className="morph-title">
                    {title}
                </a>
            </Link>
            <div className="morph-counts">
                {
                    traits.map( ({title: traitTitle, type, count}) => {
                        if(count > 0) {
                            return (
                                <Link key={title + '-' + traitTitle} href="/[group]/[kind]/genes/[morph]"
                                      as={`/${group}/${kind}/genes/${toUrl(`${traitTitle}-${title}`)}`}>
                                    <a className={`morph-indicator-count morph-${toUrl(type + '-' + traitTitle)}`}>
                                        <span>{count}</span>
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

export default withRouter(RenderMorphs);
