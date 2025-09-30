import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Image,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatBubble } from "../components/ChatBubble";
import { ChatInput } from "../components/ChatInput";
import { useToast } from "../hooks/usetoast";
import { useAuth } from "../hooks/useAuth";
import { useDatabase } from "../hooks/useDatabase";
import { islamicApiService } from "../services/islamicApi";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/RootNavigator";
import { History, Menu } from "lucide-react-native";

const irfanLogo = require("../assets/kuran.png");

const prompts = [
  { title: "Kur’an Tefsiri", subtitle: "Ayetlerin sırlarını ve hikmetlerini öğrenin." },
  { title: "Kutsal Dualar", subtitle: "Maneviyatınızı güçlendiren özel dua koleksiyonu." },
  { title: "Hadis Kaynağı", subtitle: "Sahih hadisler hakkında güvenilir bilgiler." },
  { title: "Namaz Rehberi", subtitle: "Doğru ve bilinçli ibadet için güvenilir kaynak." },
];

interface Message {
  id: string;
  text: string;
  type: "user" | "ai";
  timestamp: string;
}

export function Chat() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 64) / 2;

  const { toast } = useToast();
  const { user } = useAuth();
  const database = useDatabase(user?.id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const pulseAnim = useRef(new Animated.Value(0)).current;

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

      try {
        let sessionId = currentSessionId;
        if (!sessionId && user) {
          sessionId = await database.createChatSession(text, text);
          setCurrentSessionId(sessionId);
        }

        const response = await islamicApiService.getDemoResponse(text);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.answer || "Yanıt alınamadı",
          type: "ai",
          timestamp: getCurrentTimeStamp(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        if (sessionId && user) {
          await database.saveMessage(sessionId, text, "user");
          await database.saveMessage(sessionId, response.answer, "ai");
        }
      } catch (error) {
        console.error(error);
        toast({ title: "Hata", description: "Mesaj gönderilemedi." });
      }
    },
    [currentSessionId, user, database, toast]
  );

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
           
            <View
  style={{
    paddingTop: insets.top + 10,
    paddingHorizontal: 16,
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center",
  }}
>
  {/* Sol Settings */}
  <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
    <Menu color="#CCC" size={20} />
  </TouchableOpacity>

  {/* Sağ History */}
  <TouchableOpacity onPress={() => navigation.navigate("ChatHistory")}>
    <History color="#CCC" size={20} />
  </TouchableOpacity>
</View>

            <ScrollView
              ref={scrollRef}
              contentContainerStyle={[styles.messagesContainer, { justifyContent: "flex-end" }]}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ marginBottom: 95, alignItems: "center" }}>
                <View style={styles.logoContainer}>
                  <Animated.View
                    style={[
                      styles.glowEffect,
                      {
                        opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] }),
                        transform: [
                          {
                            scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }),
                          },
                        ],
                      },
                    ]}
                  />
                  <Image source={irfanLogo} style={styles.logo} />
                </View>

                <Text style={styles.arabicTitle}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
                <Text style={styles.title}>Yapay Zekâ Destekli İslami Rehberiniz</Text>
                <Text style={styles.subtitle}>"İslam’ın derinliklerindeki bilgileri kolayca keşfedin."</Text>

                <View style={[styles.grid, { justifyContent: "center", alignItems: "center" }]}>
                  {prompts.map((p) => (
                    <View key={p.title} style={[styles.card, { width: cardWidth }]}>
                      <Text style={styles.cardTitle}>{p.title}</Text>
                      <Text style={styles.cardSubtitle}>{p.subtitle}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message.text}
                  type={message.type}
                  timestamp={message.timestamp}
                />
              ))}
            </ScrollView>

            <View style={{ backgroundColor: "#000" }}>
              <ChatInput onSendMessage={handleSendMessage} />
            </View>
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
    justifyContent: "flex-end",
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 0,
    justifyContent: "flex-end",
  },
  logoContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 18,
  },
  glowEffect: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 20,
    backgroundColor: "#F2AE30",
    shadowColor: "#F2AE30",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
  },
  arabicTitle: {
    fontSize: 25,
    color: "#F2AE30",
    marginBottom: 12,
    textAlign: "center",
    writingDirection: "rtl",
    fontFamily: "Arial",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#F2AE30",
    marginBottom: 8,
    textShadowColor: "#F2AE3080",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 12,
    color: "#CCC",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: -8,
  },
 card: {
  backgroundColor: "#000",
  borderWidth: 0.5,
  borderColor: "#666",
  borderRadius: 12,
  padding: 20,
  height: 95,
  justifyContent: "center",
  transform: [{ scale: 0.9 }], 

  marginHorizontal: 1, 
  marginVertical: 4,  
},

  cardTitle: {
    fontWeight: "600",
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
  },
});

/*
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Image,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatBubble } from "../components/ChatBubble";
import { ChatInput } from "../components/ChatInput";
import { useToast } from "../hooks/usetoast";
import { useAuth } from "../hooks/useAuth";
import { useDatabase } from "../hooks/useDatabase";
import { islamicApiService } from "../services/islamicApi";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/RootNavigator";
import { History, Menu } from "lucide-react-native";

const irfanLogo = require("../assets/kuran.png");

const prompts = [
  { title: "Kur’an Tefsiri", subtitle: "Ayetlerin sırlarını ve hikmetlerini öğrenin." },
  { title: "Kutsal Dualar", subtitle: "Maneviyatınızı güçlendiren özel dua koleksiyonu." },
  { title: "Hadis Kaynağı", subtitle: "Sahih hadisler hakkında güvenilir bilgiler." },
  { title: "Namaz Rehberi", subtitle: "Doğru ve bilinçli ibadet için güvenilir kaynak." },
];

interface Message {
  id: string;
  text: string;
  type: "user" | "ai";
  timestamp: string;
}

export function Chat() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 64) / 2;

  const { toast } = useToast();
  const { user } = useAuth();
  const database = useDatabase(user?.id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const pulseAnim = useRef(new Animated.Value(0)).current;

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

      try {
        let sessionId = currentSessionId;
        if (!sessionId && user) {
          sessionId = await database.createChatSession(text, text);
          setCurrentSessionId(sessionId);
        }

        if (!sessionId) throw new Error("Session ID yok");

        const response = await islamicApiService.askQuestion(text, sessionId);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.success ? response.data?.answer || "Yanıt alınamadı" : "Yanıt alınamadı",
          type: "ai",
          timestamp: getCurrentTimeStamp(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        if (sessionId && user && response.success) {
          await database.saveMessage(sessionId, text, "user");
          await database.saveMessage(sessionId, response.data?.answer || "", "ai");
        }
      } catch (error) {
        console.error(error);
        toast({ title: "Hata", description: "Mesaj gönderilemedi." });
      }
    },
    [currentSessionId, user, database, toast]
  );

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View
              style={{
                paddingTop: insets.top + 10,
                paddingHorizontal: 16,
                backgroundColor: "#000",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Menu color="#CCC" size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("ChatHistory")}>
                <History color="#CCC" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollRef}
              contentContainerStyle={[styles.messagesContainer, { justifyContent: "flex-end" }]}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ marginBottom: 95, alignItems: "center" }}>
                <View style={styles.logoContainer}>
                  <Animated.View
                    style={[
                      styles.glowEffect,
                      {
                        opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] }),
                        transform: [
                          {
                            scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }),
                          },
                        ],
                      },
                    ]}
                  />
                  <Image source={irfanLogo} style={styles.logo} />
                </View>

                <Text style={styles.arabicTitle}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
                <Text style={styles.title}>Yapay Zekâ Destekli İslami Rehberiniz</Text>
                <Text style={styles.subtitle}>"İslam’ın derinliklerindeki bilgileri kolayca keşfedin."</Text>

                <View style={[styles.grid, { justifyContent: "center", alignItems: "center" }]}>
                  {prompts.map((p) => (
                    <View key={p.title} style={[styles.card, { width: cardWidth }]}>
                      <Text style={styles.cardTitle}>{p.title}</Text>
                      <Text style={styles.cardSubtitle}>{p.subtitle}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message.text}
                  type={message.type}
                  timestamp={message.timestamp}
                />
              ))}
            </ScrollView>

            <View style={{ backgroundColor: "#000" }}>
              <ChatInput onSendMessage={handleSendMessage} />
            </View>
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
    justifyContent: "flex-end",
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 0,
    justifyContent: "flex-end",
  },
  logoContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 18,
  },
  glowEffect: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 20,
    backgroundColor: "#F2AE30",
    shadowColor: "#F2AE30",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
  },
  arabicTitle: {
    fontSize: 25,
    color: "#F2AE30",
    marginBottom: 12,
    textAlign: "center",
    writingDirection: "rtl",
    fontFamily: "Arial",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#F2AE30",
    marginBottom: 8,
    textShadowColor: "#F2AE3080",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 12,
    color: "#CCC",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: -8,
  },
 card: {
  backgroundColor: "#000",
  borderWidth: 0.5,
  borderColor: "#666",
  borderRadius: 12,
  padding: 20,
  height: 95,
  justifyContent: "center",
  transform: [{ scale: 0.9 }], 

  marginHorizontal: 1, 
  marginVertical: 4,  
},

  cardTitle: {
    fontWeight: "600",
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
  },
});
*/
