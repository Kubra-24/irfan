import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SplashScreen } from "../components/SplashScreen";
import { Onboarding } from "../components/Onboarding";
import { AuthScreen } from "../components/AuthScreen";
import { ForgotPassword } from "../components/ForgotPassword";
import WelcomePrompts from "../components/WelcomePrompts";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  ForgotPassword: undefined;
  WelcomePrompts: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Splash Screen */}
      <Stack.Screen
        name="Splash"
        children={(props) => (
          <SplashScreen
            {...props}
            onComplete={() => props.navigation.navigate("Onboarding")}
          />
        )}
      />

      
      <Stack.Screen
        name="Onboarding"
        children={(props) => (
          <Onboarding
            {...props}
            onComplete={() => props.navigation.navigate("Auth")}
          />
        )}
      />

      <Stack.Screen
        name="Auth"
        component={AuthScreen}
      />

      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

    
      <Stack.Screen
        name="WelcomePrompts"
        children={(props) => (
          <WelcomePrompts
            {...props}
            onSelectPrompt={(prompt) => {
              console.log("Seçilen prompt:", prompt);
              // Chat ekranına yönlendirme eklenecek
              
            }}
          />
        )}
      />
    </Stack.Navigator>
  );
};
