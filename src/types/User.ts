import { UUID } from "crypto";
import { Chat } from "@/types/Chat";
import { Document } from "@/types/Document";

export interface User {
  id: UUID;
  email: string;
  username: string;
}

export interface UserDetail extends User {
  documents: Document[];
  chats: Chat[];
}
