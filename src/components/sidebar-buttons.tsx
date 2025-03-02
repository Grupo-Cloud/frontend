import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileTextIcon, HistoryIcon, PlusCircleIcon, PlusIcon } from "lucide-react"
import { FileUploader } from "@/components/file-uploader"

interface SidebarButtonsProps {
  onCreateChat?: () => void
  activeTab: "sources" | "history"
  setActiveTab: (tab: "sources" | "history") => void
  isUploadOpen: boolean
  setIsUploadOpen: (open: boolean) => void
  documentsLength: number
  onUploadComplete: (files: File[]) => void
}

export function SidebarButtons({
  onCreateChat,
  activeTab,
  setActiveTab,
  isUploadOpen,
  setIsUploadOpen,
  documentsLength,
  onUploadComplete,
}: SidebarButtonsProps) {
  return (
    <div className="grid grid-cols-1 gap-2 p-4">
      <Button className="w-full" variant="default" onClick={onCreateChat} disabled={documentsLength === 0}>
        <PlusCircleIcon className="h-4 w-4 mr-2" />
        Create Chat
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button
          className="w-full"
          variant={activeTab === "sources" ? "default" : "outline"}
          onClick={() => setActiveTab("sources")}
        >
          <FileTextIcon className="h-4 w-4 mr-2" />
          Sources
        </Button>
        <Button
          className="w-full"
          variant={activeTab === "history" ? "default" : "outline"}
          onClick={() => setActiveTab("history")}
        >
          <HistoryIcon className="h-4 w-4 mr-2" />
          History
        </Button>
      </div>
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add source
          </Button>
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
  )
}

