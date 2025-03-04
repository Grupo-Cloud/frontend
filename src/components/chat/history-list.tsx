import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Trash2 } from "lucide-react"

interface HistoryListProps {
  chats: {
    id: string
    title: string
    preview: string
    date: string
    messages: number
  }[]
  selectedChat: string | null
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  formatDate: (date: string) => string
}

export function HistoryList({ chats, selectedChat, onSelectChat, onDeleteChat, formatDate }: HistoryListProps) {
  return (
    <div className="flex-1 overflow-auto p-4">
      <h2 className="font-semibold mb-4">Chat History</h2>
      {chats.length === 0 ? (
        <div className="text-center text-muted-foreground text-sm p-4">
          No chat history yet. Start a new chat to begin.
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "relative group flex flex-col rounded-md border p-3 cursor-pointer hover:bg-accent",
                selectedChat === chat.id && "bg-accent",
              )}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="font-medium truncate">{chat.title}</div>
              <div className="text-xs text-muted-foreground truncate">{chat.preview}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">{formatDate(chat.date)}</div>
                <div className="text-xs text-muted-foreground">{chat.messages} messages</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteChat(chat.id)
                }}
                className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

