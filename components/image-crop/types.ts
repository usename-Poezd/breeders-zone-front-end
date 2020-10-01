export interface Crop {
    unit?: "px"|"%",
    url?: string,
    aspect?: number,
    x: number,
    y: number,
    width: number,
    height: number,
    src: File
}

export interface ImageCropProps {
    aspect: number,
    onComplete: (corp: Crop) => void,
}

export interface ImageCropState {
    src: string,
    file: File|null,
    crop: Crop,
    realCrop: Crop|null,
    croppedImageUrl: string
}
