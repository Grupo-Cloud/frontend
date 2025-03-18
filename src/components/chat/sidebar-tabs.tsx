import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chat, Document } from "@/interfaces/User";
import { FileTextIcon, HistoryIcon } from "lucide-react";
import { HistoryList } from "./history-list";
import { SourceList } from "./sources-list";

interface SidebarTabsProps {
  documents: Document[];
  chats: Chat[];
  selectedChat: string | null;
  setSelectedChat: (chatId: string) => void;
  handleDeleteDocument: (documentId: string) => void;
  handleDeleteChat: (chatId: string) => void;
  formatFileSize: (size: number) => string;
}

export function SidebarTabs({
  documents,
  chats,
  selectedChat,
  setSelectedChat,
  handleDeleteDocument,
  handleDeleteChat,
  formatFileSize,
}: Readonly<SidebarTabsProps>) {
  
  return (
    <Tabs
      defaultValue="sources"
      className="pr-4 pl-4"
    >
      <TabsList className="grid grid-cols-2 gap-2">
        <TabsTrigger value="sources">
          <FileTextIcon className="h-4 w-4 mr-2" />
          Sources
        </TabsTrigger>
        <TabsTrigger value="history">
          <HistoryIcon className="h-4 w-4 mr-2" />
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sources">
        <SourceList
          documents={documents}
          onDeleteDocument={handleDeleteDocument}
          formatFileSize={formatFileSize}
        />
      </TabsContent>
      <TabsContent value="history">
        <HistoryList
          chats={chats}
          selectedChat={chats.find((chat) => chat.id === selectedChat)}
          onSelectChat={setSelectedChat}
          onDeleteChat={handleDeleteChat}
        />
      </TabsContent>
    </Tabs>
  );
}
