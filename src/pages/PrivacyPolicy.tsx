import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function PrivacyPolicy() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color="#888" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Gizlilik Politikası</Text>

        <View style={styles.panel}>
          <Section
            title="1. Veri Toplama"
            content="İrfan uygulaması, size daha iyi hizmet verebilmek için minimum düzeyde kişisel veri toplar. Toplanan veriler sadece e-posta adresiniz ve sohbet geçmişinizdir."
          />
          <Section
            title="2. Veri Kullanımı"
            content="Toplanan veriler sadece uygulama içi deneyiminizi kişiselleştirmek ve İslami bilgiler hizmetini sunmak için kullanılır. Verileriniz üçüncü taraflarla paylaşılmaz."
          />
          <Section
            title="3. Veri Güvenliği"
            content="Tüm verileriniz şifrelenerek saklanır ve en yüksek güvenlik standartlarıyla korunur. Verilerinize yetkisiz erişim engellenmiştir."
          />
          <Section
            title="4. İletişim"
            content="Gizlilik politikamız hakkında sorularınız için iletişime geçebilirsiniz: privacy@irfan.app"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const Section = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 24,
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: 12,  
    zIndex: 10,
  },
  content: {
    maxWidth: 700,
    alignSelf: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#F2AE30",
  },
  panel: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#CCCCCC",
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: "#888",
  },
});
