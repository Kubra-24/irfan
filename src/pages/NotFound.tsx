import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute, NavigationProp } from "@react-navigation/native";

// RootParamList tipini kendi projene göre güncellemen lazım
type RootParamList = {
  Chat: undefined;
  Auth: undefined;
  Onboarding: undefined;
  // diğer ekranlar burada tanımlı olabilir
};

const NotFound = () => {
  const navigation = useNavigation<NavigationProp<RootParamList>>();
  const route = useRoute();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      route?.name || "Unknown route"
    );
  }, [route]);

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Chat" }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Oops! Page not found</Text>
        <Text style={styles.link} onPress={handleGoHome}>
          Return to Home
        </Text>
      </View>
    </View>
  );
};

export default NotFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6", // gray-100
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: "#4b5563", // gray-600
    marginBottom: 16,
  },
  link: {
    color: "#3b82f6", // blue-500
    textDecorationLine: "underline",
  },
});
