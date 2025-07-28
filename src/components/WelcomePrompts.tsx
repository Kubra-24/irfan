import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";

interface WelcomePromptsProps {
  readonly onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  {
    title: "Fatiha Suresi",
    subtitle: "Tefsiri ve anlamını öğren",
    prompt: "Bana Fatiha Suresi'nin tefsirini ve derinliklerini anlatır mısın?"
  },
  {
    title: "Sabah Duaları",
    subtitle: "Güne başlamak için",
    prompt: "Sabah okunacak duaları ve faziletlerini öğrenmek istiyorum"
  },
  {
    title: "Hadis Bilgisi",
    subtitle: "Sahih hadisler hakkında",
    prompt: "Güzel ahlak ile ilgili sahih hadisler nelerdir?"
  },
  {
    title: "Namaz Rehberi",
    subtitle: "Doğru ibadet için",
    prompt: "Namazın rükünleri ve sünnetleri hakkında bilgi ver"
  }
];

export default function WelcomePrompts({ onSelectPrompt }: Readonly<WelcomePromptsProps>) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>İrfan'a Hoş Geldiniz</Text>
        <Text style={styles.arabicTitle}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
        <Text style={styles.subtitle}>İslami bilgiler için yapay zeka destekli rehberiniz</Text>
      </View>

      <View style={styles.grid}>
        {prompts.map((p) => (
          <TouchableOpacity
            key={p.title}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => onSelectPrompt(p.prompt)}
          >
            <View>
              <Text style={styles.cardTitle}>{p.title}</Text>
              <Text style={styles.cardSubtitle}>{p.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2 - 8;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    textShadowColor: '#336699',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  arabicTitle: {
    fontSize: 40,
    color: "#336699",
    marginBottom: 12,
    textAlign: "center",
    writingDirection: "rtl",
    fontFamily: "Arial",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    maxWidth: 320,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(51, 102, 153, 0.2)",
    borderRadius: 12,
    padding: 20,
    width: cardWidth,
    margin: 8,
    justifyContent: "flex-start",
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: 18,
    color: "#000",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});
