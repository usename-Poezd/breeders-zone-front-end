import {Col, Form, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
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
    setSearchAge,
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
    search as searchState, setSearchMorphsInRequest, setSearchMorphsOutRequest
} from "../../actions";
import {compareMorph} from "../../utils";
const dataService = new DataService();
const debounceSearch = AwesomeDebouncePromise(
    dataService.searchMorphs,
    500
);

const Search = ({
    selectedKind,
    localityId,
    subcategoryId,
    morphsIn,
    morphsOut,
    allKinds,
    setSearchSelectedKind,
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
    searchState,
    searchMorphsInRequest,
    searchMorphsOutRequest,
    setSearchMorphsInRequest,
    setSearchMorphsOutRequest
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

            if (isIn) {
                setSearchMorphsInRequest(true);
            } else  {
                setSearchMorphsOutRequest(true);
            }
            const options = [];
            if (selectedKind.id) {
                options.push(['kinds.id', selectedKind.id]);
            }
            debounceSearch({
                q: e.target.value,
                options
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
                        setSearchMorphResultIn(arr);
                        setSearchMorphsInRequest(false);
                    } else  {
                        setSearchMorphResultOut(arr);
                        setSearchMorphsOutRequest(false);
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
                                        <Form.Label>Выберите локалитет:</Form.Label>
                                        <div className="select-wrap w-100">
                                            <Form.Control
                                                as="select"
                                                name="subcategoryId"
                                                value={localityId}
                                                onChange={(e) => setSearchLocality(Number(e.target.value))}
                                            >
                                                <option value="any">Все</option>
                                                {
                                                    selectedKind.subcategories ?
                                                        selectedKind.subcategories.find( (item) => item.id === subcategoryId).localities.map( (locality) => <option key={`localities-${locality.id}`} value={locality.id}>{locality.title}</option>)
                                                        : selectedKind.localities.map( (locality) => <option key={`localities-${locality.id}`} value={locality.id}>{locality.title}</option>)
                                                }
                                            </Form.Control>
                                        </div>
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
                                        <option value="subadult">Subadult</option>
                                        <option value="adult">Adult</option>
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
                            <div className="morph-search-input">
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
                                    searchMorphsInRequest ?
                                        <BootstrapSpinner animation="border"/>
                                        : null
                                }
                            </div>
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
                                                            {compareMorph(gene.trait.title, gene.title)}
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
                                           {compareMorph(gene.trait.title, gene.title)}
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
                            <Form.Label>За исключением:</Form.Label>
                            <div className="morph-search-input">
                                <Form.Control
                                    type="text"
                                    name="morphOut"
                                    value={searchMorphOutValue}
                                    onChange={(e) => onSearchMorphs(e, false)}
                                    onKeyDown={(e) => onSelectMorph(e, false)}
                                    onFocus={() => setMorphsOutShow(true)}
                                    onBlur={() => setTimeout(() =>setMorphsOutShow(false), 200)}
                                />
                                {
                                    searchMorphsOutRequest ?
                                        <BootstrapSpinner animation="border"/>
                                        : null
                                }
                            </div>
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
                                                           {compareMorph(gene.trait.title, gene.title)}
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
                                           {compareMorph(gene.trait.title, gene.title)}
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
                            <div className="d-flex justify-content-between align-items-center w-100 w-md-50">
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

                                 localityId,
                                 priceFrom,
                                 priceTo,
                                 searchMorphsInRequest,
                                 searchMorphResultIn,
                                 morphsIn,
                                 searchMorphsOutRequest,
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
    localityId,
    query,
    selectedKind,
    priceFrom,
    priceTo,
    searchMorphsInRequest,
    searchMorphResultIn,
    morphsIn,
    searchMorphsOutRequest,
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
    searchState,
    setSearchMorphsInRequest,
    setSearchMorphsOutRequest
})(Search);
