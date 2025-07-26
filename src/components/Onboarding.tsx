import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { ArrowRight, ArrowLeft } from "lucide-react-native";

const slides = [
  {
    id: 1,
    title: "İrfan'a Hoş Geldiniz",
    titleArabic: "أهلاً وسهلاً بكم في إرفان",
    subtitle: "Maneviyat yolculuğunuzda size özel bir rehber",
    description: "İslami bilgilere modern ve akıcı bir şekilde ulaşın",
    image: require("../assets/irfan-logo.png"),
  },
  {
    id: 2,
    title: "Keşfet ve Öğren",
    titleArabic: "اكتشف وتعلم",
    subtitle: "Ayetleri sorgulayın, hadisleri öğrenin",
    description: "Tefsirlerin derinliklerine inin ve İslami ilimleri keşfedin",
    image: require("../assets/islamic-pattern.png"),
  },
  {
    id: 3,
    title: "Gizli İlimler Hazinesi",
    titleArabic: "كنز العلوم الخفية",
    subtitle: "Hayatınızdaki anlara özel dualar",
    description: "Manevi rehberlik ve özel durumlar için dua hazinesi",
    image: require("../assets/mosque-silhouette.png"),
  },
  {
    id: 4,
    title: "Hemen Başlayın",
    titleArabic: "ابدأ الآن",
    subtitle: "İslami bilgiler için sorularınızı sorun",
    description: "Yapay zeka destekli rehberinizle sohbete başlayın",
    image: require("../assets/irfan-logo.png"),
  }
];

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
    else onComplete();
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
        <Text style={styles.skipText}>Geç</Text>
      </TouchableOpacity>

      <Image source={slide.image} style={styles.image} resizeMode="contain" />

      <Text style={styles.titleArabic}>{slide.titleArabic}</Text>
      <Text style={styles.title}>{slide.title}</Text>

      <Text style={styles.subtitle}>{slide.subtitle}</Text>
      <Text style={styles.description}>{slide.description}</Text>

      <View style={styles.pagination}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentSlide ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.navButtons}>
        <TouchableOpacity onPress={prevSlide} disabled={currentSlide === 0} style={[styles.navButton, currentSlide === 0 && styles.disabled]}>
          <ArrowLeft size={20} color={currentSlide === 0 ? "#ccc" : "#000"} />
          <Text style={[styles.navText, currentSlide === 0 && styles.disabledText]}>Geri</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={nextSlide} style={styles.navButton}>
          <Text style={styles.navText}>{currentSlide === slides.length - 1 ? "Başla" : "İleri"}</Text>
          <ArrowRight size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  skipButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: "#666",
    fontSize: 16,
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 24,
  },
  titleArabic: {
    fontSize: 24,
    fontWeight: "700",
    color: "#336699",
    fontFamily: "Arial",
    textAlign: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#336699",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: "#336699",
    width: 24,
    shadowColor: "#336699",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  inactiveDot: {
    backgroundColor: "#ccc",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  navText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 8,
    color: "#000",
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#aaa",
  },
});
