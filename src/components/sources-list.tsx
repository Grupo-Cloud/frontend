import { Button } from "@/components/ui/button"
import { FileTextIcon, Trash2Icon } from "lucide-react"

interface SourcesListProps {
  documents: any[]
  onDeleteDocument: (id: string) => void
  formatFileSize: (bytes: number) => string
}

export function SourcesList({ documents, onDeleteDocument, formatFileSize }: SourcesListProps) {
  return (
    <div className="flex-1 overflow-auto">
      {documents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
            <FileTextIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground max-w-[260px]">
            Your sources will appear here. Click Add source to upload PDF files, websites, text, videos, or audio files.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <FileTextIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {doc.type} • {formatFileSize(doc.size)}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onDeleteDocument(doc.id)} className="ml-2">
                <Trash2Icon className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

