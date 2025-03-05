import { useState, useEffect } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import { UserNav } from "@/components/chat/user-nav"
import { SidebarButton } from "@/components/chat/sidebar-buttons"
import { SourceList } from "@/components/chat/sources-list"
import { HistoryList } from "@/components/chat/history-list"
import { ChatArea } from "@/components/chat/chat-area"
import { api } from "@/lib/api"
import { useAuth } from "@/providers/auth-provider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Document, UserDetail, Chat, ChatCreate } from "@/interfaces/User"



const ACCEPTED_FILE_TYPES = {
  "application/pdf": "PDF",
  "text/plain": "Text",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/msword": "DOC",
  "text/markdown": "Markdown",
} as const

export default function HomePage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"sources" | "history">("sources")

  const { token } = useAuth()

  const fetchUser = async (): Promise<UserDetail> => {
    const user = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return user.data
  }

  const createDocumentMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("upload_file", file)
      return await api.post(`/users/${user?.id}/documents`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
    },
    onSuccess: () => {
      refetchUser()
      toast.success("Document uploaded successfully")
    }
  });


  const createChatMutation = useMutation({
    mutationFn: async (chat: ChatCreate): Promise<Chat> => {
      const response = await api.post(`/users/${user?.id}/chats`, chat, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    },
    onSuccess: (response) => {
      refetchUser()
      setSelectedChat(response.id)
      toast.success("Chat created successfully")
    }
  })


  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/users/${user?.id}/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    },
    onSuccess: () => {
      refetchUser()
      toast.success("Document deleted successfully")
    }
  })

  const deleteChatMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/users/${user?.id}/chats/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    },
    onSuccess: () => {
      refetchUser()
      toast.success("Chat deleted successfully")
    }
  })

  const { data: user, isLoading: isLoadingUser, refetch: refetchUser } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!token,
  })

  useEffect(() => {
    if (user) {
      setDocuments(user.documents)
      setChats(user.chats)
    }
  }, [user])

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

  const handleFileSelected = (file: File) => {
    const maxSize = 10

    if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
      toast.error(`${file.name} is not a supported file type`)
      return
    }

    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`${file.name} exceeds ${maxSize}MB limit`)
      return
    }
    createDocumentMutation.mutateAsync(file)
  }

  const handleDeleteDocument = (id: string) => {
    deleteDocumentMutation.mutateAsync(id)
  }

  const handleDeleteChat = (id: string) => {
    deleteChatMutation.mutateAsync(id)
  }

  const handleCreateChat = () => {
    if (user?.id) {
      createChatMutation.mutateAsync({ name: "New Chat", user_id: user.id })
    } else {
      toast.error("User ID is undefined")
    }
  }


  const DesktopLayout = () => (
    <div className="hidden md:flex h-screen">
      <div className="w-[300px] border-r flex flex-col">
        <SidebarButton
          onCreateChat={handleCreateChat}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          documentsLength={documents.length}
          onFileSelected={handleFileSelected}
        />
        {activeTab === "sources" ? (
          <SourceList documents={documents} onDeleteDocument={handleDeleteDocument} formatFileSize={formatFileSize} />
        ) : (
          <HistoryList
            chats={chats}
            selectedChat={chats.find((chat) => chat.id === selectedChat)}
            onSelectChat={setSelectedChat}
            onDeleteChat={handleDeleteChat}
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
          selectedChat={chats.find((chat) => chat.id === selectedChat)}
          onFileSelected={handleFileSelected}
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
            <SidebarButton
              onCreateChat={() => {
                handleCreateChat()
                setIsSidebarOpen(false)
              }}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              documentsLength={documents.length}
              onFileSelected={handleFileSelected}
            />
            {activeTab === "sources" ? (
              <SourceList
                documents={documents}
                onDeleteDocument={handleDeleteDocument}
                formatFileSize={formatFileSize}
              />
            ) : (
              <HistoryList
                chats={chats}
                selectedChat={chats.find((chat) => chat.id === selectedChat)}
                onSelectChat={setSelectedChat}
                onDeleteChat={handleDeleteChat}
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
        selectedChat={chats.find((chat) => chat.id === selectedChat)}
        onFileSelected={handleFileSelected}
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

