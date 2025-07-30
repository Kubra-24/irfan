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
      <Stack.Screen name="Splash">
        {(props) => (
          <SplashScreen
            {...props}
            onComplete={() => props.navigation.navigate("Onboarding")}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Onboarding">
        {(props) => (
          <Onboarding
            {...props}
            onComplete={() => props.navigation.navigate("Auth")}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Auth">
        {(props) => (
          <AuthScreen
            {...props}
            onSuccess={() => {
              props.navigation.navigate("WelcomePrompts");
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

      <Stack.Screen name="WelcomePrompts">
        {(props) => (
          <WelcomePrompts
            {...props}
            onSelectPrompt={(prompt) => {
              console.log("Seçilen prompt:", prompt);
              // chat ekranına yönlendirme eklenecek
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
