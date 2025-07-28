// src/navigations/RootNavigator.tsx
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SplashScreen } from "../components/SplashScreen";
import { Onboarding } from "../components/Onboarding";
import { AuthScreen } from "../components/AuthScreen";
import WelcomePrompts from "../components/WelcomePrompts";
import { Chat } from "../pages/Chat";
import { useAuth } from "../hooks/useAuth";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  WelcomePrompt: undefined;
  Chat: { initialPrompt?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  const [showSplash, setShowSplash] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);


  useEffect(() => {
    AsyncStorage.removeItem("irfan_onboarding_complete"); //onboarding test için sürekli görünür
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem("irfan_onboarding_complete");
      setIsFirstTime(value === null);
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (isFirstTime !== null && !loading) {
      const timer = setTimeout(() => setShowSplash(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isFirstTime, loading]);

  if (showSplash || isFirstTime === null || loading) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Stack.Navigator
      initialRouteName={isFirstTime ? "Onboarding" : user ? "WelcomePrompt" : "Auth"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Onboarding"
        children={({ navigation }) => (
          <Onboarding
            onComplete={async () => {
              await AsyncStorage.setItem("irfan_onboarding_complete", "true");
              navigation.replace("Auth");
            }}
          />
        )}
      />

      <Stack.Screen
        name="Auth"
        children={({ navigation }) => (
          <AuthScreen onSuccess={() => navigation.replace("WelcomePrompt")} />
        )}
      />

      <Stack.Screen
        name="WelcomePrompt"
        children={({ navigation }) => (
          <WelcomePrompts
            onSelectPrompt={(prompt) => {
              navigation.replace("Chat", { initialPrompt: prompt });
            }}
          />
        )}
      />

      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
}
