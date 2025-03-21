import { UUID } from "crypto";

export interface Message {
  content: string;
  from_user: boolean;
}

export interface GetMessage extends Message {
  id: UUID;
}
