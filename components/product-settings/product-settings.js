import React, {useCallback, useRef, useState} from "react";
import {Col, Form, Row, Spinner} from "react-bootstrap";
import GroupFormConrol from "../group-form-control";
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
    clearDeletedMorphsKind, clearGetProductRequest, clearLocalities, clearSearchResult,
    deleteAcceptedFile, deleteLocality, deleteMorphsKind,
    deleteProductStateImg, deleteSelectedMorph, getKinds,
    productUpdateClear, productUpdateClearError, productUpdateClearSuccess,
    setAcceptedFiles, setGetProductRequest, setLocality,
    setProductCb,
    setProductInfo, setProductSearchResult,
    setProductUpdateError,
    setProductUpdateRequest,
    setProductUpdateSuccess, setSelectedMorph, updateProductLocality
} from "../../actions";
import {connect} from "react-redux";
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
         searchResult = [],
         deletedMorphsKind = [],
         localities = []
     },
     deleteProductStateImg,
     setProductCb,
     deleteAcceptedFile,
     setAcceptedFiles,
     deleteProductImg,
     setSelectedMorph,
     deleteSelectedMorph,
     clearSearchResult,
     setProductSearchResult,
     allKinds,
     deleteMorphsKind,
     clearDeletedMorphsKind,
     setLocality,
     clearLocalities,
     updateProductLocality,
     deleteLocality
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
            debounceSearch({
                q: e.target.value,
                options: [
                    ['id', values.kindId]
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
                    setProductSearchResult(arr)
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
            kindId: allKinds[0].id,
            morph: ''
        }
    });

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        multiple: true,
        accept: 'image/jpeg, image/png'
    });

    const values = watch();

    const [prevKindId, setPrevKindId] = useState(values.kindId);
    const [selectedKind, setSelectKind] = useState(allKinds.find((item) => item.id == values.kindId));
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
                    <GroupFormConrol
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
                                name="kindId"
                                ref={register({
                                    required: true
                                })}
                                onChange={
                                    (e) => {
                                        if (info.kindId == e.target.value && deletedMorphsKind.length > 0) {
                                            clearDeletedMorphsKind()
                                        }
                                        if (prevKindId !== e.target.value && info.kindId != e.target.value) {
                                            deleteMorphsKind();
                                            clearLocalities();
                                        }
                                        setSelectKind(allKinds.find((item) => item.id == values.kindId));
                                        setPrevKindId(values.kindId);
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
                        selectedKind && selectedKind.has_subcategories ?
                            (
                                <Form.Group>
                                    <Form.Label>Выберите категорию:</Form.Label>
                                    <div className="select-wrap">
                                        <Form.Control
                                            as="select"
                                            name="subcategoryId"
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
                                    <Form.Label>Добавте локалитеты:</Form.Label>
                                    {
                                        localities.map((item, idx) => (
                                            <div key={`localities-select-${idx}`} className="d-flex locality-item">
                                                <div className="select-wrap w-100">
                                                    <Form.Control
                                                        as="select"
                                                        name="subcategoryId"
                                                        ref={register}
                                                        value={item.id}
                                                        onChange={(e) => updateProductLocality({localityId: Number(e.target.value), idx, selectedKind})}
                                                    >
                                                        {
                                                            selectedKind.localities.map( (locality) => <option key={`localities-${locality.id}`} value={locality.id}>{locality.title}</option>)
                                                        }
                                                    </Form.Control>
                                                </div>
                                                {
                                                    localities.length === idx + 1 && localities.length !== 1 ?
                                                        (
                                                            <div className="btn btn-main ml-2" onClick={() => setLocality(selectedKind)}>
                                                                <h3>+</h3>
                                                            </div>
                                                        )
                                                        : (
                                                            <div className="btn btn-danger ml-2" onClick={() => deleteLocality(idx)}>
                                                                <h3>-</h3>
                                                            </div>
                                                        )
                                                }

                                                {
                                                    localities.length === 1 ?
                                                        (
                                                            <div className="btn btn-main ml-2" onClick={() => setLocality(selectedKind)}>
                                                                <h3>+</h3>
                                                            </div>
                                                        ) : null
                                                }
                                            </div>
                                        ))
                                    }
                                    {
                                        localities.length === 0 ?
                                            (
                                                <div className="btn btn-main" style={{ width: 40 }} onClick={() => setLocality(selectedKind)}>
                                                    <h3>+</h3>
                                                </div>
                                            ) : null
                                    }

                                </Form.Group>
                            ) : null
                    }
                    <Form.Group>
                        <Form.Label>Морфы:</Form.Label>
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
                            searchResult.length > 0 && morphsShow ?
                                (
                                    <ul className="morphs d-inline-flex flex-column search-morphs" ref={searchList}>
                                        {
                                            searchResult.map( (gene, idx) => (
                                                <li
                                                    key={`${gene.title}-${gene.trait.title}-${gene.id}`}
                                                    className={"search-morphs-item " + (selectMorphIdx === idx ? "selected" : "")}
                                                    onClick={() => {
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
                                        <option value="baby">Baby</option>
                                        <option value="subadult">Subadult</option>
                                        <option value="adult">Adult</option>
                                    </Form.Control>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <GroupFormConrol
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
                            <GroupFormConrol
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
    setLocality,
    clearLocalities,
    deleteLocality,
    getKinds,
    updateProductLocality
})(ProductSettings);
