export interface IOption {
    label: any
    value: string|number|any
}

export type FilterPropsType = {
    id: string
    autoSize?: boolean
    isSearchable?: boolean
    name: string
    placeholder?: string
    className?: string
    options: Array<IOption>
    onFilter?: (option: IOption) => void
};
