import React, {PureComponent} from "react";
import Dropzone from "react-dropzone";
import ReactCrop from "react-image-crop";
import {Crop, ImageCropProps, ImageCropState} from "./types";

class ImageCrop extends PureComponent<ImageCropProps, ImageCropState>{

    state: Readonly<ImageCropState> = {
        src: '',
        croppedImageUrl: '',
        realCrop: null,
        file: null,
        crop:  {
            unit: '%',
            width: 30,
            aspect: this.props.aspect,
        } as Crop
    };
    imageRef: HTMLImageElement|null = null;
    fileUrl = '';

    clearState = () => {
        this.setState({
            src: '',
            file: null,
            croppedImageUrl: '',
            realCrop: null,
            crop:  {
                unit: '%',
                width: 30,
                aspect: this.props.aspect,
            } as Crop
        });
    };

    onDrop = (acceptedFiles: Array<File>) => {
        this.setState({
            file: acceptedFiles[0],
            src: URL.createObjectURL(acceptedFiles[0])
        });
    };

    // If you setState the crop in here you should return false.
    onImageLoaded = (image: HTMLImageElement) => {
        this.imageRef = image;
    };

    onCropComplete = (crop: Crop) => this.makeClientCrop(crop);

    onCropChange = (crop: Crop) => {
        this.setState({ crop: crop });
    };

    async makeClientCrop(crop: Crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop
            );

            const scaleX = this.imageRef.naturalWidth / this.imageRef.width;
            const scaleY = this.imageRef.naturalHeight / this.imageRef.height;

            this.setState({ croppedImageUrl });
            const newCrop: Crop = {
                x: Math.ceil(crop.x * scaleX),
                y: Math.ceil(crop.y * scaleY),
                width: this.props.aspect === 1 ? Math.ceil(crop.height * scaleY) : Math.ceil(crop.width * scaleX),
                height: Math.ceil(crop.height * scaleY),
                src: this.state.file,
                url: croppedImageUrl
            };

            this.setState({realCrop: newCrop});
        }
    }

    getCroppedImg(image: HTMLImageElement, crop: Crop): Promise<string> {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );
        }

        return new Promise((resolve) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, 'image/jpeg');
        });
    }

   render() {
       const {src, crop, realCrop} = this.state;
       return (
           <React.Fragment>
               <p className="text-center mb-3">
                   {
                       !src ?
                           'Вы можете загрузить изображение в формате JPG, GIF или PNG.'
                           : 'Выберете область фотографии.'
                   }
               </p>
               <Dropzone
                   onDrop={this.onDrop}
                   multiple={false}
                   accept="image/jpeg, image/png, image/svg"
               >
                   {
                       ({getRootProps, getInputProps}) => (
                            <React.Fragment>
                                {
                                    !src &&
                                        <div {...getRootProps({ className: 'drag-and-drop-container feather-shadow'})}>
                                            <input {...getInputProps({
                                                name: 'logo',
                                                className: 'drag-and-drop-input'
                                            })}/>
                                            <div className="d-flex outline">
                                                <span className="m-auto">Перетащите файлы сюда,<br/>либо кликните для выбора</span>
                                            </div>
                                        </div>
                                }
                            </React.Fragment>
                       )
                   }
               </Dropzone>

               {
                   src &&
                       <ReactCrop
                           src={src}
                           crop={crop}
                           ruleOfThirds
                           onImageLoaded={this.onImageLoaded}
                           onComplete={this.onCropComplete}
                           onChange={this.onCropChange}
                       />
               }

               {
                   src &&
                       <div className="d-flex align-items-center">
                           <button className="btn btn-main mr--10" onClick={() => this.props.onComplete(realCrop)}>Сохранить</button>
                           <button className="btn btn-gray" onClick={this.clearState}>Вернуться назад</button>
                       </div>
               }
           </React.Fragment>
       );
   }
}

export default ImageCrop;
