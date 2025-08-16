import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/RootNavigator";
import { Header } from "../components/Header";

const irfanLogo = require("../assets/irfan-logo.png");

const prompts = [
  {
    title: "Kur’an Tefsiri",
    subtitle: "Ayetlerin sırlarını ve hikmetlerini öğrenin.",
    prompt: "Bana Fatiha Suresi'nin tefsirini ve derinliklerini anlatır mısın?",
  },
  {
    title: "Kutsal Dualar",
    subtitle: "Maneviyatınızı güçlendiren özel dua koleksiyonu.",
    prompt: "Sabah okunacak duaları ve faziletlerini öğrenmek istiyorum",
  },
  {
    title: "Hadis Kaynağı",
    subtitle: "Sahih hadisler hakkında güvenilir bilgiler.",
    prompt: "Güzel ahlak ile ilgili sahih hadisler nelerdir?",
  },
  {
    title: "Namaz Rehberi",
    subtitle: "Doğru ve bilinçli ibadet için güvenilir kaynak.",
    prompt: "Namazın rükünleri ve sünnetleri hakkında bilgi ver",
  },
];

export default function WelcomePrompts() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();


  const cardWidth = (width - 64) / 2;

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

  const handlePress = useCallback(
    (prompt: string) => {
      navigation.navigate("Chat", { initialPrompt: prompt });
    },
    [navigation]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          showMenu={true}
          onOpenMenu={() => navigation.navigate("Settings")}
          showLogo={true}
          title=""
        />

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Animated.View
              style={[
                styles.glowEffect,
                {
                  opacity: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.7],
                  }),
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Image source={irfanLogo} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.arabicTitle}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
            <Text style={styles.title}>Yapay Zekâ Destekli İslami Rehberiniz</Text>
            <Text style={styles.subtitle}>
              "İslam’ın derinliklerindeki bilgileri kolayca keşfedin."
            </Text>
          </View>

          <View style={styles.grid}>
            {prompts.map((p) => (
              <TouchableOpacity
                key={p.title}
                style={[styles.card, { width: cardWidth }]}
                activeOpacity={0.8}
                onPress={() => handlePress(p.prompt)}
              >
                <Text style={styles.cardTitle}>{p.title}</Text>
                <Text style={styles.cardSubtitle}>{p.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
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
  content: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  headerText: {
    marginBottom: 32,
    alignItems: "center",
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
  arabicTitle: {
    fontSize: 25,
    color: "#F2AE30",
    marginBottom: 12,
    textAlign: "center",
    writingDirection: "rtl",
    fontFamily: "Arial",
  },
  subtitle: {
    fontSize: 12,
    color: "#CCCCCC",
    textAlign: "center",
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#444",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 16,
    height: 120,
    marginBottom: 16,
    justifyContent: "center",
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: 17,
    color: "#CCCCCC",
    marginBottom: 16,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#ccc",
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
});
