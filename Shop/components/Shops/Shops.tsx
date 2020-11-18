import * as React from "react";
import {FC, useEffect, useState} from "react";
import {Col, Container, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCar, faHelicopter, faTruck} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {useRouter} from "next/router";
import {connect} from "react-redux";
import Pagination from "../../../components/pagination";
import Head from "next/head";
import {IRootState} from "../../../redux/store";
import {IShopsStateProps, ShopsPropsType} from "./types";
import {Formik, Form as FormikForm, Field, FormikProps} from "formik";
import {FormInput} from "../../../components/Form/components/FormInput";

const qs = require('qs');

const initialValues = {
    q: ''
};

const ShopsComponent: FC<ShopsPropsType> = (props) => {
    const [request, setRequest] = useState(false);
    const {shops, activeKind} = props;
    const {meta, data} = shops;

    const router = useRouter();

    useEffect(() => {
        if (request === true) {
            setRequest(false)
        }
    }, [shops]);

    const onSubmit = (data: typeof initialValues) => {
        const {search: routerSearch} = props;
        const query = qs.parse(routerSearch.replace('?', ''));
        setRequest(true);
        query.q = data.q;
        router.push('/shops?' + qs.stringify(query));
    };

    return (
        <React.Fragment>
            <Head>
                <title>Заводчики {activeKind ? ` в категории ${activeKind.title_rus} (${activeKind.title_eng})` : ''} | Breeders Zone</title>
                <meta
                    name="description"
                    content={`Более сотни заводчиков рептилий ${activeKind ? ` в категории ${activeKind.title_rus} (${activeKind.title_eng})` : ''} в России | Breeders Zone`}
                />
            </Head>
            <Container>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                >
                    {
                        ({submitForm}: FormikProps<any>) => (
                            <FormikForm className="dashboard-filter d-flex justify-content-center">
                                <div className="dashboard-search-container">
                                    <Field name="q" group={false} className="dashboard-search feather-shadow" placeholder="Поиск..." component={FormInput}/>
                                    <img src="/images/search_alt.svg" alt="" className="search-btn" onClick={() => submitForm()}/>
                                </div>
                            </FormikForm>
                        )
                    }
                </Formik>
                <Row className="position-relative">
                    {
                        data.length === 0 ?
                            <Col xs={12} className="d-flex flex-column justify-content-center m-auto">
                                <img src="/images/icons/error-snake.svg" alt="Пока что нет активных категорий"/>
                                <h1 className="text-center">Похоже магазинов{activeKind ? ` в категории ${activeKind.title_rus} ` : ' '}нет</h1>
                            </Col>
                            : null
                    }
                    {
                        request &&
                            <div className="load">
                                <BootstrapSpinner animation="border" className="m-auto"/>
                            </div>
                    }
                    {
                        data.map( (item) => (
                            <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="item">
                                <div className="list-item">
                                    <div className="item-body">
                                        <Link href="/shops/[shopName]" as={`/shops/${item.company_name}`}>
                                            <a className="item-img">
                                                <img src={item.logo_img_url ? item.logo_img_url : '/images/icons/error-snake.svg'} alt={item.company_name} className="img-fluid"/>
                                            </a>
                                        </Link>
                                        <div className="item-info">
                                            <Link href="/shops/[shopName]" as={`/shops/${item.company_name}`}>
                                                <a className="item-title text-center text-decoration-none mb-2">
                                                    <h3>{item.company_name}</h3>
                                                    <p>{item.owner} ({item.products_count})</p>
                                                </a>
                                            </Link>
                                            <div className="item-info-container d-flex justify-content-center align-items-center">
                                                <div className="cb-and-raiting">
                                                    <div className="delivery info d-flex">
                                                        {
                                                            item.local_delivery ?
                                                                (
                                                                    <div className="delivery-item mr-1">
                                                                        <FontAwesomeIcon icon={faCar} size="lg"/>
                                                                    </div>
                                                                ) : null
                                                        }

                                                        {
                                                            item.regional_delivery ?
                                                                (
                                                                    <div className="delivery-item mr-1">
                                                                        <FontAwesomeIcon icon={faTruck} size="lg"/>
                                                                    </div>
                                                                ) : null
                                                        }

                                                        {
                                                            item.countrywide_delivery ?
                                                                (
                                                                    <div className="delivery-item">
                                                                        <FontAwesomeIcon icon={faHelicopter} size="lg"/>
                                                                    </div>
                                                                ) : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
                {
                    meta.last_page !== 1 ?
                        <Pagination className="d-flex justify-content-center mb-2" totalItems={meta.last_page} pageSize={1} defaultActivePage={meta.current_page} changeRequest={() => console.log('any')}/>
                        : null
                }
            </Container>
        </React.Fragment>
    )
};

const mapStateToProps = ({router: {location: {search, pathname}}, kinds: {activeKind}}: IRootState): IShopsStateProps => ({
    search,
    pathname,
    activeKind
});

const Shops = connect(mapStateToProps)(ShopsComponent);

export {
    Shops
}
