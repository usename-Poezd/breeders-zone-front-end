export interface IMorph {
    gene_id: number
    trait_id: number
    gene: {
        id: number
        title: string
        type: string
    }
    trait: {
        id: number
        title: string
        type: string
        trait_group: {
            label: string
            title: string
        }|null
    }
}
