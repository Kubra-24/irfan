import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SplashScreen } from "../components/SplashScreen";
import { Onboarding } from "../components/Onboarding";
import { AuthScreen } from "../components/AuthScreen";
import { ForgotPassword } from "../components/ForgotPassword";
import { ResetPassword } from "../components/ResetPassword";
import { Chat } from "../pages/Chat";
import { ChatHistory } from "../components/ChatHistory";
import { Settings } from "../components/Settings";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  Chat: { initialPrompt?: string } | undefined;
  ChatHistory: undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Splash"
        children={(props) => (
          <SplashScreen {...props} onComplete={() => props.navigation.navigate("Onboarding")} />
        )}
      />
      <Stack.Screen
        name="Onboarding"
        children={(props) => (
          <Onboarding {...props} onComplete={() => props.navigation.navigate("Auth")} />
        )}
      />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen
        name="ChatHistory"
        children={(props) => (
          <ChatHistory
            {...props}
            onBack={() => props.navigation.goBack()}
            onSelectChat={(chatId) => {
              props.navigation.navigate("Chat", { initialPrompt: chatId });
            }}
          />
        )}
      />
      <Stack.Screen
        name="Settings"
        children={(props) => (
          <Settings
            {...props}
            onBack={() => props.navigation.goBack()}
            onLogout={() => props.navigation.navigate("Auth")}
           
          />
        )}
      />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsOfService" component={TermsOfService} />
    </Stack.Navigator>
  );
};
