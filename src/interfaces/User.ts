import { UUID } from "crypto"

interface User {
    email: string
    username: string
    id: UUID
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


export default User;