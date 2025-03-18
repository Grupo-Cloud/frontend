import type React from "react"
import { Button } from "@/components/ui/button"
import { FileTextIcon, HistoryIcon, PlusCircleIcon, PlusIcon } from "lucide-react"
import { useRef } from "react"

interface SidebarButtonProps {
  onCreateChat?: () => void
  activeTab: "sources" | "history"
  setActiveTab: (tab: "sources" | "history") => void
  documentsLength: number
  onFileSelected: (file: File) => void
}

export function SidebarButton({
  onCreateChat,
  activeTab,
  setActiveTab,
  documentsLength,
  onFileSelected,
}: Readonly<SidebarButtonProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null)


  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; 
      onFileSelected(file); 
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2 p-4">
      <Button className="w-full" variant="default" onClick={onCreateChat} disabled={documentsLength === 0}>
        <PlusCircleIcon className="h-4 w-4 mr-2" />
        Create Chat
      </Button>
      <div className="grid grid-cols-2 gap-2" >
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

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.docx,.doc,.txt,.md"
        multiple={false}
      />

      <Button className="w-full" variant="outline" onClick={() => fileInputRef.current?.click()}>
        <PlusIcon className="h-4 w-4 mr-2" />
        Add source
      </Button>
    </div>
  )
}

