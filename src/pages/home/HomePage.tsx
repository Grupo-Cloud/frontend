import { useState, useEffect } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import { UserNav } from "@/components/chat/user-nav"
import { SidebarButtons } from "@/components/chat/sidebar-buttons"
import { SourcesList } from "@/components/chat/sources-list"
import { HistoryList } from "@/components/chat/history-list"
import { ChatArea } from "@/components/chat/chat-area"
import { api } from "@/lib/api"
import { useAuth } from "@/providers/auth-provider"
import { useQuery } from "@tanstack/react-query"


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


export default function HomePage() {

  const [documents, setDocuments] = useState<any[]>([])
  const [chats, setChats] = useState(mockChats)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"sources" | "history">("sources")

  const { token } = useAuth();

  const fetchUser = async () => {
    const user = await api.get("/users/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return user.data;
  };

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!token,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (isLoadingUser) {
    return <div>Loading...</div>
  }

  

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleUploadComplete = (files: File[]) => {
    setIsUploadOpen(false)
    setDocuments((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type || "Unknown",
        size: file.size,
        lastModified: file.lastModified,
      })),
    ])
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id))
    if (selectedChat === id) {
      setSelectedChat(null)
    }
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

  const handleCreateChat = () => {
    console.log("Creating new chat")
  }

  const DesktopLayout = () => (
    <div className="hidden md:flex h-screen">
      <div className="w-[300px] border-r flex flex-col">
        <SidebarButtons
          onCreateChat={handleCreateChat}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isUploadOpen={isUploadOpen}
          setIsUploadOpen={setIsUploadOpen}
          documentsLength={documents.length}
          onUploadComplete={handleUploadComplete}
        />
        {activeTab === "sources" ? (
          <SourcesList documents={documents} onDeleteDocument={handleDeleteDocument} formatFileSize={formatFileSize} />
        ) : (
          <HistoryList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            onDeleteChat={handleDeleteChat}
            formatDate={formatDate}
          />
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="border-b flex items-center justify-between px-4 py-2">
          <div className="flex-1 text-center font-semibold">Chat</div>
          <UserNav user={user} />
        </div>
        <ChatArea
          documents={documents}
          selectedChat={selectedChat}
          isUploadOpen={isUploadOpen}
          setIsUploadOpen={setIsUploadOpen}
          onUploadComplete={handleUploadComplete}
          onCreateChat={handleCreateChat}
        />
      </div>
    </div>
  )

  const MobileLayout = () => (
    <div className="md:hidden h-screen flex flex-col">
      <div className="border-b flex items-center justify-between px-4 py-2">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="w-full max-w-[300px] p-0">
            <SidebarButtons
              onCreateChat={() => {
                handleCreateChat()
                setIsSidebarOpen(false)
              }}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isUploadOpen={isUploadOpen}
              setIsUploadOpen={setIsUploadOpen}
              documentsLength={documents.length}
              onUploadComplete={handleUploadComplete}
            />
            {activeTab === "sources" ? (
              <SourcesList
                documents={documents}
                onDeleteDocument={handleDeleteDocument}
                formatFileSize={formatFileSize}
              />
            ) : (
              <HistoryList
                chats={chats}
                selectedChat={selectedChat}
                onSelectChat={setSelectedChat}
                onDeleteChat={handleDeleteChat}
                formatDate={formatDate}
              />
            )}
          </SheetContent>
        </Sheet>
        <button onClick={() => setIsSidebarOpen(true)} className="flex h-9 w-9 items-center justify-center">
          <MenuIcon className="h-5 w-5" />
        </button>
        <div className="flex-1 text-center font-semibold">Chat</div>
        <UserNav user={user} />
      </div>
      <ChatArea
        documents={documents}
        selectedChat={selectedChat}
        isUploadOpen={isUploadOpen}
        setIsUploadOpen={setIsUploadOpen}
        onUploadComplete={handleUploadComplete}
        onCreateChat={handleCreateChat}
      />
    </div>
  )

  return (
    <>
      <DesktopLayout />
      <MobileLayout />
    </>
  )
}

