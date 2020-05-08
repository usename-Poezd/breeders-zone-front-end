import React, {useCallback, useRef, useState} from "react";
import {DataService, Pipes} from "../../services";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import {Col, Form, Row} from "react-bootstrap";
import {HandelError, HandelSuccess} from "../handels";
import GroupFormConrol from "../group-form-control";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {useForm} from "react-hook-form";
import {connect} from "react-redux";
import {isLogin} from "../../utils";
import DayPickerInput from "react-day-picker/DayPickerInput";
import MomentLocaleUtils, {formatDate, parseDate} from "react-day-picker/moment";
import {
    clearDivorce,
    clearDivorceError,
    clearDivorceSearchResultFemale,
    clearDivorceSearchResultMale, clearDivorceSuccess,
    deleteAcceptedFileExit,
    deleteAcceptedFileMasonry,
    deleteAcceptedFileSex,
    deleteExitPhoto,
    deleteFemaleMorph,
    deleteMaleAndFemaleMorphs,
    deleteMaleMorph,
    deleteMasonryPhoto,
    deleteSexPhoto,
    setAcceptedFilesExit,
    setAcceptedFilesMasonry,
    setAcceptedFilesSex, setDivorce, setDivorceCb, setDivorceError,
    setDivorceSearchResultFemale,
    setDivorceSearchResultMale, setDivorceSuccess, setDivorceUpdateRequest,
    setSelectedMorphFemale,
    setSelectedMorphMale
} from "../../actions";
import {useDropzone} from "react-dropzone";
const dataService = new DataService();
const debounceSearch = AwesomeDebouncePromise(
    dataService.searchMorphs,
    500
);

const DivorceSettings = ({
     allKinds,
     divorce,
     setDivorceCb,
     deleteMaleAndFemaleMorphs,
     setSelectedMorphMale,
     clearDivorceSearchResultMale,
     setDivorceSearchResultMale,
     setDivorceSearchResultFemale,
     setSelectedMorphFemale,
     clearDivorceSearchResultFemale,
     deleteFemaleMorph,
     deleteMaleMorph,
     setAcceptedFilesSex,
     setAcceptedFilesMasonry,
     setAcceptedFilesExit,
     deleteAcceptedFileSex,
     deleteAcceptedFileMasonry,
     deleteAcceptedFileExit,
     deleteSexPhoto,
     deleteMasonryPhoto,
     deleteExitPhoto,
     match,
     setDivorceSuccess,
     clearDivorceSuccess,
     setDivorceError,
     clearDivorceError,
     setDivorceUpdateRequest,
     setDivorce,
     getDivorce,
     clearDivorce,
     clearDivorceAcceptedFiles,
     submit
 }) => {
    const { toTraitClass } = new Pipes();

    const onDropSex = useCallback(acceptedFiles => setAcceptedFilesSex(acceptedFiles), []);
    const onDropMasonry= useCallback(acceptedFiles => setAcceptedFilesMasonry(acceptedFiles), []);
    const onDropExit = useCallback(acceptedFiles => setAcceptedFilesExit(acceptedFiles), []);

    const { register, handleSubmit, watch, setValue, errors } = useForm({
        defaultValues: {
            ...divorce,
            male: '',
            female: ''
        }
    });

    const handleChange = (e) => {
        setValue(e.target.name, e.target.value);
    };

    // const submit = (data) => {
    //     setDivorceUpdateRequest();
    //     if (match.params.divorceId) {
    //         dataService.updateDivorce({
    //             id: match.params.divorceId,
    //             ...data,
    //             male: divorce.male,
    //             female: divorce.female,
    //             cb: divorce.cb,
    //             acceptedFilesSex: divorce.acceptedFilesSex,
    //             acceptedFilesMasonry: divorce.acceptedFilesMasonry,
    //             acceptedFilesExit: divorce.acceptedFilesExit,
    //             sexPhotos: divorce.sexPhotos,
    //             masonryPhotos: divorce.masonryPhotos,
    //             exitPhotos: divorce.exitPhotos,
    //         })
    //             .then((data) => {
    //                 setDivorceUpdateRequest();
    //                 setDivorceSuccess(data.message);
    //                 clearDivorceAcceptedFiles();
    //                 getDivorce();
    //                 setTimeout(() => clearDivorceSuccess(), 5000);
    //             })
    //             .catch( (error) => {
    //                 setDivorceUpdateRequest();
    //                 setDivorceError({
    //                     errors: error.response.data.errors,
    //                     status: error.status
    //                 });
    //                 setTimeout(() => clearDivorceError(), 5000);
    //             });
    //
    //     } else {
    //         dataService.setDivorce({
    //             ...data,
    //             male: divorce.male,
    //             female: divorce.female,
    //             cb: divorce.cb,
    //             acceptedFilesSex: divorce.acceptedFilesSex,
    //             acceptedFilesMasonry: divorce.acceptedFilesMasonry,
    //             acceptedFilesExit: divorce.acceptedFilesExit
    //         })
    //             .then((data) => {
    //                 setDivorceSuccess(data.message);
    //                 setDivorceUpdateRequest();
    //                 clearDivorce();
    //                 setTimeout(() => clearDivorceSuccess(), 5000);
    //             })
    //             .catch( (error) => {
    //                 setDivorceError({
    //                     errors: error.response.data.errors,
    //                     status: error.status
    //                 });
    //                 setDivorceUpdateRequest();
    //                 setDivorce({
    //                     ...data,
    //                     male: divorce.male,
    //                     female: divorce.female,
    //                     cb: divorce.cb,
    //                 });
    //
    //                 setTimeout(() => clearDivorceError(), 5000)
    //             });
    //
    //     }
    // };

    const values = watch();

    const onSearchMorphs = (e, male = true) => {
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
                    if (male) {
                        setDivorceSearchResultMale(arr)
                    } else {
                        setDivorceSearchResultFemale(arr)
                    }
                });
        }
    };

    const onSelectMorph = (e, male = true) => {
        const node = searchList.current;
        if (e.key === 'Enter') {
            e.preventDefault();
            if (male) {
                setSelectedMorphMale(selectMorphIdx);
            } else {
                setSelectedMorphFemale(selectMorphIdx);
            }

            return clearSearchInput(male);
        }
        if (e.keyCode===38 && selectMorphIdx - 1 >= 0) {
            e.preventDefault();
            const pos = selectMorphIdx * 37;
            node.scrollTo(0, pos - 37);
            return setSelectMorphIdx(selectMorphIdx - 1);
        }

        if (e.keyCode===40 && (male ? selectMorphIdx + 1 < divorce.searchResultMale.length : selectMorphIdx + 1 < divorce.searchResultFemale.length)) {
            e.preventDefault();
            const pos = selectMorphIdx * 37 + 37;
            if (pos % 4 === 0 && pos > 0) {
                node.scrollTo(0, pos);
            }
            return setSelectMorphIdx(selectMorphIdx + 1);
        }
    };

    const clearSearchInput = (male = true) => {
        setSelectMorphIdx(0);
        if (male) {
            setValue('male', '');
            clearDivorceSearchResultMale();
        } else {
            setValue('female', '');
            clearDivorceSearchResultFemale();
        }

    };

    const searchList = useRef();

    const [morphsShowMale, setMorphsShowMale] = useState(false);
    const [morphsShowFemale, setMorphsShowFemale] = useState(false);
    const [selectedKind, setSelectKind] = useState(allKinds.find((item) => item.id == values.kindId));
    const [selectMorphIdx, setSelectMorphIdx] = useState(0);

    const {getRootProps: getRootPropsSex, getInputProps: getInputPropsSex} = useDropzone({
        onDrop: onDropSex,
        multiple: true,
        accept: 'image/jpeg, image/png'
    });

    const {getRootProps: getRootPropsMasonry, getInputProps: getInputPropsMasonry} = useDropzone({
        onDrop: onDropMasonry,
        multiple: true,
        accept: 'image/jpeg, image/png'
    });

    const {getRootProps: getRootPropsExit, getInputProps: getInputPropsExit} = useDropzone({
        onDrop: onDropExit,
        multiple: true,
        accept: 'image/jpeg, image/png'
    });

    const value = divorce.cb
        ? new Date(divorce.cb)
        : "";

    return (
        <Row className="justify-content-center">
            <Col xs={12} md={9}>
                <Form className="feather-shadow form-container" onSubmit={handleSubmit(submit)}>
                    <HandelSuccess success={divorce.success}/>
                    <HandelError error={divorce.error}/>
                    <GroupFormConrol
                        label="Название"
                        errors={errors}
                        controls={{
                            type: "text",
                            name: "title",
                            value: values.title,
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
                                        if (divorce.kindId !== e.target.value) {
                                            deleteMaleAndFemaleMorphs();
                                        }
                                        setSelectKind(allKinds.find((item) => item.id == values.kindId));
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
                                    <Form.Label>Выберите подкатегорию:</Form.Label>
                                    <div className="select-wrap">
                                        <Form.Control
                                            as="select"
                                            name="subcategoryId"
                                            placeholder="Выберите подкатегорию..."
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
                    <Form.Group>
                        <Form.Label>Дата выхода:</Form.Label>
                        <DayPickerInput
                            value={value}
                            onDayChange={(day) => setDivorceCb(day)}
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
                    <Form.Group>
                        <Form.Label>Самец:</Form.Label>
                        <Form.Control
                            type="text"
                            name="male"
                            value={values.male}
                            onChange={onSearchMorphs}
                            onKeyDown={onSelectMorph}
                            ref={register}
                            onFocus={() => setMorphsShowMale(true)}
                            onBlur={() => setTimeout(() => setMorphsShowMale(false), 200)}
                            placeholder="Начните вводить название морфы..."
                        />
                        {
                            divorce.searchResultMale.length > 0 && morphsShowMale ?
                                (
                                    <ul className="morphs d-inline-flex flex-column search-morphs" ref={searchList}>
                                        {
                                            divorce.searchResultMale.map( (gene, idx) => (
                                                <li
                                                    key={`${gene.title}-${gene.trait.title}-${gene.id}`}
                                                    className={"search-morphs-item " + (selectMorphIdx === idx ? "selected" : "")}
                                                    onClick={() => {
                                                        setSelectedMorphMale(idx);
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
                                divorce.male.map( ({gene, trait}, idx) => (
                                    <div
                                        key={`morphs-${gene.title}-${trait.title}-${gene.id}`}
                                        className={`morph-indicator morph-${toTraitClass(`${gene.type}-${trait.title}`)} d-inline-block`}
                                    >
                                        {trait.title} {gene.title}
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            size="lg"
                                            onClick={() => deleteMaleMorph(idx)}
                                            className="delete pl-1"/>
                                    </div>
                                ))
                            }
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Самка:</Form.Label>
                        <Form.Control
                            type="text"
                            name="female"
                            value={values.female}
                            onChange={(e) => onSearchMorphs(e, false)}
                            onKeyDown={(e) => onSelectMorph(e, false)}
                            ref={register}
                            onFocus={() => setMorphsShowFemale(true)}
                            onBlur={() => setTimeout(() => setMorphsShowFemale(false), 200)}
                            placeholder="Начните вводить название морфы..."
                        />
                        {
                            divorce.searchResultFemale.length > 0 && morphsShowFemale ?
                                (
                                    <ul className="morphs d-inline-flex flex-column search-morphs" ref={searchList}>
                                        {
                                            divorce.searchResultFemale.map( (gene, idx) => (
                                                <li
                                                    key={`${gene.title}-${gene.trait.title}-${gene.id}`}
                                                    className={"search-morphs-item " + (selectMorphIdx === idx ? "selected" : "")}
                                                    onClick={() => {
                                                        setSelectedMorphFemale(idx);
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
                                divorce.female.map( ({gene, trait}, idx) => (
                                    <div
                                        key={`morphs-${gene.title}-${trait.title}-${gene.id}`}
                                        className={`morph-indicator morph-${toTraitClass(`${gene.type}-${trait.title}`)} d-inline-block`}
                                    >
                                        {trait.title} {gene.title}
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            size="lg"
                                            onClick={() => deleteFemaleMorph(idx)}
                                            className="delete pl-1"/>
                                    </div>
                                ))
                            }
                        </div>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className={divorce.sexPhotos.length === 0 ? 'm-0' : ''}>Фото спаривания:</Form.Label>
                        {
                            divorce.sexPhotos ?
                                (
                                    <div className="product-imgs d-flex">
                                        {
                                            divorce.sexPhotos.map( (item, idx) => (
                                                <div className="preview mr-1" key={`loaded-${idx}`}>
                                                <span
                                                    className="preview-delete"
                                                    onClick={ () => deleteSexPhoto(idx)}
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
                        <div {...getRootPropsSex({ className: 'drag-and-drop-container feather-shadow'})}>
                            <input {...getInputPropsSex({
                                name: 'sex',
                                className: 'drag-and-drop-input'
                            })}/>
                            <div className="d-flex outline">
                                {
                                    divorce.acceptedFilesSex[0] ?
                                        divorce.previewsSex.map( (item, idx) => (
                                            <div className="preview mr-1" key={`prew-sex-${idx}`}>
                                                <span className="preview-delete" onClick={ e => { e.stopPropagation(); deleteAcceptedFileSex(idx)}}><FontAwesomeIcon icon={faTimes} size="sm"/> </span>
                                                <img src={item} alt={`prew-${idx}`} className="img-fluid"/>
                                            </div>
                                        )) : <span className="m-auto">Перетащите файлы сюда,<br/>либо кликните для выбора</span>
                                }
                            </div>
                        </div>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className={divorce.masonryPhotos.length === 0 ? 'm-0' : ''}>Фото кладки:</Form.Label>
                        {
                            divorce.masonryPhotos ?
                                (
                                    <div className="product-imgs d-flex">
                                        {
                                            divorce.masonryPhotos.map( (item, idx) => (
                                                <div className="preview mr-1" key={`loaded-${idx}`}>
                                                <span
                                                    className="preview-delete"
                                                    onClick={ () => deleteMasonryPhoto(idx)}
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
                        <div {...getRootPropsMasonry({ className: 'drag-and-drop-container feather-shadow'})}>
                            <input {...getInputPropsMasonry({
                                name: 'masonry',
                                className: 'drag-and-drop-input'
                            })}/>
                            <div className="d-flex outline">
                                {
                                    divorce.acceptedFilesMasonry[0] ?
                                        divorce.previewsMasonry.map( (item, idx) => (
                                            <div className="preview mr-1" key={`prew-masonry-${idx}`}>
                                                <span className="preview-delete" onClick={ e => { e.stopPropagation(); deleteAcceptedFileMasonry(idx)}}><FontAwesomeIcon icon={faTimes} size="sm"/> </span>
                                                <img src={item} alt={`prew-${idx}`} className="img-fluid"/>
                                            </div>
                                        )) : <span className="m-auto">Перетащите файлы сюда,<br/>либо кликните для выбора</span>
                                }
                            </div>
                        </div>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className={divorce.exitPhotos.length === 0 ? 'm-0' : ''}>Фото выхода:</Form.Label>
                        {
                            divorce.exitPhotos ?
                                (
                                    <div className="product-imgs d-flex">
                                        {
                                            divorce.exitPhotos.map( (item, idx) => (
                                                <div className="preview mr-1" key={`loaded-${idx}`}>
                                                <span
                                                    className="preview-delete"
                                                    onClick={ () => deleteExitPhoto(idx)}
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
                        <div {...getRootPropsExit({ className: 'drag-and-drop-container feather-shadow'})}>
                            <input {...getInputPropsExit({
                                name: 'exit',
                                className: 'drag-and-drop-input'
                            })}/>
                            <div className="d-flex outline">
                                {
                                    divorce.acceptedFilesExit[0] ?
                                        divorce.previewsExit.map( (item, idx) => (
                                            <div className="preview mr-1" key={`prew-exit-${idx}`}>
                                                <span className="preview-delete" onClick={ e => { e.stopPropagation(); deleteAcceptedFileExit(idx)}}><FontAwesomeIcon icon={faTimes} size="sm"/> </span>
                                                <img src={item} alt={`prew-${idx}`} className="img-fluid"/>
                                            </div>
                                        )) : <span className="m-auto">Перетащите файлы сюда,<br/>либо кликните для выбора</span>
                                }
                            </div>
                        </div>
                    </Form.Group>
                    <input type="submit" value="Сохранить" className="btn btn-main"/>
                </Form>
            </Col>
        </Row>
    )
};

const mapStateToProps = ({auth: {loginRequest}, product, profile: {user}, kinds: {all: allKinds}, divorce}) => ({
    user,
    product,
    allKinds,
    loginRequest,
    divorce
});

export default connect(mapStateToProps, {
    deleteMaleAndFemaleMorphs,
    setDivorceSearchResultMale,
    setSelectedMorphMale,
    clearDivorceSearchResultMale,
    setDivorceSearchResultFemale,
    setSelectedMorphFemale,
    clearDivorceSearchResultFemale,
    deleteMaleMorph,
    deleteFemaleMorph,
    setAcceptedFilesSex,
    setAcceptedFilesMasonry,
    setAcceptedFilesExit,
    deleteAcceptedFileSex,
    deleteAcceptedFileMasonry,
    deleteAcceptedFileExit,
    deleteSexPhoto,
    deleteMasonryPhoto,
    deleteExitPhoto,
    setDivorceCb,
    setDivorceSuccess,
    clearDivorceSuccess,
    setDivorceError,
    clearDivorceError,
    setDivorceUpdateRequest,
    setDivorce,
    clearDivorce
})(DivorceSettings);
