export interface IFromDropzoneProps {
    multiple?: boolean
    accept?: string
    onDrop?: (acceptedFiles: Array<File>) => void
}
