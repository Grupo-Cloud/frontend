import { UUID } from "crypto"

export interface Chat {
    id: UUID
    name: string
    creation_date: string
}

export interface ChatCreate {
    name: string
    user_id: UUID
}