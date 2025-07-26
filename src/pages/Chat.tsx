import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Header } from "../components/Header";
import { ChatBubble } from "../components/ChatBubble";
import { ChatInput } from "../components/ChatInput";
import { WelcomePrompts } from "../components/WelcomePrompts";
import { ChatHistory } from "../components/ChatHistory";
import { Settings } from "../components/Settings";
import { useToast } from "../hooks/usetoast";
import { useAuth } from "../hooks/useAuth";
import { useDatabase } from "../hooks/useDatabase";
import { islamicApiService } from "../services/islamicApi";

interface Message {
  id: string;
  text: string;
  type: "user" | "ai";
  timestamp: string;
}

type ChatView = "chat" | "history" | "settings";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ChatView>("chat");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const database = useDatabase(user?.id);

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      if (islamicApiService.isConfigured()) {
        const result = await islamicApiService.askQuestion({
          question: userMessage,
          language: "tr",
        });

        if (result.success && result.data) {
          return result.data.answer;
        }
      }

      const demoResponse = await islamicApiService.getDemoResponse(userMessage);
      return demoResponse.answer;
    } catch (error) {
      return "Üzgünüm, şu anda bir teknik sorun yaşıyoruz. Lütfen daha sonra tekrar deneyin.";
    }
  };

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    const profile = await database.getUserProfile();
    setUserProfile(profile);
  };

  const createNewSession = async (firstMessage: string): Promise<string | null> => {
    if (!user) return null;

    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");
    const preview = firstMessage.slice(0, 100);

    return await database.createChatSession(title, preview);
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      type: "user",
      timestamp: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let sessionId = currentSessionId;
      if (!sessionId && user) {
        sessionId = await createNewSession(text);
        setCurrentSessionId(sessionId);
      }

      if (sessionId && user) {
        await database.saveMessage(sessionId, text, "user");
      }

      const response = await generateResponse(text);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        type: "ai",
        timestamp: new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (sessionId && user) {
        await database.saveMessage(sessionId, response, "ai");
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const loadChatSession = async (sessionId: string) => {
    if (!user) return;

    const sessionMessages = await database.getChatMessages(sessionId);
    const convertedMessages: Message[] = sessionMessages.map((msg) => ({
      id: msg.id,
      text: msg.content,
      type: msg.message_type,
      timestamp: new Date(msg.created_at).toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    setMessages(convertedMessages);
    setCurrentSessionId(sessionId);
    setCurrentView("chat");
  };

  if (currentView === "history") {
    return (
      <ChatHistory
        onBack={() => setCurrentView("chat")}
        onSelectChat={loadChatSession}
      />
    );
  }

  if (currentView === "settings") {
    return (
      <Settings
        onBack={() => setCurrentView("chat")}
        onLogout={handleLogout}
        userProfile={userProfile}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header
        onOpenHistory={() => setCurrentView("history")}
        onOpenMenu={() => setCurrentView("settings")}
      />

      <ScrollView contentContainerStyle={styles.messagesContainer}>
        {messages.length === 0 ? (
          <WelcomePrompts onSelectPrompt={handleSendMessage} />
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message.text}
                type={message.type}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#336699" />
              </View>
            )}
          </>
        )}
      </ScrollView>

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "flex-start",
  },
});
