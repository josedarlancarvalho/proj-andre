import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send } from "lucide-react";

// Interfaces
interface ConversationPreview {
  id: string;
  name: string;
  avatar?: string; // Avatar URL is optional
  lastMessage: string;
  time: string;
  unread: boolean;
  // Add other relevant fields like participant IDs if needed
}

interface Message {
  id: string;
  senderId: string; // ID of the sender (e.g., "hr", or a user ID)
  text: string;
  time: string;
  // Add other fields like 'readStatus', 'attachments' if needed
}

interface ActiveConversation extends ConversationPreview {
  // Potentially add more details if needed when a conversation is active
}

const HRMessages = () => {
  const [newMessage, setNewMessage] = useState(""); // Renamed from 'message' to avoid conflict
  const [conversationList, setConversationList] = useState<ConversationPreview[]>([]);
  const [activeConversationMessages, setActiveConversationMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ActiveConversation | null>(null);
  const [userName, setUserName] = useState("Carregando...");

  // Fetch initial user data and conversation list
  useEffect(() => {
    const fetchInitialData = async () => {
      // TODO: Replace with actual API call for user info
      // const userResponse = await fetch("/api/hr/user-info");
      // const userData = await userResponse.json();
      // setUserName(userData.name);
      setConversationList([]); // Initialize empty
      setSelectedConversation(null);
    };
    fetchInitialData();
  }, []);

  // Fetch messages when selectedConversation changes
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        // TODO: Replace with actual API call for messages in a conversation
        // const messagesResponse = await fetch(`/api/hr/conversations/${selectedConversation.id}/messages`);
        // const messagesData = await messagesResponse.json();
        // setActiveConversationMessages(messagesData);
        setActiveConversationMessages([]); // Initialize empty
      };
      fetchMessages();
    } else {
      setActiveConversationMessages([]); // Clear messages if no conversation selected
    }
  }, [selectedConversation]);

  // Mock data - REMOVED
  // const conversations = [
  // ... 
  // ];
  // const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  // const messages = [
  // ...
  // ];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      console.log("Sending message:", newMessage, "to conversation:", selectedConversation.id);
      // TODO: Implement API call to send message
      // Example: Add to local state for immediate feedback (optimistic update)
      const sentMessage: Message = {
        id: String(Date.now()), // Temporary ID
        senderId: "hr", // Assuming HR is sending
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setActiveConversationMessages(prev => [...prev, sentMessage]);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <UserPanelLayout userName={userName} userType="hr">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Mensagens</h1>
        </div>

        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-3 h-[calc(80vh-180px)]">
            {/* Conversations list */}
            <div className="border-r">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conversa..."
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="overflow-auto h-[calc(80vh-240px)]">
                {conversationList.length > 0 ? (
                  conversationList.map((conversation) => (
                    <div 
                      key={conversation.id} 
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                        selectedConversation?.id === conversation.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation as ActiveConversation)} // Cast needed if types differ slightly
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          <AvatarFallback>
                            {conversation.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium truncate">{conversation.name}</h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {conversation.time}
                            </span>
                          </div>
                          <p className={`text-sm truncate ${
                            conversation.unread ? "font-medium" : "text-muted-foreground"
                          }`}>
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Nenhuma conversa encontrada.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            {selectedConversation ? (
              <div className="flex flex-col md:col-span-2">
                <div className="p-4 border-b flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                    <AvatarFallback>
                      {selectedConversation.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedConversation.name}</h3>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
                  {activeConversationMessages.length > 0 ? (
                    activeConversationMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.senderId === "hr" ? "justify-end" : ""}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.senderId === "hr" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span className={`text-xs ${
                            msg.senderId === "hr" 
                              ? "text-primary-foreground/80" 
                              : "text-muted-foreground"
                          } block text-right mt-1`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-muted-foreground">Selecione uma conversa para ver as mensagens ou envie uma nova mensagem.</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={newMessage} // Changed from message to newMessage
                      onChange={(e) => setNewMessage(e.target.value)} // Changed from setMessage to setNewMessage
                      onKeyDown={handleKeyDown}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="md:col-span-2 flex items-center justify-center h-full">
                <p className="text-muted-foreground">Selecione uma conversa para começar.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default HRMessages;
