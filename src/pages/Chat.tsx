// src/pages/Chat.tsx
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Header } from "../components/Header";
import { ChatBubble } from "../components/ChatBubble";
import { ChatInput } from "../components/ChatInput";
import WelcomePrompts from "../components/WelcomePrompts";
import { ChatHistory } from "../components/ChatHistory";
import { Settings } from "../components/Settings";
import { useToast } from "../hooks/usetoast";
import { useAuth } from "../hooks/useAuth";
import { useDatabase } from "../hooks/useDatabase";
import { islamicApiService } from "../services/islamicApi";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/RootNavigator";

interface Message {
  id: string;
  text: string;
  type: "user" | "ai";
  timestamp: string;
}

type ChatView = "chat" | "history" | "settings";
type ChatRouteProp = RouteProp<RootStackParamList, "Chat">;

export function Chat() {
  const route = useRoute<ChatRouteProp>();
  const initialPrompt = route.params?.initialPrompt;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ChatView>("chat");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const database = useDatabase(user?.id);

  useEffect(() => {
    if (user && initialPrompt && messages.length === 0) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, user]);

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
        sessionId = await database.createChatSession(text, text);
        setCurrentSessionId(sessionId);
      }

      const response = await islamicApiService.getDemoResponse(text);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        type: "ai",
        timestamp: new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (sessionId && user) {
        await database.saveMessage(sessionId, text, "user");
        await database.saveMessage(sessionId, response.answer, "ai");
      }
    } catch (error) {
      toast({ title: "Hata", description: "Mesaj gönderilemedi." });
    } finally {
      setIsLoading(false);
    }
  };

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
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  messagesContainer: { padding: 16, paddingBottom: 100 },
  loadingContainer: { marginTop: 10, marginBottom: 20, alignItems: "flex-start" },
});
