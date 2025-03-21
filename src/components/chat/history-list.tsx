import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import { Chat } from "@/types/Chat"

interface HistoryListProps {
  chats: Chat[]
  selectedChat: Chat  | undefined
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
}

export function HistoryList({ chats, selectedChat, onSelectChat, onDeleteChat }: Readonly<HistoryListProps>) {

  const formatDate = (date: string): string => {
    const validDate = new Date(date); 
  
    if (isNaN(validDate.getTime())) {
      throw new Error("Invalid date format");
    }
  
    return validDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      {chats.length === 0 ? (
        <div className="text-center text-muted-foreground text-sm p-4">
          No chat history yet. Start a new chat to begin.
        </div>
      ) : (
        <div className="space-y-2">
          {chats.slice().reverse().map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "relative group flex flex-col rounded-md border p-3 cursor-pointer hover:bg-accent",
                selectedChat?.id === chat.id && "bg-accent",
              )}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="font-medium truncate">{chat.name}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">{formatDate(chat.creation_date)}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteChat(chat.id)
                }}
                className="absolute right-2 top-2 h-6 w-6"
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

