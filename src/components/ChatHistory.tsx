import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "../hooks/usetoast";
import { Ionicons } from "@expo/vector-icons";

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messageCount: number;
}

interface ChatHistoryProps {
  onBack: () => void;
  onSelectChat?: (chatId: string) => void;
}

const STORAGE_KEY = "irfan_chat_history";

export const ChatHistory = ({ onBack, onSelectChat }: ChatHistoryProps) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    setIsLoading(true);
    try {
      const savedHistory = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setChatSessions(JSON.parse(savedHistory));
      } else {
        // Demo data
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
      Alert.alert("Hata", "Sohbet geçmişi yüklenirken hata oluştu.");
    }
    setIsLoading(false);
  };

  const saveChatHistory = async (sessions: ChatSession[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      Alert.alert("Hata", "Sohbet geçmişi kaydedilemedi.");
    }
  };

  const deleteChatSession = async (chatId: string) => {
    const updated = chatSessions.filter((chat) => chat.id !== chatId);
    setChatSessions(updated);
    await saveChatHistory(updated);

    toast({
      title: "Sohbet Silindi",
      description: "Sohbet geçmişi başarıyla silindi.",
    });
  };

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
              await AsyncStorage.removeItem(STORAGE_KEY);
            } catch {
              Alert.alert("Hata", "Sohbet geçmişi temizlenemedi.");
            }
            toast({
              title: "Tüm Geçmiş Silindi",
              description: "Tüm sohbet geçmişi temizlendi.",
            });
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ChatSession }) => (
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

      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation?.();
          deleteChatSession(item.id);
        }}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color="#b22222" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#336699" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrapper}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#336699" />
          <Text style={styles.headerTitle}>Sohbet Geçmişi</Text>
        </View>

        {chatSessions.length > 0 && (
          <TouchableOpacity onPress={clearAllHistory} style={styles.clearAllButton}>
            <Ionicons name="trash-outline" size={16} color="#b22222" />
            <Text style={styles.clearAllText}>Tümünü Sil</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
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
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { padding: 6 },
  headerTitleWrapper: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerTitle: { fontSize: 18, fontWeight: "600", marginLeft: 6, color: "#336699" },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 6,
  },
  clearAllText: { color: "#b22222", fontWeight: "600", marginLeft: 4 },
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
  emptyTitle: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  emptyText: { fontSize: 14, color: "#888", textAlign: "center" },
  listContent: { padding: 12 },
  chatItem: {
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  chatInfo: { flex: 1, marginRight: 8 },
  chatTitle: { fontWeight: "700", fontSize: 16, color: "#222" },
  chatPreview: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  chatMeta: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    gap: 4,
  },
  metaText: { fontSize: 12, color: "#888", marginLeft: 4 },
  deleteButton: {
    padding: 6,
  },
});
