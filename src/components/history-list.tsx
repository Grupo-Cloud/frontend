import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HistoryIcon, MessageCircleIcon, Trash2Icon } from "lucide-react"

interface HistoryListProps {
  chats: any[]
  selectedChat: string | null
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  formatDate: (dateString: string) => string
}

export function HistoryList({ chats, selectedChat, onSelectChat, onDeleteChat, formatDate }: HistoryListProps) {
  return (
    <div className="flex-1 overflow-auto">
      {chats.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
            <HistoryIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground max-w-[260px]">
            Your chat history will appear here. Start a new chat to begin.
          </p>
        </div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat.id}
            className={cn(
              "flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors",
              selectedChat === chat.id && "bg-muted",
            )}
          >
            <button onClick={() => onSelectChat(chat.id)} className="flex items-start gap-3 flex-1 min-w-0 text-left">
              <MessageCircleIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium truncate">{chat.title}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(chat.date)}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.preview}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs bg-muted-foreground/10 text-muted-foreground px-2 py-0.5 rounded-full">
                    {chat.messages} messages
                  </span>
                </div>
              </div>
            </button>
            <Button variant="ghost" size="icon" onClick={() => onDeleteChat(chat.id)} className="ml-2">
              <Trash2Icon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))
      )}
    </div>
  )
}

