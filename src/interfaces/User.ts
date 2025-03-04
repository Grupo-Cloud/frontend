import { UUID } from "crypto"


interface User {
    id: UUID
    email: string
    username: string
}

interface UserDetail extends User {
    documents: Document[]
    chats: Chat[]
}

interface Document {
    id: UUID
    name: string
    file_type: number
    size: number
    s3_location: string
    created_at: Date
}

interface Chat {
    id: UUID
    name: string
}

export type { User, UserDetail, Document, Chat }


