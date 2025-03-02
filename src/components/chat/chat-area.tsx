import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { MessageCircleIcon, UploadIcon } from "lucide-react"
import { FileUploader } from "@/components/chat/file-uploader"

interface ChatAreaProps {
  documents: any[]
  selectedChat: string | null
  isUploadOpen: boolean
  setIsUploadOpen: (open: boolean) => void
  onUploadComplete: (files: File[]) => void
  onCreateChat: () => void
}

export function ChatArea({
  documents,
  selectedChat,
  isUploadOpen,
  setIsUploadOpen,
  onUploadComplete,
  onCreateChat,
}: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col">
      {documents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <UploadIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Add a source to get started</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-[300px]">
            Upload your documents or paste a link to start chatting with your data
          </p>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Upload a source</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Source</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <FileUploader onUploadComplete={onUploadComplete} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : selectedChat ? (
        <div className="flex-1 overflow-hidden">{/* Chat messages will go here */}</div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageCircleIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Start a new chat</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-[300px]">
            Click the "Create Chat" button to start a new conversation using your uploaded sources.
          </p>
          <Button onClick={onCreateChat}>Create Chat</Button>
        </div>
      )}
      <div className="p-4 border-t">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border bg-muted px-4 py-2",
            (documents.length === 0 || !selectedChat) && "opacity-50",
          )}
        >
          <input
            type="text"
            placeholder={documents.length === 0 ? "Upload a source to start chatting..." : "Type your message..."}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            disabled={documents.length === 0 || !selectedChat}
          />
          <Button size="icon" variant="ghost" disabled={documents.length === 0 || !selectedChat}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}

