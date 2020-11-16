export interface IFormComponentProps {
    id?: string
    label?: string
    placeholder?: string
    required?: boolean
    className?: string
    group?: boolean
    description?: string
    loadOptions?: (inputValue: string, callback: (options: any) => void) => void
    value?: any
    options?: Array<{
        label: string
        value: string
    }>
}
