import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import WelcomePrompts from "./src/components/WelcomePrompts";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="WelcomePrompts">
            {(props) => (
              <WelcomePrompts
                {...props}
                onSelectPrompt={(prompt) => {
                  console.log("Test prompt seçildi:", prompt);
                }}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
