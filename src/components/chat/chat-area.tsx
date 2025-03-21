import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircleIcon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Document } from "@/types/Document";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Chat } from "@/types/Chat";
import { GetMessage, Message } from "@/types/Message";
import { LLMRequest } from "@/types/LLM";

interface ChatAreaProps {
  documents: Document[];
  selectedChat: Chat | undefined;
  onFileSelected: (file: File) => void;
  onCreateChat: () => void;
}

export function ChatArea({
  documents,
  selectedChat,
  onFileSelected,
  onCreateChat,
}: Readonly<ChatAreaProps>) {
  const [message, setMessage] = useState<Message["content"]>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelected(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const fetchChatMessages = async () => {
    const response = await api.get(`/chats/${selectedChat?.id}/messages`);
    return response.data;
  };

  const { data: chatMessages } = useQuery<GetMessage[] | undefined>({
    queryKey: ["chatMessages", selectedChat?.id],
    queryFn: fetchChatMessages,
    enabled: !!selectedChat,
  });

  const createChatMessageMutation = useMutation({
    mutationKey: ["addChatMessage", selectedChat?.id],
    mutationFn: async (message: Message) => {
      return await api.post(`/chats/${selectedChat?.id}/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", selectedChat?.id],
      });
    },
  });

  const createLLMResponseMutation = useMutation({
    mutationFn: async (message: LLMRequest) => {
      const query = message.content;
      const response = await api.post(
        `/llm/generate?query=${encodeURIComponent(query)}`
      );
      return response.data;
    },
    onSuccess: async (data) => {
      await createChatMessageMutation.mutateAsync({
        content: data.response.content,
        from_user: false,
      });
    },
  });

  const handleSendMessage = async () => {
    if (message.trim() === "") {
      return;
    }
    await createChatMessageMutation.mutateAsync({
      content: message,
      from_user: true,
    });
    await createLLMResponseMutation.mutateAsync({ content: message });
    setMessage("");
  };

  return (
    <div className="flex-1 flex flex-col">
      {documents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <UploadIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Add a source to get started
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-[300px]">
            Upload your documents to start chatting with your data
          </p>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc,.txt,.md,.csv"
            multiple={false}
          />

          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload a source
          </Button>
        </div>
      ) : selectedChat ? (
        <div className="flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col-reverse overflow-y-auto p-4">
            {chatMessages && chatMessages.length > 0 ? (
              chatMessages
                .slice()
                .reverse()
                .map((message: GetMessage) => (
                  <div key={message.id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <MessageCircleIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-sm text-muted-foreground text-center p-4">
                ¡Start the conversation!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageCircleIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Start a new chat</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-[300px]">
            Click the "Create Chat" button to start a new conversation using
            your uploaded sources.
          </p>
          <Button onClick={onCreateChat}>Create Chat</Button>
        </div>
      )}
      <div className="p-4 border-t">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border bg-muted px-4 py-2",
            (documents.length === 0 || !selectedChat) && "opacity-50"
          )}
        >
          <input
            type="text"
            placeholder={
              documents.length === 0
                ? "Upload a source to start chatting..."
                : "Type your message..."
            }
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            disabled={documents.length === 0 || !selectedChat}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            size="icon"
            variant="ghost"
            disabled={documents.length === 0 || !selectedChat}
            onClick={handleSendMessage}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
