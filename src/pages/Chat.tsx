import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"; 
import { ChatBubble } from "../components/ChatBubble";
import { ChatInput } from "../components/ChatInput";
import WelcomePrompts from "../components/WelcomePrompts";
import { useToast } from "../hooks/usetoast";
import { useAuth } from "../hooks/useAuth";
import { useDatabase } from "../hooks/useDatabase";
import { islamicApiService } from "../services/islamicApi";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Header } from "../components/Header";
import { RootStackParamList } from "../navigations/RootNavigator";
import { RouteProp, NavigationProp } from "@react-navigation/native";

interface Message {
  id: string;
  text: string;
  type: "user" | "ai";
  timestamp: string;
}

type ChatRouteProp = RouteProp<RootStackParamList, "Chat">;
type ChatNavigationProp = NavigationProp<RootStackParamList, "Chat">;

export function Chat() {
  const route = useRoute<ChatRouteProp>();
  const navigation = useNavigation<ChatNavigationProp>();
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets(); // Safe area insets alındı

  const initialPrompt = route.params?.initialPrompt;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();
  const database = useDatabase(user?.id);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (user && initialPrompt && messages.length === 0) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, user]);

  const getCurrentTimeStamp = () =>
    new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        type: "user",
        timestamp: getCurrentTimeStamp(),
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
          timestamp: getCurrentTimeStamp(),
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
    },
    [currentSessionId, user, database, toast]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}> 
    
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} 
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={{ paddingTop: insets.top, backgroundColor: "#000" }}>
              <Header
                onBack={() => navigation.goBack()}
                onOpenHistory={() => navigation.navigate("ChatHistory")}
                showHistory={true}
                showLogo={true}
                title=""
              />
            </View>

            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.messagesContainer}
              keyboardShouldPersistTaps="handled"
            >
              {messages.length === 0 ? (
                <WelcomePrompts />
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
                      <ActivityIndicator size="small" color="#2e2e2e" />
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  inner: {
    flex: 1,
    backgroundColor: "#000",
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  loadingContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "flex-start",
  },
});
