export type ApiSuccessReturnType<T> = {
    ok: boolean
    message?: string
    data: T
    meta: {
        current_page: number,
        last_page: number
        from: number
        to: number
        per_page: number
        total: number
        selected_morphs?: Array<any>
        selected_localities?: Array<any>
        selected_subcategory?: Array<any>
    }
}
