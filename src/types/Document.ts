import { UUID } from "crypto";

export interface Document {
  id: UUID;
  name: string;
  file_type: number;
  size: number;
  s3_location: string;
  created_at: Date;
}
