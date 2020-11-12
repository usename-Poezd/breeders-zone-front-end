export interface IMessage {
    newMessageKey?: string|number
    id: number
    user_id: number
    room_id: number
    message: string
    product_id?: number
    checked: boolean
    created_at: string
    updated_at: string
}
