import React, {useCallback, useRef, useState} from "react";
import {Col, Form, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import GroupFormControl from "../group-form-control";
import {useForm} from "react-hook-form";
import {useDropzone} from "react-dropzone";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMars, faRubleSign, faTimes, faVenus} from "@fortawesome/free-solid-svg-icons";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {HandelError, HandelSuccess} from "../handels";
import MomentLocaleUtils, {
    formatDate,
    parseDate,
} from 'react-day-picker/moment';
import {DataService, Pipes} from "../../services";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import {
    clearDeletedMorphsKind, clearGetProductRequest, clearSearchResult,
    deleteAcceptedFile, deleteMorphsKind,
    deleteProductStateImg, deleteSelectedMorph, getKinds,
    productUpdateClear, productUpdateClearError, productUpdateClearSuccess,
    setAcceptedFiles, setGetProductRequest,
    setProductCb,
    setProductInfo, setProductSearchRequest, setProductSearchResult,
    setProductUpdateError,
    setProductUpdateRequest,
    setProductUpdateSuccess, setSelectedMorph
} from "../../actions";
import {connect} from "react-redux";
import Reports from "../reports";
const dataService = new DataService();
const debounceSearch = AwesomeDebouncePromise(
    dataService.searchMorphs,
    500
);

const ProductSettings = ({
     submit,
     product: {
         success,
         info,
         product_images,
         error,
         previews = [],
         acceptedFiles = [],
         selectedMorphs = [],
         searchRequest = false,
         searchResult = [],
         deletedMorphsKind = [],
     },
     deleteProductStateImg,
     setProductCb,
     deleteAcceptedFile,
     setAcceptedFiles,
     setSelectedMorph,
     deleteSelectedMorph,
     clearSearchResult,
     setProductSearchResult,
     allKinds,
     deleteMorphsKind,
     clearDeletedMorphsKind,
     clearLocalities,
     setProductSearchRequest
}) => {
    const [selectMorphIdx, setSelectMorphIdx] = useState(0);
    const searchList = useRef();

    const { toTraitClass } = new Pipes();

    const handleChange = (e) => {
        setValue(e.target.name, e.target.value);
    };

    const clearSearchInput = () => {
        setSelectMorphIdx(0);
        setValue('morph', '');
        clearSearchResult();
    };



    const onSearchMorphs = (e) => {
        if (!e.target.value) {
            clearSearchInput();
        }
        if (e.target.value) {
            setSelectMorphIdx(0);
            setProductSearchRequest(true);
            debounceSearch({
                q: e.target.value,
                options: [
                    ['id', values.kind_id]
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
                    setProductSearchResult(arr);
                    setProductSearchRequest(false);
                });
        }
    };

    const onSelectMorph = (e) => {
        const node = searchList.current;
        if (e.key === 'Enter') {
            e.preventDefault();
            setSelectedMorph(selectMorphIdx);
            return clearSearchInput();
        }
        if (e.keyCode===38 && selectMorphIdx - 1 >= 0) {
            e.preventDefault();
            const pos = selectMorphIdx * 37;
            node.scrollTo(0, pos - 37);
            return setSelectMorphIdx(selectMorphIdx - 1);
        }

        if (e.keyCode===40 && selectMorphIdx + 1 < searchResult.length) {
            e.preventDefault();
            const pos = selectMorphIdx * 37 + 37;
            if (pos % 4 === 0 && pos > 0) {
                node.scrollTo(0, pos);
            }
            return setSelectMorphIdx(selectMorphIdx + 1);
        }
    };

    const onDrop = useCallback(acceptedFiles => setAcceptedFiles(acceptedFiles), []);

    const { register, handleSubmit, watch, setValue, errors } = useForm({
        defaultValues: {
            ...info,
            kind_id: info.kind_id ? info.kind_id : allKinds[0].id,
            subcategory_id: info.subcategory_id ? info.subcategory_id : allKinds[0].subcategories[0].id,
            locality_id: info.locality_id ? info.locality_id : 'none',
            morph: ''
        }
    });

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        multiple: true,
        accept: 'image/jpeg, image/png'
    });

    const values = watch();

    const [prevKindId, setPrevKindId] = useState(values.kind_id);
    const [selectedKind, setSelectKind] = useState(allKinds.find((item) => item.id == values.kind_id));
    const [morphsShow, setMorphsShow] = useState(false);

    const value = info.cb
        ? new Date(info.cb)
        : "";

    return (
        <Row className="justify-content-center">
            <Col xs={12} md={9}>
                <Form className="feather-shadow form-container" onSubmit={handleSubmit(submit)}>
                    <HandelSuccess success={success}/>
                    <HandelError error={error}/>
                    <GroupFormControl
                        label="Название"
                        errors={errors}
                        controls={{
                            type: "text",
                            name: "name",
                            value: values.name,
                            onChange: handleChange,
                            ref: register({
                                required: true
                            })
                        }}
                    />
                    <Form.Group>
                        <Form.Label>Выберите категорию:</Form.Label>
                        <div className="select-wrap">
                            <Form.Control
                                as="select"
                                name="kind_id"
                                ref={register({
                                    required: true
                                })}
                                onChange={
                                    (e) => {
                                        if (info.kind_id == e.target.value && deletedMorphsKind.length > 0) {
                                            clearDeletedMorphsKind()
                                        }
                                        if (prevKindId !== e.target.value && info.kind_id != e.target.value) {
                                            deleteMorphsKind();
                                            clearLocalities();
                                        }
                                        setSelectKind(allKinds.find((item) => item.id == values.kind_id));
                                        setPrevKindId(values.kind_id);
                                    }
                                }
                            >
                                {
                                    allKinds.map( (item) => <option key={`kind-${item.id}`} value={item.id}>{item.title_rus}</option>)
                                }
                            </Form.Control>
                        </div>
                    </Form.Group>
                    {
                        selectedKind && selectedKind.has_subcategories && selectedKind.subcategories.length > 0 ?
                            (
                                <Form.Group>
                                    <Form.Label>Выберите подкатегорию:</Form.Label>
                                    <div className="select-wrap">
                                        <Form.Control
                                            as="select"
                                            name="subcategory_id"
                                            ref={register({
                                                required: true
                                            })}
                                        >
                                            {
                                                selectedKind.subcategories.map( (item) => <option key={`subcategory-${item.id}`} value={item.id}>{item.title}</option>)
                                            }
                                        </Form.Control>
                                    </div>
                                </Form.Group>
                            ) : null
                    }
                    {
                        selectedKind && selectedKind.localities.length !== 0 ?
                            (
                                <Form.Group className="d-flex flex-column locality">
                                    <Form.Label>Добавте локалитет:</Form.Label>
                                    <div className="select-wrap w-100">
                                        <Form.Control
                                            as="select"
                                            name="locality_id"
                                            ref={register}
                                            onChange={(e) => setValue('locality_id', e.target.value)}
                                            value={values.locality_id}
                                        >
                                            <option value="none">Нет локалитета</option>
                                            {
                                                selectedKind.subcategories ?
                                                    selectedKind.subcategories.find( (item) => item.id === values.subcategory_id).localities.map( (locality) => <option key={`localities-${locality.id}`} value={locality.id}>{locality.title}</option>)
                                                    : selectedKind.localities.map( (locality) => <option key={`localities-${locality.id}`} value={locality.id}>{locality.title}</option>)
                                            }
                                        </Form.Control>
                                    </div>
                                </Form.Group>
                            ) : null
                    }
                    {
                        selectedKind.genes_count > 0 ?
                            (
                                <Form.Group>
                                    <Form.Label>Морфы:</Form.Label>
                                    <div className="morph-search-input">
                                        <Form.Control
                                            type="text"
                                            name="morph"
                                            value={values.morph}
                                            onChange={onSearchMorphs}
                                            onKeyDown={onSelectMorph}
                                            ref={register}
                                            onFocus={() => setMorphsShow(true)}
                                            onBlur={() => setTimeout(() => {
                                                setMorphsShow(false);
                                                clearSearchResult()
                                            }, 200)}
                                            placeholder="Начните вводить название морфы..."
                                        />
                                        {
                                            searchRequest ?
                                                <BootstrapSpinner animation="border"/>
                                                : null
                                        }
                                    </div>
                                    {
                                        searchResult.length > 0 && morphsShow ?
                                            (
                                                <ul className="morphs d-inline-flex flex-column search-morphs" ref={searchList}>
                                                    {
                                                        searchResult.map( (gene, idx) => (
                                                            <li
                                                                key={`${gene.title}-${gene.trait.title}-${gene.id}`}
                                                                className={"search-morphs-item " + (selectMorphIdx === idx ? "selected" : "")}
                                                                onMouseDown={() => {
                                                                    setSelectedMorph(idx);
                                                                    clearSearchInput();
                                                                }}
                                                            >
                                                                <div className={`morph-indicator morph-${toTraitClass(`${gene.type}-${gene.trait.title}`)} d-inline-block`}>
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
                                            selectedMorphs.map( ({gene, trait}, idx) => (
                                                <div
                                                    key={`morphs-${gene.title}-${trait.title}-${gene.id}`}
                                                    className={`morph-indicator morph-${toTraitClass(`${gene.type}-${trait.title}`)} d-inline-block`}
                                                >
                                                    {trait.title} {gene.title}
                                                    <FontAwesomeIcon
                                                        icon={faTimes}
                                                        size="lg"
                                                        onClick={() => deleteSelectedMorph(idx)}
                                                        className="delete pl-1"/>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </Form.Group>
                            ) : null
                    }
                    <Form.Group>
                        <Form.Label>Пол:</Form.Label>
                        <Form.Check
                            id="male"
                            type="radio"
                            name="sex"
                            value={1}
                            label={<FontAwesomeIcon icon={faMars} className="sex sex-male" size="lg"/>}
                            ref={
                                register({
                                    required: true
                                })
                            }
                        />
                        <Form.Check
                            id="female"
                            type="radio"
                            name="sex"
                            value={0}
                            label={<FontAwesomeIcon icon={faVenus} className="sex sex-female" size="lg"/>}
                            ref={
                                register({
                                    required: true
                                })
                            }
                        />
                        {   errors.sex &&
                            errors.sex.type === 'required' &&
                            <p className="form-err text-danger">Пожалуйста укажите пол.</p>
                        }
                    </Form.Group>
                    {
                        product_images ?
                            (
                                <div className="product-imgs d-flex">
                                    {
                                        product_images.map( (item, idx) => (
                                            <div className="preview mr-1" key={`loaded-${idx}`}>
                                                <span
                                                    className="preview-delete"
                                                    onClick={ () => deleteProductStateImg(idx)}
                                                >
                                                    <FontAwesomeIcon icon={faTimes} size="sm"/>
                                                </span>
                                                <img src={item.img_src} alt={`loaded-${idx}`} className="img-fluid"/>
                                            </div>
                                        ))
                                    }
                                </div>
                            ) : null
                    }
                    <div {...getRootProps({ className: 'drag-and-drop-container feather-shadow'})}>
                        <input {...getInputProps({
                            name: 'logo',
                            className: 'drag-and-drop-input'
                        })}/>
                            <div className="d-flex outline">
                                {
                                    acceptedFiles[0] ?
                                        previews.map( (item, idx) => (
                                            <div className="preview mr-1" key={`prew-${idx}`}>
                                                <span className="preview-delete" onClick={ e => { e.stopPropagation(); deleteAcceptedFile(idx)}}><FontAwesomeIcon icon={faTimes} size="sm"/> </span>
                                                <img src={item} alt={`prew-${idx}`} className="img-fluid"/>
                                            </div>
                                        )) : <span className="m-auto">Перетащите файлы сюда,<br/>либо кликните для выбора</span>
                                }
                            </div>
                    </div>
                    <Row>
                        <Col xs={12} md={6}>
                            <Form.Group>
                                <Form.Label>Дата рождения:</Form.Label>
                                <DayPickerInput
                                    value={value}
                                    onDayChange={(day) => setProductCb(day)}
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    format="DD/MM/YYYY"
                                    placeholder={`${formatDate(new Date(), 'DD/MM/YYYY', 'ru')}`}
                                    dayPickerProps={{
                                        locale: 'ru',
                                        localeUtils: MomentLocaleUtils
                                    }}
                                    inputProps={{
                                        name: "cb"
                                    }}
                                />
                                {   errors.cb &&
                                errors.cb.type === 'required' &&
                                <p className="form-err text-danger">Пожалуйста запполните это поле</p>
                                }
                                {   errors.cb &&
                                errors.cb.type === 'pattern' &&
                                <p className="form-err text-danger">Пожалуйста запполните это поле правильно</p>
                                }
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                            <Form.Group>
                                <Form.Label>Возраст:</Form.Label>
                                <div className="select-wrap">
                                    <Form.Control
                                        as="select"
                                        name="age"
                                        ref={register({
                                            required: true
                                        })}
                                    >
                                        <option value="Baby">Baby</option>
                                        <option value="Subadult">Subadult</option>
                                        <option value="Adult">Adult</option>
                                    </Form.Control>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <GroupFormControl
                        label="Описание"
                        textArea = {true}
                        errors = {errors}
                        controls={{
                            type: "text",
                            name: "description",
                            value: values.description,
                            onChange: handleChange,
                            ref: register
                        }}
                    />
                    <div className="price">
                        <Form.Label>Цена:</Form.Label>
                        <div className="d-flex align-items-center">
                            <GroupFormControl
                                errors={errors}
                                className="w-25 m-0"
                                controls={{
                                    type: "text",
                                    name: "price",
                                    value: values.price,
                                    onChange: handleChange,
                                    ref: register({
                                        required: true,
                                        pattern: /[0-9]+/gi
                                    })
                                }}
                            />
                            <FontAwesomeIcon icon={faRubleSign} className="ml-1"/>
                        </div>
                    </div>

                    <input type="submit" value="Сохранить" className="btn btn-main"/>
                </Form>
            </Col>
            <Col xs={12} md={9}>
                <Reports reports={info.reports} isProduct/>
            </Col>
        </Row>
    )
};

const mapStateToProps = ({auth: {loginRequest}, product, profile: {user}, kinds: {all: allKinds}}) => ({
    user,
    product,
    allKinds,
    loginRequest
});

export default connect(mapStateToProps, {
    setProductUpdateRequest,
    setProductUpdateSuccess,
    setProductUpdateError,
    productUpdateClear,
    setProductCb,
    setAcceptedFiles,
    deleteAcceptedFile,
    setProductInfo,
    deleteProductStateImg,
    productUpdateClearSuccess,
    productUpdateClearError,
    setGetProductRequest,
    clearGetProductRequest,
    setProductSearchResult,
    setSelectedMorph,
    deleteSelectedMorph,
    clearSearchResult,
    deleteMorphsKind,
    clearDeletedMorphsKind,
    getKinds,
    setProductSearchRequest
})(ProductSettings);
