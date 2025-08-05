import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./src/navigations/RootNavigator";
import Toast from "react-native-toast-message";

const linking = {
  prefixes: ["irfan://"],
  config: {
    screens: {
      ResetPassword: "reset-password"
    }
  }
};

export default function App() {
  return (
    <>
      <NavigationContainer linking={linking} fallback={<></>}>
        <RootNavigator />
      </NavigationContainer>
      <Toast />
    </>
  );
}
