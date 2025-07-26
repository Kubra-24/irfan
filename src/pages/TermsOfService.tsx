import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";

export default function TermsOfService() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Kullanım Şartları</Text>

        <View style={styles.panel}>
          <Section
            title="1. Hizmet Tanımı"
            content="İrfan, yapay zeka destekli İslami bilgiler asistanıdır. Uygulama, Kur'an-ı Kerim, hadisler ve İslami ilimler hakkında bilgi sağlar."
          />
          <Section
            title="2. Kullanım Koşulları"
            content="Uygulamamızı kullanırken İslami değerlere uygun davranmanızı, saygılı bir dil kullanmanızı ve hizmetimizi kötüye kullanmamanızı rica ederiz."
          />
          <Section
            title="3. İçerik Sorumluluğu"
            content="Uygulama tarafından sağlanan bilgiler referans amaçlıdır. Önemli dini konularda mutlaka uzman din alimlerine danışınız."
          />
          <Section
            title="4. Değişiklikler"
            content="Bu kullanım şartları herhangi bir zamanda güncellenebilir. Değişiklikler uygulama içinde duyurulacaktır."
          />
        </View>
      </View>
    </ScrollView>
  );
}

const Section = ({ title, content }: { title: string; content: string }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // bg-background
    padding: 24,
  },
  content: {
    maxWidth: 700,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#1e293b", // text-foreground
  },
  panel: {
    backgroundColor: "#ffffffcc", // glass-panel benzeri
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
    color: "#3b82f6", // text-primary
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748b", // text-muted-foreground
  },
});
