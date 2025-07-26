import React, { useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Linking,
} from "react-native";
import { 
  ArrowLeft, 
  User, 
  Shield, 
  FileText, 
  LogOut, 
  ExternalLink,
  Trash2
} from "lucide-react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsProps {
  onBack: () => void;
  onLogout?: () => void;
  userProfile?: {
    email: string;
    display_name: string;
  };
}
const irfanLogo = require('../assets/irfan-logo.png');
export const Settings = ({ onBack, onLogout, userProfile }: SettingsProps) => {
  const [feedback, setFeedback] = useState("");


  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Veriler Temizlendi", "Tüm uygulama verileri silindi.");
    } catch (error) {
      Alert.alert("Hata", "Veriler temizlenirken bir hata oluştu.");
    }
  };

  const submitFeedback = () => {
    if (!feedback.trim()) return;

    // Burada API çağrısı yapılabilir
    Alert.alert("Geri Bildirim Gönderildi", "Değerli geri bildiriminiz için teşekkürler!");
    setFeedback("");
  };

  const handleLogout = () => {
    onLogout?.();
  };

  const openUrl = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Hata", "Bağlantı açılamıyor: " + url);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Image source={irfanLogo} style={styles.logo} />
          <Text style={styles.headerText}>Ayarlar</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Profile Section */}
        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <User size={20} color="#336699" />
            <Text style={styles.sectionTitle}>Profil Bilgileri</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-posta Adresi</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={userProfile?.email || ""}
              editable={false}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Görünen Ad</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={userProfile?.display_name || ""}
              editable={false}
            />
          </View>
        </View>

        {/* Feedback Section */}
        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color="#336699" />
            <Text style={styles.sectionTitle}>Geri Bildirim</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Görüş ve Önerileriniz</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="İrfan hakkındaki görüşlerinizi bizimle paylaşın..."
              multiline
              numberOfLines={5}
              value={feedback}
              onChangeText={setFeedback}
            />
          </View>
          <TouchableOpacity
            onPress={submitFeedback}
            disabled={!feedback.trim()}
            style={[styles.button, !feedback.trim() && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Geri Bildirim Gönder</Text>
          </TouchableOpacity>
        </View>

        {/* Legal Links */}
        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color="#336699" />
            <Text style={styles.sectionTitle}>Hukuki</Text>
          </View>
          <TouchableOpacity
            onPress={() => openUrl("https://example.com/privacy-policy")}
            style={styles.outlineButton}
          >
            <Text style={styles.outlineButtonText}>Gizlilik Politikası</Text>
            <ExternalLink size={16} color="#336699" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openUrl("https://example.com/terms-of-service")}
            style={styles.outlineButton}
          >
            <Text style={styles.outlineButtonText}>Kullanım Şartları</Text>
            <ExternalLink size={16} color="#336699" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Uygulama Bilgileri</Text>
          <View style={styles.infoRow}>
            <Text>Versiyon</Text>
            <Text>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text>Yapı</Text>
            <Text>2024.1</Text>
          </View>
          <View style={styles.infoRow}>
            <Text>Son Güncelleme</Text>
            <Text>23 Ocak 2025</Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={[styles.panel, styles.dangerZone]}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>Tehlikeli Bölge</Text>
          <TouchableOpacity
            onPress={clearAllData}
            style={[styles.outlineButton, styles.dangerButton]}
          >
            <Trash2 size={16} color="#d9534f" />
            <Text style={[styles.dangerButtonText, { marginLeft: 8 }]}>Tüm Verileri Sil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.outlineButton, styles.dangerButton]}
          >
            <LogOut size={16} color="#d9534f" />
            <Text style={[styles.dangerButtonText, { marginLeft: 8 }]}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  iconButton: { padding: 8 },
  headerTitle: { flexDirection: "row", alignItems: "center", marginLeft: 12 },
  logo: { width: 32, height: 32, borderRadius: 8, marginRight: 8 },
  headerText: { fontSize: 20, fontWeight: "600", color: "#000" },

  content: { padding: 16 },

  panel: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#336699",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#336699",
    marginLeft: 8,
  },

  inputGroup: { marginBottom: 16 },

  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },

  disabledInput: {
    backgroundColor: "#eee",
    color: "#888",
  },

  textarea: {
    height: 100,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#336699",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonDisabled: {
    backgroundColor: "#99aabb",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  outlineButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(51,102,153,0.3)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },

  outlineButtonText: {
    color: "#336699",
    fontSize: 16,
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  dangerZone: {
    borderColor: "#d9534f",
    borderWidth: 1,
  },

  dangerTitle: {
    color: "#d9534f",
  },

  dangerButton: {
    borderColor: "#d9534f",
    marginBottom: 12,
  },

  dangerButtonText: {
    color: "#d9534f",
    fontWeight: "600",
    fontSize: 16,
  },
});
