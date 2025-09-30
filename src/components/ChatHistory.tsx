import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "../hooks/usetoast";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/RootNavigator";
import { Header } from "../components/Header";
import { Swipeable } from "react-native-gesture-handler";

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messageCount: number;
}

type Props = NativeStackScreenProps<RootStackParamList, "ChatHistory"> & {
  onBack?: () => void;
  onSelectChat?: (chatId: string) => void;
};

export const ChatHistory = ({ navigation, onBack, onSelectChat }: Props) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      await loadChatHistory();
    })();
  }, []);

  const loadChatHistory = async () => {
    setIsLoading(true);
    try {
      const savedHistory = await AsyncStorage.getItem("irfan_chat_history");
      if (savedHistory) {
        setChatSessions(JSON.parse(savedHistory));
      } else {
        setChatSessions([
          {
            id: "1",
            title: "Fatiha Suresi Tefsiri",
            preview: "Bana Fatiha Suresi'nin tefsirini anlatır mısın?",
            timestamp: "2 saat önce",
            messageCount: 8,
          },
          {
            id: "2",
            title: "Sabah Duaları",
            preview: "Sabah okunacak duaları öğrenmek istiyorum",
            timestamp: "1 gün önce",
            messageCount: 5,
          },
          {
            id: "3",
            title: "Namaz Rehberi",
            preview: "Namazın rükünleri hakkında bilgi ver",
            timestamp: "3 gün önce",
            messageCount: 12,
          },
        ]);
      }
    } catch (error) {
      console.error("Sohbet geçmişi yüklenirken hata:", error);
      Alert.alert("Hata", "Sohbet geçmişi yüklenirken hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveChatHistory = async (sessions: ChatSession[]) => {
    try {
      await AsyncStorage.setItem("irfan_chat_history", JSON.stringify(sessions));
    } catch (error) {
      console.error("Sohbet geçmişi kaydedilemedi:", error);
      Alert.alert("Hata", "Sohbet geçmişi kaydedilemedi.");
    }
  };

  const deleteChatSession = useCallback(
    async (chatId: string) => {
      const updated = chatSessions.filter((chat) => chat.id !== chatId);
      setChatSessions(updated);
      await saveChatHistory(updated);

      toast({
        title: "Sohbet Silindi",
        description: "Sohbet geçmişi başarıyla silindi.",
      });
    },
    [chatSessions, saveChatHistory, toast]
  );

  const clearAllHistory = () => {
    Alert.alert(
      "Onayla",
      "Tüm sohbet geçmişini silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            setChatSessions([]);
            try {
              await AsyncStorage.removeItem("irfan_chat_history");
              toast({
                title: "Tüm Geçmiş Silindi",
                description: "Tüm sohbet geçmişi temizlendi.",
              });
            } catch (error) {
              console.error("Sohbet geçmişi temizlenemedi:", error);
              Alert.alert("Hata", "Sohbet geçmişi temizlenemedi.");
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  const renderRightActions = useCallback(
    (chatId: string) => (
      <TouchableOpacity
        style={styles.swipeDeleteButton}
        onPress={() => deleteChatSession(chatId)}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.swipeDeleteText}>Sil</Text>
      </TouchableOpacity>
    ),
    [deleteChatSession]
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatSession }) => (
      <Swipeable renderRightActions={() => renderRightActions(item.id)} overshootRight={false}>
        <TouchableOpacity
          style={styles.chatItem}
          onPress={() => onSelectChat?.(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.chatInfo}>
            <Text style={styles.chatTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.chatPreview} numberOfLines={2}>
              {item.preview}
            </Text>
            <View style={styles.chatMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={12} color="#888" />
                <Text style={styles.metaText}>{item.timestamp}</Text>
              </View>
              <Text style={styles.metaText}>{item.messageCount} mesaj</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    ),
    [onSelectChat, renderRightActions]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title="Sohbet Geçmişi"
          onBack={handleBack}
         
          showMenu={false}
          showHistory={false}
          rightComponent={
            chatSessions.length > 0 && (
              <TouchableOpacity
                onPress={clearAllHistory}
                style={styles.clearAllButton}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={20} color="#b22222" />
              </TouchableOpacity>
            )
          }
        />

        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color="#336699" />
              <Text style={styles.loadingText}>Sohbet geçmişi yükleniyor...</Text>
            </View>
          ) : chatSessions.length === 0 ? (
            <View style={styles.emptyWrapper}>
              <View style={styles.emptyIconWrapper}>
                <Ionicons name="chatbubble-ellipses-outline" size={40} color="#aaa" />
              </View>
              <Text style={styles.emptyTitle}>Henüz Sohbet Yok</Text>
              <Text style={styles.emptyText}>İlk sorunuzu sorarak sohbete başlayın</Text>
            </View>
          ) : (
            <FlatList
              data={chatSessions}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, backgroundColor: "#000" },

  clearAllButton: {
    padding: 8,
    marginRight: 8,
  },

  content: { flex: 1 },

  loadingWrapper: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#666" },

  emptyWrapper: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: "600", marginBottom: 8, color: "#ccc" },
  emptyText: { fontSize: 14, color: "#888", textAlign: "center" },

  listContent: { padding: 12, paddingBottom: 32 },

  chatItem: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  chatInfo: { flex: 1, marginRight: 8 },

  chatTitle: { fontWeight: "700", fontSize: 16, color: "#fff" },

  chatPreview: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },

  chatMeta: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },

  metaText: { fontSize: 12, color: "#888", marginLeft: 4 },

  swipeDeleteButton: {
    backgroundColor: "#b22222",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginTop: 6,
    marginBottom: 6,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },

  swipeDeleteText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});
