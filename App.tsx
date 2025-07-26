import React, { useState, useEffect } from "react";
import { SplashScreen } from './src/components/SplashScreen';

import { Onboarding } from './src/components/Onboarding';
import { AuthScreen } from './src/components/AuthScreen';
import { Chat } from './src/pages/Chat';
import { useAuth } from './src/hooks/useAuth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

type AppState = "splash" | "onboarding" | "auth" | "chat";

export default function App() {
  const [appState, setAppState] = useState<AppState>("splash");
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("irfan_onboarding_complete");
        setIsFirstTime(value === null);
      } catch (e) {
        // Hata durumunda onboarding'u göster
        setIsFirstTime(true);
      }
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (isFirstTime === null || loading) return;

    if (appState === "splash") {
      // Splash'tan sonra nereye geçilecek?
      if (isFirstTime) {
        setAppState("onboarding");
      } else {
        setAppState(user ? "chat" : "auth");
      }
    } else if (appState === "auth" && user) {
      setAppState("chat");
    } else if (appState === "chat" && !user) {
      setAppState("auth");
    }
  }, [user, loading, appState, isFirstTime]);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem("irfan_onboarding_complete", "true");
      setIsFirstTime(false);
      setAppState("auth");

      Toast.show({
        type: "success",
        text1: "Hoş geldin!",
        text2: "Kayıt tamamlandı. Şimdi giriş yapabilirsin.",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Onboarding durumu kaydedilemedi.",
      });
    }
  };

  const handleAuthSuccess = () => {
    setAppState("chat");

    Toast.show({
      type: "success",
      text1: "Giriş başarılı!",
      text2: "Hoş geldin.",
    });
  };

  if (loading || isFirstTime === null) {
    // İlk açılışta veya yükleniyorsa splash göster
    return <SplashScreen onComplete={() => {}} />;
  }

  switch (appState) {
    case "onboarding":
      return <Onboarding onComplete={handleOnboardingComplete} />;
    case "auth":
      return <AuthScreen onSuccess={handleAuthSuccess} />;
    case "chat":
      return <Chat />;
    case "splash":
    default:
      // Splash ekranını burada kontrol etmedik, ama ekstra güvenlik için tekrar ekledim
      return (
        <SplashScreen
          onComplete={() => {
            if (isFirstTime) setAppState("onboarding");
            else setAppState(user ? "chat" : "auth");
          }}
        />
      );
  }
}
