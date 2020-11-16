export interface IMorphsItemProps {
    title: string
    traits: Array<{
        title: string
        label?: string
        type: string
        products_count: number
    }>
}
