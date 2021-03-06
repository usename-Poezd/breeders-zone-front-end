import React, {useCallback, useEffect, useRef, useState} from "react";
import {Col, Form, Row, Spinner as BootstrapSpinner} from "react-bootstrap";
import GroupFormControl from "../group-form-control";
import {useForm} from "react-hook-form";
import Dropzone, {useDropzone} from "react-dropzone";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMars, faQuestionCircle, faRubleSign, faTimes, faVenus} from "@fortawesome/free-solid-svg-icons";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {HandelError, HandelSuccess} from "../handels";
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
import {initialState} from "../../reducers"
import {connect} from "react-redux";
import Reports from "../reports";
import {compareMorph, num2str} from "../../utils";
import {withRouter} from "next/router";
import Switch from "react-switch";
import Link from "next/link";
import moment from "moment";
import PriceInput from "../price-input";
import DateInput from "../date-input";
import {IStateProps, ProductSettingsProps} from "./types";
import {mainColorHover, secondColor} from "../../variables/style-variables";
import MomentLocaleUtils from 'react-day-picker/moment';
const dataService = new DataService();
const debounceSearch = AwesomeDebouncePromise(
    dataService.searchMorphs,
    500
);

type Inputs = {
    id: string,
    article: string,
    user_id: number|null,
    name: string,
    price: number|string,
    sex: boolean|string,
    group_male: number|null,
    group_female: number|null,
    cb: string,
    is_active: boolean,
    ask_price: boolean,
    reports: Array<any>,
    description: string,
    locality_id: number|string|null,
    subcategory_id: number|string|null,
    kind_id: number|string|null,
    preview: {
        img_src: string
    }|null,
    morph: string,
    previewOfPreview: string
}

const ProductSettings = ({
     submit,
     product: {
         success,
         info,
         product_images,
         error,
         previews = [],
         acceptedFiles = [],
         selectedMorphs,
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
     currencies,
     deleteMorphsKind,
     clearDeletedMorphsKind,
     setProductSearchRequest,
     router
}: ProductSettingsProps) => {
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
        const node: any = searchList.current;
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

    const [preview, setPreview] = useState(null);
    const [previewOfPreview, setPreviewOfPreview] = useState(null);

    const onDrop = useCallback(acceptedFiles => setAcceptedFiles(acceptedFiles), []);
    const onDropPreview = useCallback((acceptedFiles: Array<File>) => {
        setPreview(acceptedFiles[0]);
        setPreviewOfPreview(URL.createObjectURL(acceptedFiles[0]))
    }, []);

    const { register, handleSubmit, watch, setValue, control, errors } = useForm<Inputs>({
        defaultValues: {
            ...info,
            sex: info.group !== null ? 'group' : info.sex,
            group_male: info.group !== null ? info.group.male : null,
            group_female: info.group !== null ? info.group.female : null,
            article: info.article ? info.article : '',
            kind_id: info.kind_id ? info.kind_id : allKinds[0].id,
            subcategory_id: info.subcategory_id ? info.subcategory_id : (allKinds[0].subcategories !== null && allKinds[0].subcategories.length !== 0 ? allKinds[0].subcategories[0].id : null),
            locality_id: info.locality_id ? String(info.locality_id) : 'none',
            morph: '',
            previewOfPreview: '123'
        }
    });

    useEffect(() => {
        setValue('price', info.price)
    }, [info.price]);

    const [isActive, setActive] = useState(info.is_active);
    const [isAskPrice, setIsAskPrice] = useState(info.ask_price);

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
        ? moment(info.cb).toDate()
        : "";

    return (
       <React.Fragment>
           <Row className="justify-content-center">
               <Col xs={12}>
                   <div className="feather-shadow breadcrumbs">
                       <div className="breadcrumbs-item">
                           <Link href="/products">
                               <a>Мои товары</a>
                           </Link>
                       </div>
                       <div className="breadcrumbs-item">
                           <Link
                               href={router.pathname === '/products/add' ? '/products/add' : '/products/[id]'}
                               as={router.pathname === '/products/add' ? '/products/add' : `/products/${info.id}`}
                           >
                               <a>
                                   {
                                       router.pathname === '/products/add' ?
                                           'Добавить'
                                           : info.name
                                   }
                               </a>
                           </Link>
                       </div>
                   </div>
               </Col>
           </Row>
           <Row className="justify-content-center flex-column-reverse flex-lg-row">
               <Col xs={12} lg={9}>
                   <Form className="feather-shadow form-container" onSubmit={handleSubmit((data, ...args) => {
                       data.is_active = isActive;
                       data.ask_price = isAskPrice;
                       data.preview = preview;

                       if (selectedKind.only_text) {
                           data.sex = 'null';
                           // @ts-ignore
                           data.age = 'Baby';
                           setProductCb(new Date());
                       }

                       if (data.sex === 'group') {
                           data.sex = 'null';
                       } else {
                           data.group_male = 0;
                           data.group_female = 0;
                       }

                       submit(data, ...args)
                   })}>
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
                       <GroupFormControl
                           label="Уникальный идентификатор"
                           info={{
                               isInfo: true,
                               text: 'Уникальный идентификатор животного (не обязательно)'
                           }}
                           errors={errors}
                           controls={{
                               type: "text",
                               name: "article",
                               value: values.article,
                               onChange: handleChange,
                               ref: register
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
                                       <Form.Label>Добавтье локалитет:</Form.Label>
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
                                                   selectedKind.subcategories && selectedKind.subcategories.find( (item) => item.id === Number(values.subcategory_id)) ?
                                                       selectedKind.subcategories.find( (item) => item.id === Number(values.subcategory_id)).localities.map( (locality) => <option key={`localities-${locality.id}`} value={locality.id}>{locality.title}</option>)
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
                                                                   <div className={`morph-indicator morph-${gene.type}-${toTraitClass(gene.trait.trait_group ? gene.trait.trait_group.label : gene.trait.title)} d-inline-block`}>
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
                                               selectedMorphs.map( ({gene, trait}, idx) => (
                                                   <div
                                                       key={`morphs-${gene.title}-${trait.title}-${gene.id}`}
                                                       className={`morph-indicator morph-${gene.type}-${toTraitClass(trait.trait_group ? trait.trait_group.label : trait.title)} d-inline-block`}
                                                   >
                                                       {compareMorph(trait.title, gene.title)}
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
                       {
                           !selectedKind.only_text &&
                           <Form.Group>
                               <Form.Label>Пол:</Form.Label>
                               <Form.Check
                                   id="male"
                                   type="radio"
                                   name="sex"
                                   value={1}
                                   label={(
                                       <React.Fragment>
                                           <FontAwesomeIcon icon={faMars} className="sex sex-male" size="lg"/>
                                           <span className="ml-1">Самец(Male)</span>
                                       </React.Fragment>
                                   )}
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
                                   label={(
                                       <React.Fragment>
                                           <FontAwesomeIcon icon={faVenus} className="sex sex-female" size="lg"/>
                                           <span className="ml-1">Самка(Female)</span>
                                       </React.Fragment>
                                   )}
                                   ref={
                                       register({
                                           required: true
                                       })
                                   }
                               />
                               <Form.Check
                                   id="non-sex"
                                   type="radio"
                                   name="sex"
                                   value={'null'}
                                   label={"Пол не определен"}
                                   ref={
                                       register({
                                           required: true
                                       })
                                   }
                               />
                               <Form.Check
                                   id="group"
                                   type="radio"
                                   name="sex"
                                   value={'group'}
                                   label={"Я продаю группой"}
                                   ref={
                                       register({
                                           required: true
                                       })
                                   }
                               />
                               {
                                   errors.sex &&
                                   errors.sex.type === 'required' &&
                                        <p className="form-err text-danger">Пожалуйста укажите пол.</p>
                               }
                           </Form.Group>
                       }
                       {
                           values.sex === 'group' &&
                               <Form.Group>
                                   <Form.Label>Укажите количество животных:</Form.Label>
                                   <div className="row flex-column">
                                       <div className="d-flex align-items-center col-md-4 col mb-2">
                                           <Form.Control
                                               className="mr-2"
                                               id="group_male"
                                               type="number"
                                               min="0"
                                               name="group_male"
                                               ref={
                                                   register({
                                                       required: true
                                                   })
                                               }
                                           />
                                           <p>{num2str(values.group_male, ['Самец', 'Самца', 'Самцов'])}</p>
                                       </div>
                                       <div className="d-flex align-items-center col-md-4 col">
                                           <Form.Control
                                               className="mr-2"
                                               id="group_female"
                                               type="number"
                                               min="0"
                                               name="group_female"
                                               ref={
                                                   register({
                                                       required: true
                                                   })
                                               }
                                           />
                                           <p>{num2str(values.group_female, ['Самка', 'Самки', 'Самки'])}</p>
                                       </div>
                                   </div>
                               </Form.Group>
                       }
                       <Form.Group>
                           <Form.Label>Детальные фото:</Form.Label>
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
                       </Form.Group>
                       {
                           !selectedKind.only_text &&
                               <Row>
                                   <Col xs={12} md={6}>
                                       <Form.Group>
                                           <Form.Label>Дата рождения:</Form.Label>
                                           <DayPickerInput
                                               component={DateInput}
                                               value={value}
                                               onDayChange={(day) => setProductCb(day)}
                                               formatDate={MomentLocaleUtils.formatDate}
                                               parseDate={MomentLocaleUtils.parseDate}
                                               format="DD.MM.YYYY"
                                               placeholder={`${moment().format('DD.MM.YY')}`}
                                               dayPickerProps={{
                                                   locale: 'ru'
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
                                                   <option value="Junior">Junior</option>
                                                   <option value="Subadult">Subadult</option>
                                                   <option value="Adult">Adult</option>
                                               </Form.Control>
                                           </div>
                                       </Form.Group>
                                   </Col>
                               </Row>
                       }
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
                       <Row className="align-items-center">
                           <Col xs={12} md={6}>
                               <Form.Group>
                                   <Form.Label>
                                       Цена:
                                       <span className="info">
                                            <FontAwesomeIcon icon={faQuestionCircle}/>
                                            <p className="info-text">
                                                Оплата за товар производится в рублях, но вы можете указать цену в другой валюте из представленных, стоимость будет автоматически пересчитываться по курсу&nbsp;
                                                <a href="https://www.cbr.ru/" target="_blank">ЦБ РФ</a>
                                            </p>
                                        </span>
                                   </Form.Label>
                                   <div className="d-flex align-items-center">
                                       <PriceInput errors={errors} control={control}/>
                                       <div className="select-wrap w-100 ml--5">
                                           <Form.Control
                                               id="currency"
                                               name="currency"
                                               as="select"
                                               ref={register({
                                                   required: true
                                               })}
                                           >
                                               <option value="RUB">RUB</option>
                                               <option value="USD">USD</option>
                                               <option value="EUR">EUR</option>
                                           </Form.Control>
                                       </div>
                                   </div>
                               </Form.Group>
                           </Col>
                           <Col xs={12} md={6}>
                               <div className="d-flex justify-content-between justify-content-md-start align-items-center mb-2">
                                   <h3 className="mr--5">Активен:</h3>
                                   <Switch
                                       checked={isActive}
                                       onChange={() => setActive(!isActive)}
                                       onColor={secondColor}
                                       onHandleColor={mainColorHover}
                                       handleDiameter={30}
                                       uncheckedIcon={false}
                                       checkedIcon={false}
                                       boxShadow="0px 1px 3px rgba(0, 0, 0, 0.6)"
                                       activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
                                       height={20}
                                       width={48}
                                       name="is_active"
                                   />
                               </div>
                               <div className="d-flex justify-content-between justify-content-md-start align-items-center mb-2">
                                   <h3 className="mr--5">Цена по запросу:</h3>
                                   <Switch
                                       checked={isAskPrice}
                                       onChange={() => setIsAskPrice(!isAskPrice)}
                                       onColor={secondColor}
                                       onHandleColor={mainColorHover}
                                       handleDiameter={30}
                                       uncheckedIcon={false}
                                       checkedIcon={false}
                                       boxShadow="0px 1px 3px rgba(0, 0, 0, 0.6)"
                                       activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
                                       height={20}
                                       width={48}
                                       name="ask_price"
                                   />
                               </div>
                           </Col>
                       </Row>

                       <input type="submit" value="Сохранить" className="btn btn-main"/>
                   </Form>
               </Col>
               <Col xs={12} lg={3}>
                   <div className="feather-shadow form-container">
                       <Form.Group>
                           <Form.Label>Фото для превью:</Form.Label>
                           {
                               info.preview ?
                                   (
                                       <div className="product-imgs d-flex">
                                           {
                                               <div className="preview mr-1">
                                                    <span
                                                        className="preview-delete"
                                                        onClick={ () => null}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} size="sm"/>
                                                    </span>
                                                   <img src={info.preview.img_src} className="img-fluid"/>
                                               </div>
                                           }
                                       </div>
                                   ) : null
                           }
                           <Dropzone onDrop={onDropPreview}>
                               {
                                   ({getRootProps, getInputProps}) => (
                                       <div {...getRootProps({ className: 'drag-and-drop-container feather-shadow'})}>
                                           <input {...getInputProps({
                                               name: 'preview',
                                               className: 'drag-and-drop-input'
                                           })}/>
                                           <div className="d-flex outline">
                                               {
                                                   previewOfPreview ?
                                                       <div className="preview mr-1">
                                                        <span
                                                            className="preview-delete"
                                                            onClick={ e => {
                                                                e.stopPropagation();
                                                                setPreviewOfPreview(null);
                                                                setPreview(null);
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} size="sm"/>
                                                        </span>
                                                           <img src={previewOfPreview} className="img-fluid"/>
                                                       </div>
                                                       : <span className="m-auto text-center">Перетащите файлы сюда,<br/>либо кликните для выбора<br/></span>
                                               }
                                           </div>
                                       </div>
                                   )
                               }
                           </Dropzone>
                       </Form.Group>
                   </div>
               </Col>
               {
                   router.pathname !== '/products/add' ?
                       <Col xs={12} md={9}>
                           <Reports reports={info.reports} isProduct/>
                       </Col>
                       : null
               }
           </Row>
       </React.Fragment>
    )
};

const mapStateToProps = ({auth: {loginRequest}, product, profile: {user}, kinds: {all: allKinds}, currencies}: typeof initialState): IStateProps => ({
    user,
    product,
    allKinds,
    loginRequest,
    currencies
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
})(
    withRouter(ProductSettings)
);
