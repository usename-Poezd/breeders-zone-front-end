import {Col, Form, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import React, {FC} from "react";
import {connect} from "react-redux";
import {
    search
} from "../../../../redux/Search";
import {Formik, Form as FormikForm, Field, FormikProps} from "formik";
import {FormSelect} from "../../../Form/components/FormSelect";
import {FormInput} from "../../../Form/components/FormInput";
import {IRootState} from "../../../../redux/store";
import {ISearchDispatchProps, ISearchFormInitialValues, ISearchStateProps, SearchPropsType} from "./types";
import {FormMorphSelect} from "../../../Form/components/FormMorphsSearch";


const SearchComponent: FC<SearchPropsType> = (props) => {
    const {allKinds, isToggle, search, onToggleBurger} = props;

    const initialValues: ISearchFormInitialValues = {
        kind: 'any',
        subcategory: 'any',
        locality: 'any',
        sex: 'any',
        age: 'any',
        price_max: '1000000',
        price_min: '0',
        morphs_max: '9',
        morphs_min: '0',
        morphs_in: [],
        morphs_out: []
    };

    const onSubmit = (data: ISearchFormInitialValues) => {
        search(data);
        onToggleBurger();
    };

    return (
        <Row className={"justify-content-center advance-reducer " + ( !isToggle ? 'hidden' : '')}>
            {
                isToggle &&
                <Col xs={12} md={8}>
                    <div className="form-container mb-4">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={onSubmit}
                        >
                            {
                                (props: FormikProps<ISearchFormInitialValues>) => {
                                    const {kind, subcategory} = props.values;

                                    const selectedKind = allKinds.find((item) => item.id === Number(kind));
                                    const localities = selectedKind?.subcategories && selectedKind.subcategories.find( (item) => item.id === Number(subcategory)) ?
                                        selectedKind?.subcategories.find( (item) => item.id === Number(subcategory)).localities.map( (locality) => ({label: locality.title, value: locality.id}))
                                        : selectedKind?.localities.map( (locality) => ({label: locality.title, value: locality.id}));
                                    return (
                                        <FormikForm>
                                            <Field
                                                id="searchKind"
                                                name="kind"
                                                className="w-100"
                                                label="Категория"
                                                options={[
                                                    {
                                                        label: 'Все',
                                                        value: 'any'
                                                    },
                                                    ...allKinds.map((item) => ({label: item.title_rus, value: item.id}))
                                                ]}
                                                component={FormSelect}
                                            />
                                            {
                                                selectedKind && selectedKind.has_subcategories && selectedKind.subcategories.length > 0 ?
                                                    <Field
                                                        id="searchSubcategory"
                                                        name="subcategory"
                                                        className="w-100"
                                                        label="Выберите подкатегорию"
                                                        options={[
                                                            {
                                                                label: 'Все',
                                                                value: 'any'
                                                            },
                                                            ...selectedKind.subcategories.map((item) => ({label: item.title, value: item.id}))
                                                        ]}
                                                        component={FormSelect}
                                                    />
                                                    : null
                                            }


                                            {
                                                selectedKind && selectedKind.localities.length !== 0 ?
                                                    (
                                                        <Field
                                                            id="searchLocality"
                                                            name="locality"
                                                            className="w-100"
                                                            label="Выберите локалитет"
                                                            options={[
                                                                {
                                                                    label: 'Все',
                                                                    value: 'any'
                                                                },
                                                                ...localities
                                                            ]}
                                                            component={FormSelect}
                                                        />
                                                    ) : null
                                            }


                                            <Row>
                                                <Col xs={6}>
                                                    <Field
                                                        id="searchSex"
                                                        name="sex"
                                                        className="w-100"
                                                        label="Пол"
                                                        options={[
                                                            {
                                                                label: 'Все',
                                                                value: 'any'
                                                            },
                                                            {
                                                                label: 'Самец',
                                                                value: 'male'
                                                            },
                                                            {
                                                                label: 'Самец',
                                                                value: 'female'
                                                            }
                                                        ]}
                                                        component={FormSelect}
                                                    />
                                                </Col>
                                                <Col xs={6}>
                                                    <Field
                                                        id="searchAge"
                                                        name="age"
                                                        className="w-100"
                                                        label="Возраст"
                                                        options={[
                                                            {
                                                                label: 'Любой возраст',
                                                                value: 'any'
                                                            },
                                                            {
                                                                label: 'Junior',
                                                                value: 'junior'
                                                            },
                                                            {
                                                                label: 'Baby',
                                                                value: 'baby'
                                                            },
                                                            {
                                                                label: 'Subadult',
                                                                value: 'subadult'
                                                            },
                                                            {
                                                                label: 'Adult',
                                                                value: 'adult'
                                                            }
                                                        ]}
                                                        component={FormSelect}
                                                    />
                                                </Col>
                                            </Row>

                                            <Form.Group>
                                                <Form.Label>Кол-во морф:</Form.Label>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <Field
                                                        id="searchMorphsMin"
                                                        name="morphs_min"
                                                        className="w-100"
                                                        group={false}
                                                        options={[
                                                            ...Array.from(Array(10).keys()).map((item) => ({
                                                                label: String(item),
                                                                value: String(item)
                                                            })),
                                                        ]}
                                                        component={FormSelect}
                                                    />
                                                    <span className="mx-3">-</span>
                                                    <Field
                                                        id="searchMorphsMax"
                                                        name="morphs_max"
                                                        className="w-100"
                                                        group={false}
                                                        options={[
                                                            ...Array.from(Array(9).keys()).map((item) => ({
                                                                label: String(++item),
                                                                value: String(item)
                                                            })),
                                                        ]}
                                                        component={FormSelect}
                                                    />
                                                </div>
                                            </Form.Group>
                                            <Field
                                                id="searchMorphsIn"
                                                label="Морфы"
                                                name="morphs_in"
                                                className="w-100"
                                                component={FormMorphSelect}
                                            />
                                            <Field
                                                id="searchMorphsOut"
                                                label="За исключением морф"
                                                name="morphs_out"
                                                className="w-100"
                                                component={FormMorphSelect}
                                            />

                                            {/*<Form.Group>*/}
                                            {/*    <Form.Label>Морфы:</Form.Label>*/}
                                            {/*    <div className="morph-search-input">*/}
                                            {/*        <Form.Control*/}
                                            {/*            type="text"*/}
                                            {/*            name="morphIn"*/}
                                            {/*            value={searchMorphInValue}*/}
                                            {/*            onChange={onSearchMorphs}*/}
                                            {/*            onKeyDown={onSelectMorph}*/}
                                            {/*            onFocus={() => setMorphsInShow(true)}*/}
                                            {/*            onBlur={() => setTimeout(() => setMorphsInShow(false), 200)}*/}
                                            {/*        />*/}
                                            {/*        {*/}
                                            {/*            searchMorphsInRequest ?*/}
                                            {/*                <BootstrapSpinner animation="border"/>*/}
                                            {/*                : null*/}
                                            {/*        }*/}
                                            {/*    </div>*/}
                                            {/*    {*/}
                                            {/*        searchMorphResultIn.length && morphsInShow > 0 ?*/}
                                            {/*            (*/}
                                            {/*                <ul className="morphs d-inline-flex flex-column search-morphs" ref={searchList}>*/}
                                            {/*                    {*/}
                                            {/*                        searchMorphResultIn.map( (gene, idx) => (*/}
                                            {/*                            <li*/}
                                            {/*                                key={`${gene.title}-${gene.trait.title}-${gene.id}`}*/}
                                            {/*                                className={"reducer-morphs-item " + (selectMorphIdx === idx ? "selected" : "")}*/}
                                            {/*                                onClick={() => {*/}
                                            {/*                                    setSearchSelectedMorphIn(idx);*/}
                                            {/*                                    clearSearchInput(true);*/}
                                            {/*                                }}*/}
                                            {/*                            >*/}
                                            {/*                                <div className={`morph-indicator morph-${gene.type}-${pipes.toTraitClass(gene.trait.trait_group ? gene.trait.trait_group.label : gene.trait.title)} d-inline-block`}>*/}
                                            {/*                                    {compareMorph(gene.trait.title, gene.title)}*/}
                                            {/*                                </div>*/}
                                            {/*                            </li>*/}
                                            {/*                        ))*/}
                                            {/*                    }*/}
                                            {/*                </ul>*/}
                                            {/*            )*/}
                                            {/*            : null*/}
                                            {/*    }*/}

                                            {/*    <div className="morphs selected-morphs" ref={searchList}>*/}
                                            {/*        {*/}
                                            {/*            morphsIn.map( (gene, idx) => (*/}
                                            {/*                <div*/}
                                            {/*                    key={`morphs-${gene.title}-${gene.trait.title}-${gene.id}`}*/}
                                            {/*                    className={`morph-indicator morph-${gene.type}-${pipes.toTraitClass(gene.trait.trait_group ? gene.trait.trait_group.label : gene.trait.title)} d-inline-block`}*/}
                                            {/*                >*/}
                                            {/*                    {compareMorph(gene.trait.title, gene.title)}*/}
                                            {/*                    <FontAwesomeIcon*/}
                                            {/*                        icon={faTimes}*/}
                                            {/*                        size="lg"*/}
                                            {/*                        onClick={() => deleteSearchMorphIn(idx)}*/}
                                            {/*                        className="pl-1"/>*/}
                                            {/*                </div>*/}
                                            {/*            ))*/}
                                            {/*        }*/}
                                            {/*    </div>*/}
                                            {/*</Form.Group>*/}

                                            {/*<Form.Group>*/}
                                            {/*    <Form.Label>За исключением:</Form.Label>*/}
                                            {/*    <div className="morph-search-input">*/}
                                            {/*        <Form.Control*/}
                                            {/*            type="text"*/}
                                            {/*            name="morphOut"*/}
                                            {/*            value={searchMorphOutValue}*/}
                                            {/*            onChange={(e) => onSearchMorphs(e, false)}*/}
                                            {/*            onKeyDown={(e) => onSelectMorph(e, false)}*/}
                                            {/*            onFocus={() => setMorphsOutShow(true)}*/}
                                            {/*            onBlur={() => setTimeout(() =>setMorphsOutShow(false), 200)}*/}
                                            {/*        />*/}
                                            {/*        {*/}
                                            {/*            searchMorphsOutRequest ?*/}
                                            {/*                <BootstrapSpinner animation="border"/>*/}
                                            {/*                : null*/}
                                            {/*        }*/}
                                            {/*    </div>*/}
                                            {/*    {*/}
                                            {/*        morphsOutShow && searchMorphResultOut.length > 0 ?*/}
                                            {/*            (*/}
                                            {/*                <ul className="morphs d-inline-flex flex-column search-morphs" ref={searchList}>*/}
                                            {/*                    {*/}
                                            {/*                        searchMorphResultOut.map( (gene, idx) => (*/}
                                            {/*                            <li*/}
                                            {/*                                key={`${gene.title}-${gene.trait.title}-${gene.id}`}*/}
                                            {/*                                className={"reducer-morphs-item " + (selectMorphIdx === idx ? "selected" : "")}*/}
                                            {/*                                onClick={() => {*/}
                                            {/*                                    setSearchSelectedMorphOut(idx);*/}
                                            {/*                                    clearSearchInput(false);*/}
                                            {/*                                }}*/}
                                            {/*                            >*/}
                                            {/*                                <div className={`morph-indicator morph-${gene.type}-${pipes.toTraitClass(gene.trait.trait_group ? gene.trait.trait_group.label : gene.trait.title)} d-inline-block`}>*/}
                                            {/*                                    {compareMorph(gene.trait.title, gene.title)}*/}
                                            {/*                                </div>*/}
                                            {/*                            </li>*/}
                                            {/*                        ))*/}
                                            {/*                    }*/}
                                            {/*                </ul>*/}
                                            {/*            )*/}
                                            {/*            : null*/}
                                            {/*    }*/}

                                            {/*    <div className="morphs selected-morphs" ref={searchList}>*/}
                                            {/*        {*/}
                                            {/*            morphsOut.map( (gene, idx) => (*/}
                                            {/*                <div*/}
                                            {/*                    key={`morphs-${gene.title}-${gene.trait.title}-${gene.id}`}*/}
                                            {/*                    className={`morph-indicator morph-${gene.type}-${pipes.toTraitClass(gene.trait.trait_group ? gene.trait.trait_group.label : gene.trait.title)} d-inline-block`}*/}
                                            {/*                >*/}
                                            {/*                    {compareMorph(gene.trait.title, gene.title)}*/}
                                            {/*                    <FontAwesomeIcon*/}
                                            {/*                        icon={faTimes}*/}
                                            {/*                        size="lg"*/}
                                            {/*                        onClick={() => deleteSearchMorphOut(idx)}*/}
                                            {/*                        className="pl-1"/>*/}
                                            {/*                </div>*/}
                                            {/*            ))*/}
                                            {/*        }*/}
                                            {/*    </div>*/}
                                            {/*</Form.Group>*/}
                                            <Form.Group>
                                                <Form.Label>Цена:</Form.Label>

                                                <div className="d-flex justify-content-between align-items-center w-100 w-md-50">
                                                    <Field
                                                        id="searchPriceMin"
                                                        name="price_min"
                                                        placeholder="0"
                                                        type="tel"
                                                        group={false}
                                                        component={FormInput}
                                                    />
                                                    <span className="mx-3">-</span>
                                                    <Field
                                                        id="searchPriceMAx"
                                                        name="price_max"
                                                        type="tel"
                                                        group={false}
                                                        placeholder="100000"
                                                        component={FormInput}
                                                    />
                                                </div>
                                            </Form.Group>
                                            <button type="submit" className="btn btn-main">Поиск</button>
                                        </FormikForm>
                                    )
                                }
                            }
                        </Formik>
                    </div>
                </Col>
            }

        </Row>
    )
};

const mapStateToProps = ({kinds: {all: allKinds}}: IRootState): ISearchStateProps => ({
    allKinds
});

const Search = connect<ISearchStateProps, ISearchDispatchProps>(mapStateToProps, {
    search
})(SearchComponent);

export {
    Search
};