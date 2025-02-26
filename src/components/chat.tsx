
import { useState, useEffect } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { PlusIcon, MenuIcon, FileTextIcon, HistoryIcon, UploadIcon, MessageCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"

// Mock data for chat history
const mockChats = [
  {
    id: "1",
    title: "Research on AI Ethics",
    preview: "Discussion about the implications of AI in healthcare",
    date: "2024-02-26T10:30:00",
    messages: 12,
  },
  {
    id: "2",
    title: "Data Analysis Project",
    preview: "Analyzing quarterly sales data and trends",
    date: "2024-02-25T15:45:00",
    messages: 8,
  },
  {
    id: "3",
    title: "Technical Documentation",
    preview: "API documentation review and updates",
    date: "2024-02-24T09:15:00",
    messages: 15,
  },
]

export function Chat() {
  const [documents, setDocuments] = useState<any[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleUploadComplete = (urls: string[]) => {
    console.log("Uploaded files:", urls)
    setIsUploadOpen(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return "Today"
    } else if (days === 1) {
      return "Yesterday"
    } else if (days < 7) {
      return `${days} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const DesktopLayout = () => (
    <div className="hidden md:flex h-screen">
      <div className="w-[300px] border-r flex flex-col">
        <div className="border-b p-2">
          <Tabs defaultValue="sources">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="sources" className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4" />
                Sources
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <HistoryIcon className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="sources" className="mt-2">
              <div className="p-4">
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
                      <FileUploader onUploadComplete={handleUploadComplete} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {documents.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                    <FileTextIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground max-w-[260px]">
                    Your sources will appear here. Click Add source to upload PDF files, websites, text, videos, or
                    audio files.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-auto">{/* Document list will go here */}</div>
              )}
            </TabsContent>
            <TabsContent value="history" className="mt-2">
              <div className="flex-1 overflow-auto">
                {mockChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat.id)
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors",
                      selectedChat === chat.id && "bg-muted",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <MessageCircleIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium truncate">{chat.title}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(chat.date)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{chat.preview}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs bg-muted-foreground/10 text-muted-foreground px-2 py-0.5 rounded-full">
                            {chat.messages} messages
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="border-b flex items-center justify-between px-4 py-2">
          <div className="flex-1 text-center font-semibold">Chat</div>
          <UserNav />
        </div>
        <div className="flex-1 flex flex-col">
          {documents.length === 0 && !selectedChat ? (
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
                    <FileUploader onUploadComplete={handleUploadComplete} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">{/* Chat messages will go here */}</div>
          )}
          <div className="p-4 border-t">
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border bg-muted px-4 py-2",
                documents.length === 0 && !selectedChat && "opacity-50",
              )}
            >
              <input
                type="text"
                placeholder="Upload a source to start chatting..."
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                disabled={documents.length === 0 && !selectedChat}
              />
              <Button size="icon" variant="ghost" disabled={documents.length === 0 && !selectedChat}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const MobileLayout = () => (
    <div className="md:hidden h-screen flex flex-col">
      <div className="border-b flex items-center justify-between px-4 py-2">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="w-full max-w-[300px] p-0" hideClose={true}>
            <Tabs defaultValue="sources" className="h-full flex flex-col">
              <div className="border-b p-2">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="sources" className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    Sources
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <HistoryIcon className="h-4 w-4" />
                    History
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="sources" className="flex-1 p-0">
                <div className="p-4">
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
                        <FileUploader onUploadComplete={handleUploadComplete} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {documents.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                      <FileTextIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground max-w-[260px]">
                      Your sources will appear here. Click Add source to upload PDF files, websites, text, videos, or
                      audio files.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-auto">{/* Document list will go here */}</div>
                )}
              </TabsContent>
              <TabsContent value="history" className="flex-1 p-0">
                <div className="flex-1 overflow-auto">
                  {mockChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => {
                        setSelectedChat(chat.id)
                        setIsSidebarOpen(false) // Close sidebar on mobile when selecting a chat
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors",
                        selectedChat === chat.id && "bg-muted",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <MessageCircleIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium truncate">{chat.title}</p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDate(chat.date)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{chat.preview}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs bg-muted-foreground/10 text-muted-foreground px-2 py-0.5 rounded-full">
                              {chat.messages} messages
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
        <button onClick={() => setIsSidebarOpen(true)} className="flex h-9 w-9 items-center justify-center">
          <MenuIcon className="h-5 w-5" />
        </button>
        <div className="flex-1 text-center font-semibold">Chat</div>
        <UserNav />
      </div>
      <div className="flex-1 flex flex-col">
        {documents.length === 0 && !selectedChat ? (
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
                  <FileUploader onUploadComplete={handleUploadComplete} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">{/* Chat messages will go here */}</div>
        )}
        <div className="p-4 border-t">
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border bg-muted px-4 py-2",
              documents.length === 0 && !selectedChat && "opacity-50",
            )}
          >
            <input
              type="text"
              placeholder="Upload a source to start chatting..."
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              disabled={documents.length === 0 && !selectedChat}
            />
            <Button size="icon" variant="ghost" disabled={documents.length === 0 && !selectedChat}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <DesktopLayout />
      <MobileLayout />
    </>
  )
}

