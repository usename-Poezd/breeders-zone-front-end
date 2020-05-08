import {Col, Form, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {DataService, Pipes} from "../../services";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import {connect} from "react-redux";
import {
    clearSearch,
    clearSearchMorphResultIn,
    clearSearchMorphResultOut,
    deleteMorphIn,
    deleteMorphOut,
    deleteSearchLocality, setSearchAge,
    setSearchLocality, setSearchMaxMorphs,
    setSearchMinMorphs,
    setSearchMorphResultIn,
    setSearchMorphResultOut,
    setSearchPriceFrom,
    setSearchPriceTo,
    setSearchQuery,
    setSearchSelectedKind, setSearchSex, setSearchSubcategoryId,
    setSelectedMorphIn,
    setSelectedMorphOut,
    updateSearchLocality,
    search as searchState
} from "../../actions";
const dataService = new DataService();
const debounceSearch = AwesomeDebouncePromise(
    dataService.searchMorphs,
    500
);

const Search = ({
    query,
    selectedKind,
    selectedLocalities,
    priceFrom,
    priceTo,
    morphsIn,
    morphsOut,
    minMorphs,
    maxMorphs,
    age,
    sex,
    subcategoryId,
    allKinds,
    setSearchSelectedKind,
    deleteSearchLocality,
    setSearchLocality,
    updateSearchLocality,
    setSearchPriceFrom,
    setSearchPriceTo,
    searchMorphResultIn,
    setSelectedMorphIn,
    deleteMorphIn,
    searchMorphResultOut,
    setSelectedMorphOut,
    deleteMorphOut,
    setSearchMinMorphs,
    setSearchMaxMorphs,
    setSearchSex,
    setSearchAge,
    setSearchSubcategoryId,
    isToggle,
    clearSearchMorphResultIn,
    clearSearchMorphResultOut,
    setSearchMorphResultIn,
    setSearchMorphResultOut,
    clearSearch,
    onToggleBurger,
    isSearch,
    searchState
}) => {

    const pipes = new Pipes();
    const searchList = React.createRef();

    const search = (e) => {
        e.preventDefault();
        searchState();
        redirectToSearch();
    };

    const redirectToSearch = () => {
        clearSearch();
        onToggleBurger();
    };


    const onSearchMorphs = (e, isIn = true) => {

        if (isIn) {
            setSearchMorphInValue(e.target.value);
        } else  {
            setSearchMorphOutValue(e.target.value);
        }

        if (!e.target.value) {
            clearSearchInput(isIn);
        }
        if (e.target.value) {
            setSelectMorphIdx(0);

            debounceSearch({
                q: e.target.value,
                options: [
                    ['kind.id', selectedKind.id]
                ]
            })
                .then((data) => {
                    const arr = [];

                    data.map( (gene) => {
                        gene.traits.map((trait) => {
                            const geneCopy = gene;
                            delete geneCopy.traits;
                            arr.push({...geneCopy, trait});
                        })
                    });

                    if (isIn) {
                        setSearchMorphResultIn(arr)
                    } else  {
                        setSearchMorphResultOut(arr)
                    }

                });
        }
    };

    const onSelectMorph = (e, isIn = true) => {
        const node = searchList.current;

        if (e.key === 'Enter') {
            e.preventDefault();
            if (isIn) {
                setSelectedMorphIn(selectMorphIdx);
            } else {
                setSelectedMorphOut(selectMorphIdx);
            }

            return clearSearchInput(isIn);
        }
        if (e.keyCode===38 && selectMorphIdx - 1 >= 0) {
            e.preventDefault();
            const pos = selectMorphIdx * 37;
            node.scrollTo(0, pos - 37);
            return setSelectMorphIdx(selectMorphIdx - 1);
        }

        if (e.keyCode===40 && selectMorphIdx + 1 < (searchMorphResultIn.length || searchMorphResultOut.length)) {
            e.preventDefault();
            const pos = selectMorphIdx * 37 + 37;
            if (pos % 4 === 0 && pos > 0) {
                node.scrollTo(0, pos);
            }
            return setSelectMorphIdx(selectMorphIdx + 1);
        }
    };

    const clearSearchInput = (isIn) => {
        setSelectMorphIdx( 0);
        if (isIn) {
            setSearchMorphInValue('');
            clearSearchMorphResultIn();
        } else  {
            clearSearchMorphResultOut();
            setSearchMorphOutValue('');
        }

    };

    const [searchMorphInValue, setSearchMorphInValue] = useState('');
    const [searchMorphOutValue, setSearchMorphOutValue] = useState('');
    const [selectMorphIdx, setSelectMorphIdx] = useState(0);
    const [morphsInShow, setMorphsInShow] = useState(false);
    const [morphsOutShow, setMorphsOutShow] = useState(false);

    if (isSearch) {
        setTimeout(() => search(), 100);
    }


    return (
        <Row className={"justify-content-center advance-search " + ( !isToggle ? 'hidden' : '')}>
            <Col xs={12} md={8}>
                <div className="form-container mb-4">
                    <Form onSubmit={search}>
                        <Form.Group>
                            <Form.Label>Категория:</Form.Label>
                            <div className="select-wrap">
                                <Form.Control as="select" onChange={(e) => e.target.value !== 'all' ? setSearchSelectedKind(Number(e.target.value)) : null}>
                                    <option value="all">Все</option>
                                    {
                                        allKinds.map( (item) => <option key={`kind-${item.id}`} value={item.id}>{item.title_rus}</option>)
                                    }
                                </Form.Control>
                            </div>
                        </Form.Group>

                        {
                            selectedKind.has_subcategories ?
                                (
                                    <Form.Group>
                                        <Form.Label>Выберите подкатегорию:</Form.Label>
                                        <div className="select-wrap">
                                            <Form.Control
                                                as="select"
                                                name="subcategoryId"
                                                onChange={(e) => setSearchSubcategoryId(Number(e.target.value))}
                                            >
                                                <option value="any">Все</option>
                                                {
                                                    selectedKind.subcategories.map( (item) => <option key={`subcategory-${item.id}`} value={item.id}>{item.title}</option>)
                                                }
                                            </Form.Control>
                                        </div>
                                    </Form.Group>
                                )
                                : null
                        }

                        {
                            selectedKind !== null && selectedKind.localities.length !== 0 ?
                                (
                                    <Form.Group className="d-flex flex-column locality">
                                        <Form.Label>Добавте локалитеты:</Form.Label>
                                        {
                                            selectedLocalities.map((item, idx) => (
                                                <div key={`localities-select-${idx}`} className="d-flex locality-item">
                                                    <div className="select-wrap w-100">
                                                        <Form.Control
                                                            as="select"
                                                            name="subcategoryId"
                                                            value={item.id}
                                                            onChange={(e) => updateSearchLocality({idx, localityId: Number(e.target.value)})}
                                                        >
                                                            {
                                                                selectedKind.localities.map( (locality) => <option key={`localities-${locality.id}`} value={locality.id}>{locality.title}</option>)
                                                            }
                                                        </Form.Control>
                                                    </div>
                                                    {
                                                        selectedLocalities.length === idx + 1 && selectedLocalities.length !== 1 ?
                                                            (
                                                                <div className="btn btn-main ml-2" onClick={() => setSearchLocality(selectedKind)}>
                                                                    <h3>+</h3>
                                                                </div>
                                                            )
                                                            : (
                                                                <div className="btn btn-danger ml-2" onClick={() => deleteSearchLocality(idx)}>
                                                                    <h3>-</h3>
                                                                </div>
                                                            )
                                                    }

                                                    {
                                                        selectedLocalities.length === 1 ?
                                                            (
                                                                <div className="btn btn-main ml-2" onClick={() => setSearchLocality(selectedKind)}>
                                                                    <h3>+</h3>
                                                                </div>
                                                            ) : null
                                                    }
                                                </div>
                                            ))
                                        }
                                        {
                                            selectedLocalities.length === 0 ?
                                                (
                                                    <div className="btn btn-main" style={{ width: 40 }} onClick={() => setSearchLocality(selectedKind)}>
                                                        <h3>+</h3>
                                                    </div>
                                                ) : null
                                        }

                                    </Form.Group>
                                ) : null
                        }


                        <Row>
                            <Form.Group as={Col} xs={6}>
                                <Form.Label>Пол:</Form.Label>
                                <div className="select-wrap">
                                    <Form.Control as="select" defaultValue="any" onChange={(e) => setSearchSex(e.target.value)}>
                                        <option value="any">Любой пол</option>
                                        <option value="male">Самец</option>
                                        <option value="female">Самка</option>
                                    </Form.Control>
                                </div>
                            </Form.Group>
                            <Form.Group as={Col} xs={6}>
                                <Form.Label>Возраст:</Form.Label>
                                <div className="select-wrap">
                                    <Form.Control as="select" defaultValue="any" onChange={(e) => setSearchAge(e.target.value)}>
                                        <option value="any">Любой возраст</option>
                                        <option value="baby">Baby</option>
                                        <option value="subadult">subadult</option>
                                        <option value="adult">adult</option>
                                    </Form.Control>
                                </div>
                            </Form.Group>
                        </Row>

                        <Form.Group>
                            <Form.Label>Кол-во морф:</Form.Label>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="select-wrap w-100">
                                    <Form.Control as="select" defaultValue="0" onChange={(e) => setSearchMinMorphs(Number(e.target.value))}>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                    </Form.Control>
                                </div>
                                <span className="mx-3">-</span>
                                <div className="select-wrap w-100">
                                    <Form.Control as="select" defaultValue="9" onChange={(e) => setSearchMaxMorphs(Number(e.target.value))}>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                    </Form.Control>
                                </div>
                            </div>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Морфы:</Form.Label>
                            <Form.Control
                                type="text"
                                name="morphIn"
                                value={searchMorphInValue}
                                onChange={onSearchMorphs}
                                onKeyDown={onSelectMorph}
                                onFocus={() => setMorphsInShow(true)}
                                onBlur={() => setTimeout(() => setMorphsInShow(false), 200)}
                            />
                            {
                                searchMorphResultIn.length && morphsInShow > 0 ?
                                    (
                                        <ul className="morphs d-inline-flex flex-column search-morphs" ref={searchList}>
                                            {
                                                searchMorphResultIn.map( (gene, idx) => (
                                                    <li
                                                        key={`${gene.title}-${gene.trait.title}-${gene.id}`}
                                                        className={"search-morphs-item " + (selectMorphIdx === idx ? "selected" : "")}
                                                        onClick={() => {
                                                            setSelectedMorphIn(idx);
                                                            clearSearchInput(true);
                                                        }}
                                                    >
                                                        <div className={`morph-indicator morph-${pipes.toTraitClass(`${gene.type}-${gene.trait.title}`)} d-inline-block`}>
                                                            {gene.trait.title} {gene.title}
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    )
                                    : null
                            }

                            <div className="morphs selected-morphs" ref={searchList}>
                                {
                                    morphsIn.map( (gene, idx) => (
                                        <div
                                            key={`morphs-${gene.title}-${gene.trait.title}-${gene.id}`}
                                            className={`morph-indicator morph-${pipes.toTraitClass(`${gene.type}-${gene.trait.title}`)} d-inline-block`}
                                        >
                                            {gene.trait.title} {gene.title}
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                size="lg"
                                                onClick={() => deleteMorphIn(idx)}
                                                className="pl-1"/>
                                        </div>
                                    ))
                                }
                            </div>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>За исключением::</Form.Label>
                            <Form.Control
                                type="text"
                                name="morphIn"
                                value={searchMorphOutValue}
                                onChange={(e) => onSearchMorphs(e, false)}
                                onKeyDown={(e) => onSelectMorph(e, false)}
                                onFocus={() => setMorphsOutShow(true)}
                                onBlur={() => setTimeout(() =>setMorphsOutShow(false), 200)}
                            />
                            {
                                morphsOutShow && searchMorphResultOut.length > 0 ?
                                    (
                                        <ul className="morphs d-inline-flex flex-column search-morphs" ref={searchList}>
                                            {
                                                searchMorphResultOut.map( (gene, idx) => (
                                                    <li
                                                        key={`${gene.title}-${gene.trait.title}-${gene.id}`}
                                                        className={"search-morphs-item " + (selectMorphIdx === idx ? "selected" : "")}
                                                        onClick={() => {
                                                            setSelectedMorphOut(idx);
                                                            clearSearchInput(false);
                                                        }}
                                                    >
                                                        <div className={`morph-indicator morph-${pipes.toTraitClass(`${gene.type}-${gene.trait.title}`)} d-inline-block`}>
                                                            {gene.trait.title} {gene.title}
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    )
                                    : null
                            }

                            <div className="morphs selected-morphs" ref={searchList}>
                                {
                                    morphsOut.map( (gene, idx) => (
                                        <div
                                            key={`morphs-${gene.title}-${gene.trait.title}-${gene.id}`}
                                            className={`morph-indicator morph-${pipes.toTraitClass(`${gene.type}-${gene.trait.title}`)} d-inline-block`}
                                        >
                                            {gene.trait.title} {gene.title}
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                size="lg"
                                                onClick={() => deleteMorphOut(idx)}
                                                className="pl-1"/>
                                        </div>
                                    ))
                                }
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Цена:</Form.Label>
                            <div className="d-flex justify-content-between align-items-center w-50">
                                <Form.Control
                                    type="number"
                                    placeholder="0"
                                    name="priceFrom"
                                    onChange={(e) => setSearchPriceFrom(Number(e.target.value))}
                                />
                                <span className="mx-3">-</span>
                                <Form.Control
                                    type="number"
                                    placeholder="100000"
                                    className="mr-3"
                                    name="priceTo"
                                    onChange={(e) => setSearchPriceTo(Number(e.target.value))}
                                />

                                {/*<Form.Control as="select" defaultValue="rub">*/}
                                {/*    <option value="rub">RUB</option>*/}
                                {/*    <option value="dol">Dollar</option>*/}
                                {/*    <option value="eur">EUR</option>*/}
                                {/*</Form.Control>*/}
                            </div>
                        </Form.Group>
                        <button className="btn btn-main">Поиск</button>
                    </Form>
                </div>
            </Col>
        </Row>
    )
};

const mapStateToProps = ({
                             auth: {isLogin, loginRequest},
                             profile: {user},
                             chat: {roomsWithNewMessages},
                             search: {
                                 query,
                                 selectedKind,
                                 selectedLocalities,
                                 priceFrom,
                                 priceTo,
                                 searchMorphResultIn,
                                 morphsIn,
                                 searchMorphResultOut,
                                 morphsOut,
                                 minMorphs,
                                 maxMorphs,
                                 age,
                                 sex,
                                 subcategoryId
                             },
                             kinds: {all: allKinds}
                         }) => ({
    isLogin,
    loginRequest,
    user,
    roomsWithNewMessages,
    allKinds,

    query,
    selectedKind,
    selectedLocalities,
    priceFrom,
    priceTo,
    searchMorphResultIn,
    morphsIn,
    searchMorphResultOut,
    morphsOut,
    minMorphs,
    maxMorphs,
    age,
    sex,
    subcategoryId
});

export default connect(mapStateToProps, {
    setSearchQuery,
    setSearchSelectedKind,
    setSearchLocality,
    deleteSearchLocality,
    updateSearchLocality,
    setSearchPriceFrom,
    setSearchPriceTo,
    setSearchMorphResultIn,
    setSelectedMorphIn,
    deleteMorphIn,
    clearSearchMorphResultIn,
    setSearchMorphResultOut,
    setSelectedMorphOut,
    deleteMorphOut,
    clearSearchMorphResultOut,
    setSearchMinMorphs,
    setSearchMaxMorphs,
    setSearchSex,
    setSearchAge,
    setSearchSubcategoryId,
    clearSearch,
    searchState
})(Search);
