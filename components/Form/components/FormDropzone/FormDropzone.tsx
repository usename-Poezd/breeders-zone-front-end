import * as React from "react";
import {FC} from "react";
import {ErrorMessage, FieldProps} from "formik";
import {FormErrorMessage} from "../FormErrorMessage";
import {IFormComponentProps} from "../../types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import LazyImg from "../../../lazy-img";
import {IFromDropzoneProps} from "./types";

const FormDropzone: FC<IFormComponentProps & FieldProps & IFromDropzoneProps> = ({
    field,
    form,
    multiple = false,
    accept = 'image/jpeg, image/png',
    onDrop = () => {}
}) => {
    const previews: Array<string> = form.values[field.name + "Previews"];

    const handleDrop = useCallback((acceptedFiles: Array<File>) => {
        const preview = acceptedFiles.map( (item) => URL.createObjectURL(item));

        form.setFieldValue(field.name + "Previews", multiple ? [...previews, ...preview] : [...preview]);
        form.setFieldValue(field.name, multiple ? [...field.value, ...acceptedFiles] : acceptedFiles[0]);
        onDrop(acceptedFiles);
    }, []);

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        onDrop: handleDrop,
        multiple,
        accept
    });


    return (
        <React.Fragment>
            <div {...getRootProps({ className: 'drag-and-drop-container w-100 m-0 h-100 feather-shadow'})}>
                <input {...getInputProps({
                    name: field.name,
                    className: 'drag-and-drop-input'
                })}/>
                <div className="d-flex outline h-100">
                    {
                        acceptedFiles[0] ?
                            previews.map( (item, idx) => (
                                <div className="preview">
                                                    <span
                                                        className="preview-delete"
                                                        onClick={ (e) => {
                                                            e.stopPropagation();
                                                            const files = field.value;
                                                            if (multiple) {
                                                                files.splice(idx, 1);
                                                                form.setFieldValue(field.name, files);
                                                            } else {
                                                                form.setFieldValue(field.name, null);
                                                            }
                                                            acceptedFiles.splice(idx, 1);
                                                            previews.splice(idx, 1);
                                                            form.setFieldValue(field.name + "Previews", previews);
                                                        }}
                                                    >
                                                    <FontAwesomeIcon icon={faTimes} size="sm"/>
                                                </span>
                                    <LazyImg src={item} alt={`${field.name + "Previews"}-${idx}`} key={`${field.name + "Previews"}-${idx}`} className="img-fluid"/>
                                </div>
                            ))
                            : <span className="m-auto">Перетащите файлы сюда,<br/>либо кликните для выбора</span>
                    }
                </div>
            </div>
            <ErrorMessage component={FormErrorMessage} name={field.name}/>
        </React.Fragment>
    )
};

export {
    FormDropzone
}
