import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Document } from "@/types/Document";

interface SourceListProps {
  documents: Document[];
  onDeleteDocument: (id: string) => void;
  formatFileSize: (bytes: number) => string;
}

export function SourceList({
  documents,
  onDeleteDocument,
  formatFileSize,
}: Readonly<SourceListProps>) {
  return (
    <div className="flex-1 overflow-auto">
      {documents.length === 0 ? (
        <div className="text-center text-muted-foreground text-sm p-4">
          No sources added yet. Upload a document to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate" title={doc.name}>
                  {doc.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(doc.size)}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteDocument(doc.id)}
                className="h-8 w-8 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
