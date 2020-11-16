export interface ITrait {
    id: number
    title: string
    type: string
    trait_group: {
        label: string
        title: string
    }|null
}
