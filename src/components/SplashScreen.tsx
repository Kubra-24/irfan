import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Easing } from "react-native";

const irfanLogo = require("../assets/irfan-logo.png");
const bismillahCalligraphy = require("../assets/bismillah-calligraphy.png");

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [showBismillah, setShowBismillah] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  const bismillahOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Loading dots için animasyon değerleri
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowBismillah(true);
      Animated.timing(bismillahOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 500);

    const timer2 = setTimeout(() => {
      setShowLogo(true);
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 1500);

    const timer3 = setTimeout(() => onComplete(), 3500);

    // Loading dots animasyonu sonsuz döngü
    const createPulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
            delay,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

    const pulse1 = createPulse(dot1Anim, 0);
    const pulse2 = createPulse(dot2Anim, 200);
    const pulse3 = createPulse(dot3Anim, 400);

    pulse1.start();
    pulse2.start();
    pulse3.start();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      pulse1.stop();
      pulse2.stop();
      pulse3.stop();
    };
  }, [bismillahOpacity, logoOpacity, onComplete, dot1Anim, dot2Anim, dot3Anim]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showBismillah && (
          <Animated.Image
            source={bismillahCalligraphy}
            style={[styles.bismillahImage, { opacity: bismillahOpacity }]}
            resizeMode="contain"
          />
        )}

        {showLogo && (
          <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
            <Image source={irfanLogo} style={styles.logoImage} />
            <Text style={styles.logoTitle}>إرفان</Text>
            <Text style={styles.logoSubtitle}>Yapay Zeka İslami Rehberiniz</Text>
          </Animated.View>
        )}
      </View>

      {/* Animated Loading indicator */}
      <View style={styles.loadingDots}>
        {[dot1Anim, dot2Anim, dot3Anim].map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
                transform: [
                  {
                    scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  bismillahImage: {
    width: 256,
    height: 128,
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginBottom: 12,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#336699",
    fontFamily: "Arial",
  },
  logoSubtitle: {
    fontSize: 14,
    color: "#888",
  },
  loadingDots: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 60,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#336699",
  },
});
