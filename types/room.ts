import {IUser} from "./user";
import {IMessage} from "./message";

export interface IRoom {
    id: number
    is_dialog: boolean
    created_at: string
    updated_at: string
    users: Array<IUser>
    messages: Array<IMessage>
    message?: string
}
